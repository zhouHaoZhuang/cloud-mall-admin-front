<template>
  <div class="cpu-echarts-content">
    <a-spin :spinning="loading" wrapperClassName="spin">
      <div class="chart-title">{{ title }}</div>
      <div :id="`${lineChartType}-echarts-line`" class="echarts-line"></div>
    </a-spin>
  </div>
</template>

<script>
import * as echarts from "echarts";
import moment from "moment";
import { getLineChatsXData } from "@/utils/echartsFn";
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
    },
    // 头部文字
    title: {
      type: String
    },
    // 折线图类型，监控类型
    lineChartType: {
      type: String
    },
    // y轴单位---如果是百分比，y轴要设置最大最小值
    yUnit: {
      type: String,
      default: ""
    },
    // 鼠标悬浮在折线上显示的单位
    tooltipUnit: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      chartLine: null,
      xData: [],
      chartData: [],
      loading: false,
      // 所有监控类型的对象
      // Namespace为acs_ecs_dashboard
      // Period默认为60秒，也可以为60的整数倍
      // MetricName取值参考如下说明：
      lineChartTypeObj: {
        // cpu使用率：CPUUtilization
        cpu: [
          {
            params: "CPUUtilization",
            legend: "CPU Total"
          }
        ],
        // 内存使用率：memory_usedutilization
        memory: [
          {
            params: "memory_usedutilization",
            legend: "Memory Used Utilization"
          }
        ],
        // 系统负载：load_1m、load_5m、load_15m
        systemLoad: [
          {
            params: "load_1m",
            legend: "Load 1m"
          },
          {
            params: "load_5m",
            legend: "Load 5m"
          },
          {
            params: "load_15m",
            legend: "Load 15m"
          }
        ],
        // 云盘读写BPS: DiskReadBPS、DiskWriteBPS
        readBPS: [
          {
            params: "DiskReadBPS",
            legend: "Disk Read BPS"
          },
          {
            params: "DiskWriteBPS",
            legend: "Disk BPS Write"
          }
        ],
        // 云盘读写IOPS: DiskReadIOPS、DiskWriteIOPS
        cloudDiskIOPS: [
          {
            params: "DiskReadIOPS",
            legend: "Disk IOPS Read"
          },
          {
            params: "DiskWriteIOPS",
            legend: "Disk IOPS Write"
          }
        ],
        // 云盘使用率：diskusage_utilization , fs_inodeutilization
        cloudDiskUse: [
          {
            params: "diskusage_utilization",
            legend: "Disk Usage Utilization"
          },
          {
            params: "fs_inodeutilization",
            legend: "Inode Utilization"
          }
        ],
        // 公网出入带宽： VPC_PublicIP_InternetOutRate、VPC_PublicIP_InternetInRate
        outWidth: [
          {
            params: "VPC_PublicIP_InternetOutRate",
            legend: "VPC PublicIP Internet Out Rate"
          },
          {
            params: "VPC_PublicIP_InternetInRate",
            legend: "VPC PublicIP Internet In Rate"
          }
        ],
        // 内网出入带宽：IntranetOutRate、IntranetInRate
        innerWidth: [
          {
            params: "IntranetOutRate",
            legend: "Intranet Out Rate"
          },
          {
            params: "IntranetInRate",
            legend: "Intranet In Rate"
          }
        ],
        // ECS同时连接数：concurrentConnections
        ecsCount: [
          {
            params: "concurrentConnections",
            legend: "Concurrent Connections"
          }
        ]
      },
      // 折线图数据
      seriesList: []
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
    // 返回渲染折线图的数据
    getChartSeries(res) {
      let newList = [];
      res.forEach((ele, index) => {
        newList.push({
          name: this.lineChartTypeObj[this.lineChartType][index].legend,
          type: "line",
          symbol: "none", // 去掉小圆点
          lineStyle: {
            width: 1 //设置线条粗细
          },
          data: JSON.parse(ele.data.dataPoints).map((item) => item.Average)
        });
      });
      console.log("最终的数据", newList);
      this.seriesList = [...newList];
      // 生成折线图
      this.$nextTick(() => {
        this.initLineEcharts();
      });
    },
    // 获取数据
    getData() {
      // 生成x轴数据
      this.xData = [...getLineChatsXData(this.listQuery)];
      // 请求数据
      this.loading = true;
      // 多个请求的数组
      let reqArr = [];
      // 请求多个或单个数据
      this.lineChartTypeObj[this.lineChartType].forEach((ele) => {
        const data = {
          ...this.listQuery,
          metricName: ele.params
        };
        reqArr.push(this.$store.dispatch("cloud/getMonitorData", data));
      });
      Promise.all(reqArr)
        .then((result) => {
          this.getChartSeries(result);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 返回y轴是否有最大最小值
    getMaxAndMin() {
      if (this.yUnit === "%") {
        return {
          min: "0",
          max: "100"
        };
      } else {
        return {};
      }
    },
    // 生成折线图
    initLineEcharts() {
      this.chartLine = echarts.init(
        document.getElementById(`${this.lineChartType}-echarts-line`)
      );
      const option = {
        tooltip: {
          trigger: "axis",
          textStyle: {
            fontSize: "12",
            fontWeight: "normal",
            color: "#666"
          },
          formatter: (params) => {
            let str = "";
            const color = ["#0064C8", "#17C393", "#FECB00"];
            for (var i = 0; i < params.length; i++) {
              if (i === 0) {
                str += `<div v-if='i===0' style='margin-bottom:6px'>${params[i].name}</div>`;
              }
              str += `
                    <div style='display:flex;align-items:center'>
                      <div style='width:5px;height:5px;background:${color[i]};border-radius:50%'></div>
                      <span style='margin:0 20px 0 10px'>${params[i].seriesName}：</span>
                      <span>${params[i].data}${this.tooltipUnit}</span>
                    </div>`;
            }
            return str;
          }
        },
        color: ["#0064C8", "#17C393", "#FECB00"],
        legend: {
          data: this.lineChartTypeObj[this.lineChartType].map(
            (ele) => ele.legend
          ),
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
            ...this.getMaxAndMin(),
            axisLabel: {
              formatter: (val) => {
                return val + this.yUnit;
              }
            }
          }
        ],
        series: this.seriesList
      };
      this.chartLine.setOption(option);
    }
  }
};
</script>

<style lang="less" scoped>
.cpu-echarts-content {
  position: relative;
  .spin {
    width: 100%;
    height: 100%;
    .chart-title {
      position: absolute;
      font-size: 16px;
      font-weight: bold;
      top: 14px;
    }
    .echarts-line {
      height: 253px;
      width: 100%;
    }
  }
}
</style>
