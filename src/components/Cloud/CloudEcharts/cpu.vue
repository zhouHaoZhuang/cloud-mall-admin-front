<template>
  <div id="cpu-echarts-line" class="cpu-echarts-content"></div>
</template>

<script>
import * as echarts from "echarts";
import moment from "moment";
export default {
  props: {
    // 查询数据的参数
    listQuery: {
      type: Object,
      default: () => {}
    },
    // 是否切换到了监控页面
    tabsKey: {
      type: String,
      default: "1"
    }
  },
  data() {
    return {
      chartLine: null,
      xData: []
    };
  },
  watch: {
    listQuery: {
      handler(newVal) {
        this.getData();
      },
      immediate: true,
      deep: true
    },
    tabsKey: {
      handler(newVal) {
        if (newVal === "2") {
          this.getData();
        }
      }
    }
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.chartLine.resize(); //刷新画布 监听屏幕大小，来刷新画布
    });
  },
  methods: {
    // 获取数据
    getData() {
      // 生成x轴数据
      this.getLineChatsXData();
      // Namespace为acs_ecs_dashboard
      // Period默认为60秒，也可以为60的整数倍
      // MetricName取值参考如下说明：
      // cpu使用率：CPUUtilization
      // 内存使用率：memory_usedutilization
      // 系统负载：load_1m、load_5m、load_15m
      // 读写BPS: DiskReadBPS、DiskWriteBPS
      // 云盘读写IOPS: DiskReadIOPS、DiskWriteIOPS
      // 云盘使用率：diskusage_utilization
      // Inode使用率： fs_inodeutilization
      // 公网出入带宽： VPC_PublicIP_InternetOutRate、VPC_PublicIP_InternetInRate
      // 内网出入带宽：IntranetOutRate、IntranetInRate
      // ECS同时连接数：concurrentConnections
      const data = {
        ...this.listQuery,
        metricName: "CPUUtilization"
      };
      // this.$store.dispatch("cloud/getMonitorData", data).then((res) => {});
    },
    // 根据listQuery的时间筛选，生成折线图x轴的数据
    getLineChatsXData() {
      console.log(
        (this.listQuery.cycle * 60 * 60) / (this.listQuery.period * 1)
      );
      // 根据所选时间+间隔计算得出需要循环多少次得出X轴
      const count =
        (this.listQuery.cycle === 0 ? 1 : this.listQuery.cycle * 60 * 60) /
        (this.listQuery.period * 1);
      const newXData = [];
      for (let index = 0; index < count; index++) {
        if (index === 0) {
          newXData.push(
            moment(this.listQuery.startTime).format("YYYY-MM-DD HH:mm")
          );
        } else {
          const lastNewData = newXData[newXData.length - 1];
          newXData.push(
            moment(lastNewData)
              .add((this.listQuery.period * 1) / 60, "m")
              .format("YYYY-MM-DD HH:mm")
          );
        }
      }
      this.xData = [...newXData];
      this.$nextTick(() => {
        this.initLineEcharts();
      });
    },
    initLineEcharts() {
      this.chartLine = echarts.init(
        document.getElementById("cpu-echarts-line")
      );
      const option = {
        tooltip: {
          trigger: "axis",
          textStyle: {
            fontSize: "12",
            fontWeight: "normal",
            color: "#666"
          },
          formatter: function (params) {
            console.log(params);
            return params.name;
          }
        },
        color: ["#0064C8", "#17C393", "#FECB00"],
        legend: {
          data: ["CPU Total"],
          left: "center",
          top: "bottom",
          icon: "circle",
          itemHeight: 7 //修改icon图形大小
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisTick: {
              show: false
            },
            data: this.xData,
            axisLabel: {
              formatter: (param) => {
                return moment(param).format("HH:mm");
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            },
            min: "0",
            max: "100",
            axisLabel: {
              formatter: (val) => {
                return val + "%";
              }
            }
          }
        ],
        series: [
          {
            name: "CPU Total",
            type: "line",
            stack: "总量",
            symbol: "none", // 去掉小圆点
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1 //设置线条粗细
                }
              }
            },
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
          }
        ]
      };
      this.chartLine.setOption(option);
    }
  }
};
</script>

<style lang="less" scoped>
.cpu-echarts-content {
}
</style>
