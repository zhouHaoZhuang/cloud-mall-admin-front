<template>
  <div class="dashboard-container">
    <!-- 头部用户信息 -->
    <div class="header-user-info">
      <a-avatar :size="64" icon="user" />
      <span class="welcome">欢迎您回来，</span>
      <span class="name">启航</span>
      <div class="icons">
        <div class="icon-item">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>提示文字</span>
            </template>
            <div class="icon-item-imgs">
              <img src="@/assets/img/dashboard/card.png" />
              <!-- <img src="@/assets/img/dashboard/card-a.png" /> -->
            </div>
          </a-tooltip>
        </div>
        <div class="icon-item">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>提示文字</span>
            </template>
            <div class="icon-item-imgs">
              <!-- <img src="@/assets/img/dashboard/phone.png" /> -->
              <img src="@/assets/img/dashboard/phone-a.png" />
            </div>
          </a-tooltip>
        </div>
        <div class="icon-item">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>提示文字</span>
            </template>
            <div class="icon-item-imgs">
              <img src="@/assets/img/dashboard/email.png" />
              <!-- <img src="@/assets/img/dashboard/email-a.png" /> -->
            </div>
          </a-tooltip>
        </div>
        <div class="icon-item">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>提示文字</span>
            </template>
            <div class="icon-item-imgs">
              <img src="@/assets/img/dashboard/lock.png" />
              <!-- <img src="@/assets/img/dashboard/lock-a.png" /> -->
            </div>
          </a-tooltip>
        </div>
      </div>
    </div>
    <!-- 主体 -->
    <div class="content">
      <!-- 账户概览 + 消费趋势 + 待办事项 -->
      <div class="item">
        <!-- 账户概览 -->
        <div class="public-box overview">
          <div class="public-tit">账户概览</div>
          <div class="info">
            <div class="left-box">
              <span class="txt">可用余额（元）</span>
              <div class="price strong">{{ overviewData.balance.balance }}</div>
            </div>
            <div class="coupon">
              <span class="txt">可用代金券（元）</span>
              <div class="price">{{ overviewData.coupon.balance }}</div>
            </div>
          </div>
          <div class="btns">
            <a-button type="primary" @click="goRecharge">充值</a-button>
          </div>
        </div>
        <!-- 消费趋势 -->
        <div class="public-box trend">
          <div class="public-top">
            <div class="public-tit">消费趋势</div>
            <div class="jump">查看></div>
          </div>
          <div id="echarts" class="echarts-pie-content"></div>
          <div class="consumption text-overflow">
            本月消费：￥{{ trendOut }}
          </div>
          <div class="income text-overflow">本月收入：￥{{ trendIn }}</div>
        </div>
        <!-- 待办事项 -->
        <div class="public-box todolist">
          <div class="public-tit">待办事项</div>
          <div class="list">
            <div class="todo-item">
              <div class="left-txt">
                <span class="count">0</span>
                个待续费产品
              </div>
              <div class="jump">前往续费></div>
            </div>
            <div class="todo-item">
              <div class="left-txt">
                <span class="count">0</span>
                个未完成订单
              </div>
              <div class="jump">前往支付></div>
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
            <div class="list-item">
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
            <div class="jump">查看全部></div>
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
import * as echarts from "echarts";
require("echarts/theme/macarons"); //引入主题
export default {
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.initEcharts();
    });
  },
  data() {
    return {
      charts: null,
      chartLine: null,
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
      cloudCount: 0
    };
  },
  created() {
    this.getDashboardData();
  },
  methods: {
    // 获取数据
    getDashboardData() {
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
      this.$store.dispatch("dashboard/trendData").then((res) => {
        const newData = res.data.map((ele) => {
          if (ele.type === "I") {
            this.trendIn = ele.dealAmount;
            return {
              type: ele.type,
              value: ele.dealAmount,
              name: "收入记录"
            };
          }
          if (ele.type === "O") {
            this.trendOut = ele.dealAmount;
            return {
              type: ele.type,
              value: ele.dealAmount,
              name: "消费记录"
            };
          }
        });
        this.trendData.data = [...newData];
      });
      this.$store.dispatch("dashboard/getCloudCount").then((res) => {
        this.cloudCount = res.data;
      });
    },
    // 跳转充值
    goRecharge() {
      this.$router.push({
        path: "/user/finance/recharge"
      });
    },
    initEcharts() {
      this.charts = echarts.init(document.getElementById("echarts"));
      this.charts.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ["#00BBFF", "#FFAD33"],
        legend: {
          data: ["消费记录", "收入记录"],
          left: "right",
          top: "center",
          orient: "vertical",
          itemGap: 50
        },
        series: this.trendData
      });
    }
  }
};
</script>

<style lang="less" scoped>
.dashboard-container {
  height: 100%;
  background: #f3f4f5;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 24px 40px;
  .echarts-pie-content {
    position: absolute;
    left: -65px;
    width: 355px;
    height: 184px;
    margin-bottom: 60px;
  }
  .header-user-info {
    display: flex;
    align-items: center;
    height: 56px;
    margin-top: 8px;
    margin-bottom: 24px;
    .welcome {
      color: #a0a2a3;
      font-size: 14px;
      margin: 0 20px;
      margin-right: 5px;
    }
    .name {
      font-size: 22px;
      margin-right: 25px;
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
      color: #a0a2a3;
    }
  }
  .content {
    .item {
      display: flex;
      margin-bottom: 24px;
      justify-content: space-between;
      .overview,
      .trend,
      .todolist,
      .news {
        width: 32.5%;
        height: 240px;
        position: relative;
      }
      .open-product {
        width: 66.25%;
      }
      .overview {
        .public-tit {
          margin-bottom: 35px;
        }
        .info {
          cursor: pointer;
          display: flex;
          justify-content: space-around;
          padding: 0 20px 0 0;
          margin-bottom: 35px;
          height: 62px;
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
          max-width: 140px;
          position: absolute;
          left: 206px;
        }
        .consumption {
          top: 127px;
        }
        .income {
          top: 185px;
        }
      }
      .todolist {
        .list {
          margin-top: 18px;
          .todo-item {
            height: 44px;
            background: #f7f9fa;
            border: 1px solid #f7f9fa;
            font-size: 12px;
            margin-top: 6px;
            color: #636566;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 16px;
            .left-txt {
              display: flex;
              align-items: center;
              .count {
                margin-right: 10px;
                font-size: 20px;
                color: #272829;
              }
            }
            .jump {
              font-size: 12px;
              color: #00aaff;
            }
            &:hover {
              border-color: #00aaff;
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
</style>
