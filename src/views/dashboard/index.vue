<template>
  <div class="dashboard-container">
    <!-- 头部用户信息 -->
    <div class="header-user-info">
      <img src="@/assets/img/dashboard/new_user.png" />
      <!-- <a-avatar :size="64" icon="user" /> -->
      <span class="welcome">欢迎您回来，</span>
      <span class="name">{{ realName }}</span>
      <div class="icons">
        <div class="icon-item" @click="handleJump('/user/setting/security')">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>绑定手机</span>
            </template>
            <div class="icon-item-imgs">
              <!-- <img src="@/assets/img/dashboard/phone.png" /> -->
              <img src="@/assets/img/dashboard/phone-a.png" />
            </div>
          </a-tooltip>
        </div>
        <div class="icon-item" @click="handleJump('/user/setting/security')">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>绑定邮箱</span>
            </template>
            <div class="icon-item-imgs">
              <img
                v-if="!userRealInfo.email"
                src="@/assets/img/dashboard/email.png"
              />
              <img v-else src="@/assets/img/dashboard/email-a.png" />
            </div>
          </a-tooltip>
        </div>
        <div class="icon-item" @click="handleJump('/user/setting/realname')">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>实名认证</span>
            </template>
            <div class="icon-item-imgs">
              <img
                v-if="!userRealInfo.realName"
                src="@/assets/img/dashboard/card.png"
              />
              <img v-else src="@/assets/img/dashboard/card-a.png" />
            </div>
          </a-tooltip>
        </div>
        <!-- <div class="icon-item" @click="handleJump('/user/setting/security')">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>设置密保问题</span>
            </template>
            <div class="icon-item-imgs">
              <img src="@/assets/img/dashboard/lock.png" />
              <img src="@/assets/img/dashboard/lock-a.png" />
            </div>
          </a-tooltip>
        </div> -->
      </div>
    </div>
    <!-- 主体 -->
    <div class="content">
      <!-- 账户概览 + 消费趋势 + 待办事项 -->
      <div class="item">
        <!-- 账户概览 -->
        <div class="public-box overview">
          <div class="public-tit">账户概览</div>
          <div class="info box-one">
            <div class="top-box">
              <span class="txt">可用余额（元）</span>
              <div class="price strong">
                {{ overviewData.balance.balance }}
              </div>

              <a-button class="btns" type="primary" @click="goRecharge"
                >充值</a-button
              >
            </div>
          </div>
          <div class="info box-two">
            <div class="bottom-box">
              <span class="txt">可用代金券（元）</span>
              <div class="price strong">{{ overviewData.coupon.balance }}</div>
            </div>
          </div>
        </div>
        <!-- 消费趋势 -->
        <div class="public-box trend">
          <div class="public-top">
            <div class="public-tit">消费趋势</div>
            <!-- <div class="jump">查看></div> -->
          </div>
          <div id="echarts" class="echarts-pie-content"></div>
          <div class="consumption text-overflow">
            本月消费：<span class="font-bold">{{ trendOut }}</span>
          </div>
          <div class="income text-overflow">
            本月收入：
            <span class="font-bold">{{ trendIn }}</span>
          </div>
        </div>
        <!-- 待办事项 -->
        <div class="public-box todolist">
          <div class="public-tit">待办事项</div>
          <div class="list">
            <div class="todo-item" @click="handleJump('/user/renew/cloud')">
              <div class="left-txt">
                <span class="count">{{ todoObj.ecsCount }}</span>
                个待续费产品
              </div>
              <a-button type="primary">前往续费</a-button>
            </div>
            <div class="todo-item" @click="handleJump('/user/finance/trash')">
              <div class="left-txt">
                <span class="count">{{ todoObj.toPayOrder }}</span>
                个未完成订单
              </div>
              <a-button type="primary">前往支付</a-button>
            </div>
            <!-- <div class="todo-item">
              <div class="left-txt">
                <span class="count">0</span>
                个未处理工单
              </div>
              <div class="jump">前往处理></div>
            </div> -->
          </div>
        </div>
      </div>
      <!-- 已开通产品 + 新闻公告 -->
      <div class="item">
        <!-- 已开通产品 -->
        <div class="public-box open-product">
          <div class="public-tit">已开通产品</div>
          <div class="list">
            <div class="list-item" @click="handleJump('/control/server/admin')">
              <div class="left-box">
                <a-icon class="icon" type="cloud-server" />
              </div>
              <div class="right">
                <div class="title">
                  云服务器
                  <span class="strong">({{ cloudCount }})</span>
                </div>
                <div class="info text-overflow">极速稳定高弹性的计算服务</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 新闻公告 -->
        <div class="public-box news">
          <div class="public-top">
            <div class="public-tit">新闻公告</div>
            <!-- <div class="jump">查看全部></div> -->
          </div>
          <div class="list">
            <div class="new-item"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import * as echarts from "echarts";
