<template>
  <div class="cdn-query-container">
    <div class="top-search">
      <div class="left">
        <a-space>
          <a-select
            style="width: 100px"
            allowClear
            v-model="listQuery.a"
            placeholder="请选择"
          >
            <a-select-option value="1"> 中国内地 </a-select-option>
            <a-select-option value="2"> 境外 </a-select-option>
          </a-select>
          <a-select
            style="width: 100px"
            allowClear
            v-model="listQuery.a"
            placeholder="请选择"
          >
            <a-select-option value="1"> 流量 </a-select-option>
            <a-select-option value="2"> HTTPS请求数 </a-select-option>
          </a-select>
          <a-select
            style="width: 100px"
            allowClear
            v-model="listQuery.a"
            placeholder="请选择"
          >
            <a-select-option value="1"> 全部域名 </a-select-option>
          </a-select>
        </a-space>
      </div>
      <div class="right">
        <a-space>
          <a-radio-group v-model="listQuery.b" @change="handleRadioChange">
            <a-radio-button value="a"> 今天 </a-radio-button>
            <a-radio-button value="b"> 昨天 </a-radio-button>
            <a-radio-button value="c"> 近7日 </a-radio-button>
            <a-radio-button value="d"> 近30日 </a-radio-button>
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
    <CdnEcharts
      title="流量"
      lineChartType="cpu"
      yUnit="%"
      tooltipUnit="%"
      :tabsKey="tabsKey"
      :listQuery="listQuery"
    />
    <div class="title">明细</div>
    <a-table
      style="margin-top: 20px"
      :columns="columns"
      :data-source="data"
      rowKey="id"
      :pagination="false"
    >
      <template slot="footer">
        <div class="total">
          <span>总计</span>
          <span>40G</span>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import CdnEcharts from "@/components/Cdn/cdnEcharts/index";
import moment from "moment";
export default {
  props: {
    tabsKey: {
      type: Number,
      default: 1
    }
  },
  components: {
    CdnEcharts
  },
  data() {
    return {
      moment,
      listQuery: {
        a: "1",
        b: "1",
        c: "1",
        startTime: "",
        endTime: ""
      },
      columns: [
        {
          title: "时间",
          dataIndex: "domain",
          sorter: (a, b) =>
            new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
        },
        {
          title: "总流量",
          dataIndex: "cnameStatus"
        }
      ],
      data: [{}]
    };
  },
  created() {},
  methods: {
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
    handleSearch() {},
    handleRadioChange() {}
  }
};
</script>

<style lang="less" scoped>
.cdn-query-container {
  .top-search {
    display: flex;
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
