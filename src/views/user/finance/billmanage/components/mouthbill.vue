<template>
  <div>
    <div class="btns">
      <!-- 按钮输入框组 -->
      <!-- <div class="btn3">
        <a-select v-model="listQuery.key" style="width: 100px">
          <a-select-option value="billNo"> 账单编号 </a-select-option>
          <a-select-option value="orderNo"> 订单编号 </a-select-option>
        </a-select>
        <a-input
          allowClear
          style="width: 260px"
          placeholder="请输入搜索关键词"
          enter-button
          v-model="listQuery.search"
        />
      </div> -->
      <!-- 日历 -->
      <div class="btn2">
        <span class="month-text">账期：</span>
        <a-form-model-item>
          <a-month-picker
            format="YYYY-MM"
            valueFormat="YYYY-MM"
            placeholder="请选择月份"
            @change="datePickerOnOk"
          >
            <a-icon slot="suffixIcon" type="calendar" />
          </a-month-picker>
        </a-form-model-item>
      </div>
      <div class="btn6">
        <a-button type="primary" @click="handleSearch">查询</a-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <a-table
        rowKey="id"
        :loading="loading"
        :columns="columns"
        :data-source="data"
        :pagination="paginationProps"
      >
        <span slot="owe" slot-scope="text">
          <span v-if="text === 0">已结清</span>
          <span v-else>未结算</span>
        </span>
        <span slot="useData" slot-scope="text, record">
          {{ text }}{{ record.useDataPerUnit }}
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { log } from 'mathjs';
export default {
  data() {
    return {
      moment,
      listQuery: {
        key: "billNo",
        search: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        {
          title: "账期",
          dataIndex: "billPeriod",
        },

        {
          title: "计费项",
          dataIndex: "billItem",
        },
        {
          title: "单价",
          dataIndex: "unitPrice",
        },
        {
          title: "单价单位",
          dataIndex: "unitPricePerUnit",
        },
        {
          title: "实际用量",
          dataIndex: "useData",
          scopedSlots: { customRender: "useData" },
        },
        {
          title: "账单金额",
          dataIndex: "actualAmount",
        },

        {
          title: "实付金额",
          dataIndex: "balancePay",
          scopedSlots: { customRender: "balancePay" },
        },
        {
          title: "欠费金额",
          dataIndex: "owe",
          key: "2",
        },
      ],
      data: [],
      loading: false,
      // 表格分页器配置
      paginationProps: {
        showSizeChanger: true,
        total: 1,
        showTotal: (total, range) =>
          `共 ${total} 条记录 第 ${this.listQuery.currentPage} / ${Math.ceil(
            total / this.listQuery.pageSize
          )} 页`,
        onChange: this.quickJump,
        onShowSizeChange: this.onShowSizeChange,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    callback(key) {
      console.log(key);
    },
    //查询之前转化查询条件格式
    formatSearch() {
      if (this.listQuery.key === "billNo") {
        this.listQuery["qp-billNo-like"] = this.listQuery.search;
      } else if (this.listQuery.key === "orderNo") {
        this.listQuery["qp-orderNo-like"] = this.listQuery.search;
      } else {
        this.listQuery["qp-billNo-like"] = "";
        this.listQuery["qp-orderNo-like"] = "";
      }
    },
    //查询数据表格
    getList() {
      this.loading = true;
      this.formatSearch();
      this.listQuery["qp-billType-eq"] = "month";
      this.$getList("billmanage/getList", this.listQuery)
        .then((res) => {
          this.data = [...res.data.list];
          this.paginationProps.total = res.data.totalCount * 1;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //查询之前转化查询条件格式
    datePickerOnOk(value) {
      if (value !== null) {
        this.listQuery["qp-billPeriod-eq"] = value
      } else {
        this.listQuery["qp-billPeriod-eq"] = "";
      }
    },
    //查询
    handleSearch() {
      this.getList();
    },

    // 表格分页快速跳转n页
    quickJump(currentPage) {
      this.listQuery.currentPage = currentPage;
      this.getList();
    },
    onShowSizeChange(current, pageSize) {
      this.listQuery.currentPage = current;
      this.listQuery.pageSize = pageSize;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.order-container {
  background-color: #fff;
  .content {
    .ny-panel-title {
      display: inline-block;
      margin: 0;
      height: 40px;
      line-height: 40px;
      font-size: 22px;
      color: #272829;
    }
    .btns {
      padding-top: 2px;
      display: flex;
      // justify-content: space-between;
      .btn1 {
        padding-right: 20px;
      }
      .btn3 {
        width: 400px;
        .ant-select {
          margin-right: 10px;
        }
      }
      .btn2 {
        margin-top: -4px;
        display: flex;
        .month-text {
          line-height: 36px;
        }
        .btn4 {
          width: 170px;
          > span {
            min-width: 100px !important;
          }
        }
        .zhi {
          margin: 5px;
        }
      }
      .btn5 {
        padding-left: 20px;
      }
      .btn6 {
        padding-left: 10px;
      }
    }
    .table {
      // padding-top: 20px;
      .green {
        background-color: rgb(115, 209, 61);
        color: rgb(255, 255, 255);
        font-size: 12px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border-radius: 2px;
        padding: 0 4px;
      }
      .blue {
        background-color: rgb(64, 169, 255);
        color: rgb(255, 255, 255);
        font-size: 12px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border-radius: 2px;
        padding: 0 4px;
      }
    }
  }
}
</style>
