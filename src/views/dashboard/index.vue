<template>
  <div class="dashboard-container">
    <!-- 头部用户信息 -->
    <div class="header-user-info">
      <a-avatar :size="64" icon="user" />
      <span class="welcome">欢迎您回来</span>
      <span class="name">启航</span>
      <div class="icons">
        <div class="icon-item">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>提示文字</span>
            </template>
            <div class="icon-item-imgs">
              <img src="@/assets/img/dashboard/card.png" />
              <img src="@/assets/img/dashboard/card-a.png" />
            </div>
          </a-tooltip>
        </div>
        <div class="icon-item">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>提示文字</span>
            </template>
            <div class="icon-item-imgs">
              <img src="@/assets/img/dashboard/phone.png" />
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
              <img src="@/assets/img/dashboard/email-a.png" />
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
              <img src="@/assets/img/dashboard/lock-a.png" />
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
        <div class="overview"></div>
        <!-- 消费趋势 -->
        <div class="trend">
          <div id="echarts" class="echarts-pie-content"></div>
        </div>
        <!-- 待办事项 -->
        <div class="todolist"></div>
      </div>
      <!-- 已开通产品 + 新闻公告 -->
      <div class="item">
        <!-- 已开通产品 -->
        <div class="open-product"></div>
        <!-- 新闻公告 -->
        <div class="news"></div>
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
      chartLine: null
    };
  },
  created() {},
  methods: {
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
        series: [
          {
            name: "消费趋势",
            type: "pie",
            radius: ["50%", "70%"],
            center: ["50%", "50%"],
            data: [
              { value: 335, name: "消费记录" },
              { value: 310, name: "收入记录" }
            ],
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
            }
          }
        ]
      });
    }
  }
};
</script>

<style lang="less" scoped>
.dashboard-container {
  height: 100%;
  .echarts-pie-content {
    width: 315px;
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
    }
  }
}
</style>
