<template>
  <div class="cdn-summary-container">
    <div class="top-search">
      <a-space>
        <a-select
          style="width: 100px"
          allowClear
          v-model="listQuery.granularity"
          placeholder="请选择"
          @change="changeDate"
        >
          <a-select-option value="day"> 按日查询 </a-select-option>
          <a-select-option value="month"> 按月查询 </a-select-option>
        </a-select>
        <a-date-picker
          v-show="listQuery.granularity == 'day'"
          @change="onChange"
          v-model="billingDate"
        />
        <a-month-picker
          v-show="listQuery.granularity == 'month'"
          @change="onChange"
          v-model="billingCycle"
        />
        <a-button type="primary" @click="handleSearch"> 查询 </a-button>
      </a-space>
    </div>
    <div class="table-box">
      <div class="top">
        <div class="title">按流量计费</div>
        <div class="title">
          {{
            listQuery.granularity === "day"
              ? listQuery.billingDate
              : listQuery.billingCycle
          }}
        </div>
      </div>
      <div class="content">
        <a-table
          :columns="columns"
          :data-source="data"
          :rowKey="(record, index) => index"
          :pagination="false"
        >
          <div v-if="record" slot="domaina" slot-scope="text, record">
            {{ record.value + record.unit }}
          </div>
        </a-table>
      </div>
    </div>
    <div class="table-box">
      <div class="top">
        <div class="title">按增值服务计费</div>
        <div class="title">
          {{
            listQuery.granularity === "day"
              ? listQuery.billingDate
              : listQuery.billingCycle
          }}
        </div>
      </div>
      <div class="content">
        <a-table
          :columns="plusColumns"
          :data-source="plusData"
          :rowKey="(record, index) => index"
          :pagination="false"
        >
          <div v-if="record" slot="domaina" slot-scope="text, record">
            {{ record.value + record.unit }}
          </div>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    tabsKey: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      moment,
      listQuery: {
        granularity: "day",
        billingDate: new Date()
      },
      columns: [
        {
          title: "时间",
          dataIndex: "time"
        },
        {
          title: "全球",
          key: "domaina",
          scopedSlots: {
            customRender: "domaina"
          }
        }
        // {
        //   title: "境外",
        //   dataIndex: "cnameStatus"
        // }
      ],
      data: [{}],
      plusColumns: [
        {
          title: "时间",
          dataIndex: "time"
        },
        {
          title: "静态HTTPS请求次数",
          key: "domaina",
          scopedSlots: {
            customRender: "domaina"
          }
        }
      ],
      plusData: [{}],
      billingCycle: null,
      billingDate: null
    };
  },
  created() {
    this.listQuery.billingDate = moment(this.listQuery.billingDate).format(
      "YYYY-MM-DD"
    );
    this.billingDate = this.listQuery.billingDate;
    this.handleSummary();
  },
  methods: {
    // 切换时间类型
    changeDate() {
      if (this.listQuery.granularity === "day") {
        this.listQuery.billingCycle = "";
        this.billingCycle = null;
      }
      if (this.listQuery.granularity === "month") {
        this.listQuery.billingDate = "";
        this.billingDate = null;
      }
    },
    // 日期选择
    onChange(date, dateString) {
      console.log(date, dateString);
      if (this.listQuery.granularity === "day") {
        this.listQuery.billingDate = dateString;
        this.listQuery.billingCycle = "";
      }
      if (this.listQuery.granularity === "month") {
        this.billingCycle = date;
        this.listQuery.billingCycle = dateString;
      }
    },
    // 搜索
    handleSearch() {
      this.handleSummary();
    },
    handleRadioChange() {},
    // 用量汇总
    handleSummary() {
      this.$store
        .dispatch("cdndashboard/getUsageSum", {
          ...this.listQuery,
          type: "cdn_hour_flow"
        })
        .then((res) => {
          console.log(res, "用量汇总");
          this.data = res.data.useDataList;
        });
      this.$store
        .dispatch("cdndashboard/getUsageSum", {
          ...this.listQuery,
          type: "cdnHourVas"
        })
        .then((res) => {
          console.log(res, "增值服务汇总");
          this.plusData = res.data.useDataList;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.cdn-summary-container {
  .top-search {
    display: flex;
  }
  .table-box {
    border: 1px solid #ddd;
    margin-top: 20px;
    .top {
      padding: 20px 24px;
      height: 60px;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-bottom: 1px solid #ddd;
      .title {
        font-size: 14px;
        font-weight: 600;
      }
    }
    .content {
      padding: 20px 24px;
    }
  }
}
</style>
<style lang="less">
.cdn-summary-container {
  .ant-table {
    min-width: 100px;
  }
}
</style>
