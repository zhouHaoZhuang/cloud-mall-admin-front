<template>
  <div class="dashboard-container">
    <div id="echarts" class="echarts-pie-content"></div>
    <div id="echarts-line" class="echarts-line-content"></div>
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
      this.initLineEcharts();
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
    },
    initLineEcharts() {
      this.chartLine = echarts.init(document.getElementById("echarts-line"));
      let option = {
        tooltip: {
          trigger: "axis",
          formatter: (param) => {
            console.log("tooltip", param);
            return param.data.time + param.data.value;
          }
        },
        color: ["#00BBFF", "#FFAD33"],
        legend: {
          data: ["邮件营销", "联盟广告"],
          left: "center",
          top: "bottom"
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisTick: {
              show: false
            },
            data: [
              "周一",
              "周二",
              "周三",
              "周四",
              "周五",
              "周六",
              "周日",
              "周一",
              "周二",
              "周三",
              "周四",
              "周五",
              "周六",
              "周日",
              "周一",
              "周二",
              "周三",
              "周四",
              "周五",
              "周六",
              "周日",
              "周一",
              "周二",
              "周三",
              "周四",
              "周五",
              "周六",
              "周日",
              "周一",
              "周二",
              "周三",
              "周四",
              "周五",
              "周六",
              "周日",
              "周一",
              "周二",
              "周三",
              "周四",
              "周五",
              "周六",
              "周日",
              "周一",
              "周二",
              "周三",
              "周四",
              "周五",
              "周六",
              "周日",
              "周一",
              "周二",
              "周三",
              "周四",
              "周五",
              "周六",
              "周日",
              "周一",
              "周二",
              "周三",
              "周四",
              "周五",
              "周六",
              "周日"
            ]
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            },
            axisLabel: {
              formatter: (val) => {
                return val + "K";
              }
            }
          }
        ],
        series: [
          {
            name: "邮件营销",
            type: "line",
            stack: "总量",
            data: [
              {
                time: "2021-12-28 14:50:00",
                value: 123
              },
              {
                time: "2021-12-28 14:59:00",
                value: 50
              },
              {
                time: "2021-12-28 15:50:00",
                value: 160
              },
              {
                time: "2021-12-28 16:50:00",
                value: 130
              },
              {
                time: "2021-12-28 17:50:00",
                value: 12
              }
            ],
            formatter: (params) => {
              return params.data.value;
            }
          },
          {
            name: "联盟广告",
            type: "line",
            stack: "总量",
            data: [
              {
                time: "2021-12-28 14:50:00",
                value: 100
              },
              {
                time: "2021-12-28 14:50:00",
                value: 200
              },
              {
                time: "2021-12-28 14:50:00",
                value: 16
              },
              {
                time: "2021-12-28 14:50:00",
                value: 500
              },
              {
                time: "2021-12-28 14:50:00",
                value: 60
              }
            ],
            formatter: (params) => {
              return params.data.value;
            }
          }
        ]
      };
      this.chartLine.setOption(option);
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
  .echarts-line-content {
    width: 700px;
    height: 400px;
  }
}
</style>