require("echarts/theme/macarons"); //引入主题
export default {
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      userRealInfo: (state) => state.user.userRealInfo
    }),
    realName() {
      if (this.userRealInfo && this.userRealInfo.realName) {
        return "*" + this.userRealInfo.realName.slice(1);
      } else {
        return this.userRealInfo.phoneNumber;
      }
    }
  },
  data() {
    return {
      charts: null,
      chartLine: null,
      outMoney: [],
      inMoney: [],
      monthData: [],
      allDays: [],
      // 账户余额信息
      overviewData: {
        balance: {},
        coupon: {
          balance: "0.00"
        }
      },
      // 消费趋势折线图数据
      trendData: {
        name: "消费趋势",
        type: "pie",
        radius: ["50%", "70%"],
        center: ["50%", "50%"],
        label: {
          show: true,
          position: "center",
          formatter: "本月统计"
        },
        emphasis: {
          label: {
            show: true,
            formatter: "本月统计"
          }
        },
        labelLine: {
          show: false
        },
        data: []
      },
      trendIn: "0.00",
      trendOut: "0.00",
      // 云服务器数量
      cloudCount: 0,
      // 待办事项对象
      todoObj: {
        ecsCount: 0,
        toPayOrder: 0
      }
    };
  },
  created() {
    this.getDashboardData();
    this.getOrderAndRenewCount();
    this.getAlllMonth();
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.chartLine.resize(); //刷新画布 监听屏幕大小，来刷新画布
    });
    //获取每一天的日期
  },
  methods: {
    //获取当月所有消费和收入总和
    getAlllMonth() {
      this.$store.dispatch("dashboard/trendData").then((res) => {
        if (res.data && res.data.length > 0) {
          const I = res.data.find((ele) => ele.type === "I");
          const O = res.data.find((ele) => ele.type === "O");
          const newIDealAmount = (I && I.dealAmount) || 0;
          const newODealAmount = (O && O.dealAmount) || 0;
          this.trendIn = newIDealAmount;
          this.trendOut = newODealAmount;
        }
      });
    },
    //获取当前月的每一天
    getAllDays() {
      return new Promise((resolve, reject) => {
        this.$store.dispatch("dashboard/getAllDay").then((res) => {
          resolve(res.data);
        });
      });
    },
    // 获取数据
    async getDashboardData() {
      this.$store.dispatch("dashboard/getBalanceAndCoupon").then((res) => {
        const newData = {
          balance: {},
          coupon: {
            balance: "0.00"
          }
        };
        res.data.forEach((ele) => {
          if (ele.accountType === 1) {
            newData.balance = { ...ele };
          }
          if (ele.accountType === 2) {
            newData.coupon = { ...ele };
          }
        });
        this.overviewData = { ...newData };
      });
      this.allDays = await this.getAllDays();
      //获取每一天的消费记录
      this.$store.dispatch("dashboard/newTrendData").then((res) => {
        let data = res.data;
        //消费记录
        this.outMoney = this.allDays.map((ele) => {
          const newObj = data.O.find((item) => item.time === ele);
          return {
            dealAmount: newObj !== undefined ? newObj.dealAmount : 0
          };
        });
        this.outMoney = this.outMoney.map((ele) => {
          return ele.dealAmount;
        });

        //收入记录
        this.inMoney = this.allDays.map((ele) => {
          const newObj = data.I.find((item) => item.time === ele);
          return {
            dealAmount: newObj !== undefined ? newObj.dealAmount : 0
          };
        });
        this.inMoney = this.inMoney.map((ele) => {
          return ele.dealAmount;
        });
        this.initEcharts();
      });
      // 获取服务器数量
      this.$store.dispatch("dashboard/getCloudCount").then((res) => {
        this.cloudCount = res.data;
      });
    },
    // 获取未完成订单和待续费数量
    getOrderAndRenewCount() {
      this.$store.dispatch("dashboard/getOrderAndRenewCount").then((res) => {
        this.todoObj = { ...res.data };
      });
    },
    // 跳转充值
    goRecharge() {
      this.$router.push({
        path: "/user/finance/recharge"
      });
    },
    // 跳转
    handleJump(path) {
      this.$router.push(path);
    },
    initEcharts() {
      this.charts = echarts.init(document.getElementById("echarts"));
      const option = {
        tooltip: {
          trigger: "axis"
        },
        color: ["#9ECBFB", "#FECD84"],
        legend: {
          itemHeight: 2,
          itemWidth: 20,
          orient: "vertical",
          right: "4%",
          data: [
            {
              name: "消费记录(元)",
              icon: "rect"
            },
            {
              name: "收入记录(元)",
              icon: "rect"
            }
          ]
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.allDays,
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: false
          }
        },

        series: [
          {
            name: "消费记录(元)",
            type: "line",
            smooth: true,
            stack: "Total",
            symbol: "none",
            data: this.outMoney
          },
          {
            name: "收入记录(元)",
            symbol: "none",

            type: "line",
            smooth: true,
            stack: "Total",
            data: this.inMoney
          }
        ]
      };
      this.charts.setOption(option);
    }
  }
};
</script>

