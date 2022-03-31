<template>
  <div class="cdn-dashboard-container">
    <div class="left">
      <div class="top-box">
        <div class="public-box">
          <div class="top-title">基础数据</div>
          <div class="content">
            <div class="top-radios">
              <a-radio-group v-model="date" @change="checkTime">
                <a-radio-button value="today"> 今日 </a-radio-button>
                <a-radio-button value="yesterday"> 昨日 </a-radio-button>
                <a-radio-button value="thisMonth"> 当月 </a-radio-button>
                <a-radio-button value="lastMonth"> 上月 </a-radio-button>
              </a-radio-group>
            </div>
            <div class="data-box">
              <div class="item">
                <div class="title">总流量</div>
                <div class="info">
                  <span class="strong">{{ baseData.totalTraf }}</span>
                  {{ baseData.totalTrafUint }}
                </div>
              </div>
              <div class="line"></div>
              <div class="item">
                <div class="title">HTTPS请求数</div>
                <div class="info">
                  <span class="strong">{{ baseData.httpsReqCount }}</span>
                  {{ baseData.httpsReqCountUnit }}
                </div>
              </div>
              <div class="line"></div>
              <div class="item domain">
                <div class="title">域名</div>
                <div class="info">
                  <span class="strong">{{ baseData.domainCount }}</span>
                  个
                  <div class="txt">
                    产生流量域名{{ baseData.useTrafDomainCount }}个
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-box">
        <div class="public-box type">
          <div class="top-title">
            计费方式
            <span class="color-txt">按流量计费</span>
          </div>
          <div class="content">
            <div class="item">
              <div class="box">
                <a-button type="link" @click="handleJumpCloud">
                  价格详情
                </a-button>
              </div>
              <div class="box">
                <a-button
                  type="link"
                  @click="handleJump('/control/cdn/consumption')"
                >
                  用量查询
                </a-button>
              </div>
            </div>
            <div class="item">
              <div class="box">
                <a-button
                  type="link"
                  @click="handleJump('/control/cdn/consumption')"
                >
                  用量汇总查询
                </a-button>
              </div>
            </div>
          </div>
        </div>
        <div class="public-box">
          <div class="top-title">
            全部域名
            <span class="color-txt">{{ baseData.domainCount }}</span>
            个
          </div>
          <div class="content">
            <div class="item">
              <div class="box">
                <a-button
                  type="link"
                  @click="handleJump('/control/cdn/domain')"
                >
                  创建新域名
                </a-button>
              </div>
              <div class="box">
                <a-button
                  type="link"
                  @click="handleJump('/control/cdn/domain')"
                >
                  管理
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="public-box">
        <div class="top-title">域名流量排行</div>
        <div class="content">
          <a-table
            :pagination="false"
            :rowKey="(record, index) => index"
            :columns="columns"
            :data-source="data"
          >
            <div slot="domainTotalTraf" slot-scope="text, record">
              {{ text }}{{ record.unit }}
            </div>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jumpCloudMall, jumpCloudMallOpen } from "@/utils/index";
import moment from "moment";
export default {
  components: {},
  computed: {},
  data() {
    return {
      moment,
      columns: [
        {
          title: "域名",
          dataIndex: "domain"
        },
        {
          title: "总流量",
          dataIndex: "domainTotalTraf",
          scopedSlots: {
            customRender: "domainTotalTraf"
          }
        }
      ],
      data: [],
      loading: false,
      baseData: {
        domainCount: "",
        httpsReqCount: "",
        totalTraf: "",
        useTrafDomainCount: "",
        httpsReqCountUnit: "",
        totalTrafUint: ""
      },
      date: "today"
    };
  },
  created() {
    this.skipInstant();
  },
  methods: {
    skipInstant() {
      //判断是否开通过CDN服务
      // 判断是否开通过,开通过就提示,没开通过就让跳转,开通过进行提示
      this.$store.dispatch("dashboard/isAccountSetup").then((res) => {
        console.log(res, "返回结果");
        // 开通过
        if (res.code === "000000") {
          if (res.data === true) {
            this.getData(this.currentDate()[this.date]);
            console.log("已开通CDN服务");
          } else {
            // 未开通
            console.log("未开通");
            this.$message.warning("请先开通CDN服务");
            setInterval(() => {
              jumpCloudMall("/instant-open", false);
            }, 2000);
          }
        } else {
          this.$message.warning(res.msg);
        }
      });
    },
    // 跳转云商城价格详情
    handleJumpCloud() {
      jumpCloudMall("/price-detail", true);
    },
    // 控制台跳转
    handleJump(path) {
      this.$router.push(path);
    },
    //获取时间 (今日，昨日,当月，上月)
    currentDate() {
      return {
        thisMonth: {
          billingCycle: this.moment().startOf("month").format("YYYY-MM"),
          granularity: "month"
        },
        lastMonth: {
          billingCycle: this.moment().subtract(1, "months").format("YYYY-MM"),
          granularity: "month"
        },
        today: {
          billingDate: this.moment().format("YYYY-MM-DD"),
          granularity: "day"
        },
        yesterday: {
          billingDate: this.moment().subtract(1, "days").format("YYYY-MM-DD"),
          granularity: "day"
        }
      };
    },
    // 请求概览数据
    getData(data) {
      this.$store.dispatch("cdndashboard/getData", data).then((res) => {
        this.baseData = { ...this.baseData, ...res.data };
        this.data = res.data.domainList;
      });
    },
    // 时间选择
    checkTime(e) {
      console.log(`checked = ${e.target.value}`, this.date);
      this.getData(this.currentDate()[this.date]);
    }
  }
};
</script>

<style lang="less" scoped>
.cdn-dashboard-container {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background: #f0f2f5;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 40px;
  .public-box {
    background: #fff;
    .top-title {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #ccc;
      padding-left: 24px;
      font-size: 14px;
      font-weight: 600;
      .color-txt {
        color: #02baf6;
        margin: 0 15px;
      }
    }
    .content {
      padding: 24px;
    }
  }
  .left {
    flex: 1;
    margin-right: 40px;
    .top-box {
      .content {
        padding-bottom: 13px;
      }
      .top-radios {
        display: flex;
        justify-content: flex-end;
      }
      .data-box {
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        .item {
          width: 30%;
          height: 70px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-left: 20px;
          .title {
            font-weight: 700;
            font-size: 16px;
          }
          .info {
            font-weight: normal;
            .strong {
              font-size: 22px;
              font-weight: 700;
            }
            .txt {
              color: #ccc;
            }
          }
        }
        .domain {
          .info {
            margin-top: 15px;
          }
        }
        .line {
          width: 1px;
          height: 50px;
          background: #ccc;
        }
      }
    }
    .bottom-box {
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      .public-box {
        width: 45%;
        .item {
          display: flex;
          margin-bottom: 10px;
          .box {
            padding: 0 10px;
            border-radius: 4px;
            border: 1px solid #aaa;
            margin-right: 10px;
            .ant-btn {
              color: #000;
            }
            &:hover {
              border: 1px solid #02a7f1;
              .ant-btn {
                color: #02a7f1;
              }
            }
          }
        }
      }
    }
  }
  .right {
    width: 280px;
    .public-box {
      min-height: 455px;
    }
    .content {
      padding: 24px 10px;
    }
  }
}
</style>
<style lang="less">
.cdn-dashboard-container {
  .right {
    .ant-table {
      min-width: 100px !important;
    }
  }
}
</style>
