<template>
  <div class="cdn-query-container">
    <div class="top-search">
      <div class="left">
        <a-space>
          <a-select
            style="width: 100px"
            allowClear
            v-model="listQuery.area"
            placeholder="请选择"
          >
            <a-select-option value="CN"> 中国内地 </a-select-option>
            <a-select-option value="OverSeas"> 全球 </a-select-option>
            <a-select-option value="all"> 以上全部区域 </a-select-option>
          </a-select>
          <a-select
            style="width: 150px"
            allowClear
            v-model="listQuery.field"
            placeholder="请选择"
          >
            <a-select-option value="traf"> 流量 </a-select-option>
            <a-select-option value="acc"> HTTPS请求数 </a-select-option>
          </a-select>
          <a-select
            style="width: 200px"
            allowClear
            v-model="listQuery.domainName"
            placeholder="请选择域名"
          >
            <!-- <a-select-option value=""> 全部域名 </a-select-option> -->
            <a-select-option
              :value="item.domain"
              v-for="item in domainList"
              :key="item.domain"
            >
              {{ item.domain }}
            </a-select-option>
          </a-select>
        </a-space>
      </div>
      <div class="right">
        <a-space>
          <a-radio-group v-model="date" @change="handleRadioChange">
            <a-radio-button value="toDay"> 今天 </a-radio-button>
            <a-radio-button value="yesterday"> 昨天 </a-radio-button>
            <a-radio-button value="aWeek"> 近7日 </a-radio-button>
            <a-radio-button value="nearlyMonth"> 近30日 </a-radio-button>
          </a-radio-group>
          <a-range-picker
            :show-time="{
              hideDisabledOptions: true,
              defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('11:59:59', 'HH:mm:ss')
              ]
            }"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="['开始时间', '结束时间']"
            @change="datePickerOnOk"
          />
          <a-button type="primary" @click="handleSearch"> 查询 </a-button>
        </a-space>
      </div>
    </div>
    <!-- <CdnEcharts
      title="流量"
      lineChartType="cpu"
      yUnit="%"
      tooltipUnit="%"
      :tabsKey="tabsKey"
      :listQuery="listQuery"
    /> -->
    <div class="Echarts">
      <div id="main" style="height: 400px"></div>
    </div>
    <div class="title">明细</div>
    <div v-if="data.length > 0">
      <a-table
        style="margin-top: 20px"
        :columns="columns"
        :data-source="data"
        :rowKey="(record, index) => index"
        :pagination="false"
      >
        <div slot="titleValue">
          {{
            this.listQuery.field === "traf" ? "总流量（G）" : "总流量（万次）"
          }}
        </div>
        <div v-if="text" slot="value" slot-scope="text">
          {{ (text / 1024 ** 3).toFixed(2) }}
        </div>
        <template slot="footer">
          <div class="total">
            <span>总计</span>
            <span
              >{{ totalFlow !== "" ? totalFlow.toFixed(2) : "" }}
              {{ this.listQuery.field === "traf" ? "G" : "万次" }}
            </span>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