<style lang="less" scoped>
.dashboard-container {
  height: 100%;
  background: #f5f7fd;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 24px 40px;
  .echarts-pie-content {
    width: 570px;
    height: 270px;
    // position: absolute;
    // left: -65px;
    // width: 355px;
    // height: 184px;
    // margin-bottom: 60px;
  }
  .header-user-info:hover {
    box-shadow: 0px 0px 13px 7px rgba(189, 192, 253, 0.23);
  }

  .header-user-info {
    display: flex;
    align-items: center;
    height: 110px;
    margin-top: 8px;
    margin-bottom: 24px;
    background-color: #fff;
    padding: 25px 0 25px 40px;
    .welcome {
      color: #a0a2a3;
      font-size: 14px;
      margin: 0 20px;
      margin-right: 5px;
      margin-left: 40px;
    }
    .name {
      font-size: 22px;
      margin-right: 25px;
      color: #3b77e3;
    }
    .icons {
      display: flex;
      align-items: center;
      .icon-item {
        margin-left: 10px;
      }
    }
  }
  .public-box {
    padding: 0 24px;
    background: #fff;
    position: relative;
    .public-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .jump {
        padding-top: 24px;
        font-size: 12px;
        color: #00aaff;
      }
    }
    .public-tit {
      padding-top: 24px;
      font-size: 16px;
      color: #333333;
      font-weight: 600;
    }
  }
  .content {
    .item {
      display: flex;
      margin-bottom: 24px;
      justify-content: space-between;
      .overview {
        width: 410px;
        height: 294px;
        position: relative;
        .box-one {
          width: 100%;
          height: 90px;
          line-height: 40px;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 30px;
          .top-box {
            .strong {
              font-weight: 600;
              font-size: 28px;
              color: #3b77e3;
            }
            .btns {
              position: absolute;
              right: 24px;
              top: 80px;
            }
            .txt {
              color: #666666;
            }
          }
        }
        .box-two {
          width: 100%;
          height: 90px;
          line-height: 40px;
          .bottom-box {
            margin-top: 16px;
            .strong {
              font-weight: 600;
              font-size: 28px;
              color: #3b77e3;
            }
            .txt {
              color: #666666;
            }
          }
        }
      }
      .trend {
        width: 770px;
        height: 294px;
        position: relative;
      }
      .todolist {
        width: 460px;
        height: 294px;
        position: relative;
      }
      .news:hover,
      .overview:hover,
      .trend:hover,
      .todolist:hover {
        box-shadow: 0px 0px 13px 7px rgba(189, 192, 253, 0.23);
      }
      .news {
        width: 460px;
        height: 294px;
        position: relative;
      }
      // .overview,
      // .trend,
      // .todolist,
      // .news {
      //   width: 32.5%;
      //   height: 240px;
      //   position: relative;
      // }
      .open-product:hover {
        box-shadow: 0px 0px 13px 7px rgba(189, 192, 253, 0.23);
      }
      .open-product {
        width: 1210px;
        height: 294px;
        position: relative;
      }
      .overview {
        .public-tit {
          margin-bottom: 12px;
        }
        .info {
          .left-box,
          .coupon {
            width: 50%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .price {
              font-size: 22px;
            }
            .strong {
              color: #ff6600;
            }
          }
          .coupon {
            border-left: 1px solid #e1e4e6;
            padding-left: 20px;
          }
        }
      }
      .trend {
        .consumption,
        .income {
          // max-width: 140px;
          position: absolute;
          left: 582px;
        }
        .consumption {
          top: 126px;
        }
        .income {
          top: 164px;
        }
      }
      .todolist {
        .list {
          margin-top: 18px;
          .todo-item:nth-child(1) {
            border-bottom: 1px solid #f9f9f9;
          }
          .todo-item {
            height: 84px;
            font-size: 12px;
            margin-top: 6px;
            color: #636566;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 16px;
            cursor: pointer;
            .left-txt {
              display: flex;
              align-items: center;
              .count {
                margin-right: 10px;
                font-size: 22px;
                color: #272829;
              }
            }
            .jump {
              font-size: 12px;
              color: #00aaff;
            }
            &:hover {
              // border-color: #00aaff;
              background: #fff;
            }
          }
        }
      }
      .open-product {
        .list {
          margin-top: 20px;
          .list-item {
            display: flex;
            height: 72px;
            border: 1px solid #fff;
            width: 32.5%;
            margin-right: 1.25%;
            padding-top: 15px;
            cursor: pointer;
            .left-box {
              width: 63px;
              height: 72px;
              display: flex;
              justify-content: center;
              .icon {
                font-size: 38px;
                color: #a0a2a3;
              }
            }
            .right {
              .title {
                font-size: 14px;
                color: #272829;
                .strong {
                  color: #00aaff;
                }
              }
              .info {
                width: 72%;
                font-size: 12px;
                color: #a0a2a3;
              }
            }
            &:hover {
              border-color: #00aaff;
            }
          }
          .list-item:nth-child(3n) {
            margin-right: 0;
          }
        }
      }
      .news {
        .list {
          margin-top: 20px;
        }
      }
    }
  }
}
.font-bold {
  font-weight: 600;
  font-size: 18px;
}
</style>