// import CdnEcharts from "@/components/Cdn/cdnEcharts/index";
import * as echarts from "echarts";
import moment from "moment";
export default {
  props: {
    tabsKey: {
      type: Number,
      default: 1
    }
  },
  // components: {
  //   CdnEcharts
  // },
  data() {
    return {
      moment,
      echarts,
      listQuery: {
        area: "CN",
        field: "traf",
        startTime: "",
        interval: "3600",
        endTime: "",
        domainName: undefined
      },
      domainList: [],
      columns: [
        {
          title: "时间",
          dataIndex: "timeStamp",
          sorter: (a, b) =>
            new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
        },
        {
          // title: { customRender: "titleValue" },
          dataIndex: "value",
          slots: { title: 'titleValue' },
          scopedSlots: { customRender: "value" }
        }
      ],
      date: "toDay",
      data: [{}],
      option: {
        title: {
          text: "流量"
        },
        tooltip: {
          show: true,
          trigger: "axis"
        },
        legend: {
          data: ["流量"],
          align: "left"
        },
        xAxis: {
          type: "category",
          data: ["00.00", "00.10", "00.20", "00.30", "00.40", "00.50"]
        },
        yAxis: {
          type: "value"
        },
        toolbox: {
          show: true,
          feature: {
            restore: {}
          }
        },
        // geo: {
        //   componentType: "geo",
        //   // Geo 组件在 option 中的 index
        //   geoIndex: '1',
        //   // 点击区域的名称，比如"上海"
        //   name: '上海',
        //   // 传入的点击区域的 region 对象，见 geo.regions
        //   region: [
        //     {
        //       name: "广东",
        //       itemStyle: {
        //         areaColor: "red",
        //         color: "red"
        //       }
        //     }
        //   ]
        // },
        dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            xAxisIndex: [0],
            filterMode: "filter"
          }
        ],
        series: [
          {
            name: "流量",
            type: "line",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      },
      totalFlow: ""
    };
  },
  created() {
    console.log(this.getDate());
    this.getDomainList();
    this.listQuery.startTime = this.getDate()[this.date].startTime;
    this.listQuery.endTime = this.getDate()[this.date].endTime;
  },
  methods: {
    myEcharts() {
      var myChart = this.echarts.init(document.getElementById("main"));
      //配置图表
      myChart.setOption(this.option, true);
    },
    // 日期选择
    datePickerOnOk(value) {
      if (value.length !== 0) {
        this.listQuery.startTime = moment(value[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.listQuery.endTime = moment(value[1]).format("YYYY-MM-DD HH:mm:ss");
        console.log(
          moment.utc(value[1], "YYYY-MM-DD hh:mm:ss").toISOString().slice(0, -5)
        );
      } else {
        this.listQuery.startTime = "";
        this.listQuery.endTime = "";
      }
    },
    // 搜索
    handleSearch() {
      console.log(this.listQuery, "listQuery");
      this.getData();
    },
    handleRadioChange(e) {
      // this.
      console.log(e.target.value);
      this.listQuery.startTime = this.getDate()[e.target.value].startTime;
      this.listQuery.interval = this.getDate()[e.target.value].interval;
      this.listQuery.endTime = this.getDate()[e.target.value].endTime;
    },
    getDate() {
      return {
        toDay: {
          startTime: this.moment().startOf("day").format("YYYY-MM-DD 00:00:00"),
          endTime: this.moment().startOf("day").format("YYYY-MM-DD 23:59:59"),
          interval: "3600"
        },
        yesterday: {
          startTime: this.moment()
            .subtract(1, "days")
            .format("YYYY-MM-DD 00:00:00"),
          endTime: this.moment()
            .subtract(1, "days")
            .format("YYYY-MM-DD 23:59:59"),
          interval: "3600"
        },
        aWeek: {
          startTime: this.moment()
            .subtract(7, "days")
            .format("YYYY-MM-DD 00:00:00"),
          endTime: this.moment()
            .subtract(1, "days")
            .format("YYYY-MM-DD 23:59:59"),
          interval: "86400"
        },
        nearlyMonth: {
          startTime: this.moment()
            .subtract(30, "days")
            .format("YYYY-MM-DD 00:00:00"),
          endTime: this.moment()
            .subtract(1, "days")
            .format("YYYY-MM-DD 23:59:59"),
          interval: "86400"
        }
      };
    },
    // 获取表格数据
    getData(data) {
      this.$store
        .dispatch("cdndashboard/getUsage", {
          ...this.listQuery
        })
        .then((res) => {
          console.log(res, "---------");
          this.data = res.data.usageDataPerInterval.dataModule;
          let dateList = [];
          let flowList = [];
          let totalFlow = 0;
          this.data.forEach((item) => {
            if (this.date === "aWeek" || this.date === "nearlyMonth") {
              dateList.push(item.timeStamp.substring(5, 11));
            } else {
              dateList.push(item.timeStamp.substring(11, 16));
            }
            flowList.push((item.value / 1024 ** 3).toFixed(2));
            totalFlow += item.value * 1;
          });
          this.totalFlow = totalFlow / 1024 ** 3;
          this.$set(this.option, "xAxis", {
            type: "category",
            data: dateList
          });
          this.$set(this.option, "series", [
            {
              name: this.listQuery.field === "traf" ? "流量" : "HTTPS请求数",
              type: "line",
              data: flowList
            }
          ]);
          this.option.title.text =
            this.listQuery.field === "traf" ? "流量" : "HTTPS请求数";
          this.option.legend.data = [
            this.listQuery.field === "traf" ? "流量" : "HTTPS请求数"
          ];
          var myChart = this.echarts.init(document.getElementById("main"));
          //配置图表
          myChart.setOption(this.option, true);
          console.log(this.option.xAxis.data, flowList, "---------");
        });
    },
    // 获取域名列表
    getDomainList() {
      this.$store
        .dispatch("cdndashboard/getDomainList", {
          pageSize: 999,
          currentPage: 1
        })
        .then((res) => {
          console.log(res, "---------uk");
          this.domainList = res.data.list;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.cdn-query-container {
  .top-search {
    display: flex;
    margin-bottom: 20px;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
    margin-top: 20px;
  }
  .total {
    display: flex;
    justify-content: space-between;
  }
}
</style>
<style lang="less">
.cdn-query-container {
  .ant-table {
    min-width: 100px;
  }
}
</style>
