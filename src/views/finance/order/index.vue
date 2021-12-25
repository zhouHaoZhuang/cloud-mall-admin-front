<template>
  <div class="order-container">
    <div class="content">
      <div>
        <div class="ny-panel-title">订单管理</div>
      </div>
      <div class="btns">
        <div class="btn1">
          <a-button type="primary">购买产品</a-button>
        </div>
        <!-- 按钮输入框组 -->
        <div class="btn3">
          <a-input-group compact>
            <a-select v-model="listQuery.key" style="width: 100px">
              <a-select-option value="orderNo"> 订单编号 </a-select-option>
            </a-select>
            <a-input-search
              allowClear
              style="width: 260px"
              placeholder="请输入搜索关键词"
              enter-button
              v-model="listQuery.search"
              @search="handleSearch"
            />
          </a-input-group>
        </div>
        <!-- 日历 -->
        <div class="btn2">
          <div class="btn4">
            <a-date-picker
              style="width: 170px"
              :disabled-date="disabledStartDate"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="开始时间"
              @change="startDateChange"
            />
          </div>
          <span class="zhi">至</span>
          <div class="btn4">
            <a-date-picker
              style="width: 170px"
              :disabled-date="disabledEndDate"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="结束时间"
              @change="endDateChange"
            />
          </div>
        </div>
        <div class="btn5">
          <a-select
            v-model="listQuery.payStatus"
            placeholder="请选择"
            style="width: 120px"
          >
            <a-select-option
              v-for="(value, key) in payStatusEnum"
              :key="key"
              :value="key"
            >
              {{ value }}
            </a-select-option>
          </a-select>
        </div>
        <div class="btn6">
          <a-button type="primary" @click="handleSearch">确定查询</a-button>
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
          @change="handleChange"
        >
          <a slot="name" slot-scope="text">{{ text }}</a>
          <div slot="action" slot-scope="text, record">
            <a-button type="link" @click="selectPool(record)"> 查看 </a-button>
          </div>
          <div slot="createTime" slot-scope="text">
            {{ text | formatDate }}
          </div>
          <div slot="tradeType" slot-scope="text">
            {{ tradeTypeEnum[text] }}
          </div>
          <div
            :class="{ green: text === 1, blue: text !== 1 }"
            slot="payStatus"
            slot-scope="text"
          >
            {{ payStatusEnum[text] }}
          </div>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import { payStatusEnum, tradeTypeEnum } from "@/utils/enum";
export default {
  data() {
    return {
      payStatusEnum,
      tradeTypeEnum,
      listQuery: {
        key: "orderNo",
        search: "",
        startTime: "",
        endTime: "",
        payStatus: undefined,
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: "订单编号",
          dataIndex: "orderNo",
          width: 150
        },
        {
          title: "产品名称",
          dataIndex: "productName"
        },
        {
          title: "金额",
          dataIndex: "discountAmount"
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          width: 190,
          scopedSlots: { customRender: "createTime" },
          sorter: true,
          sortDirections: ["ascend", "descend"]
        },
        {
          title: "状态",
          dataIndex: "payStatus",
          width: 100,
          scopedSlots: { customRender: "payStatus" }
        },
        {
          title: "来源/用途",
          dataIndex: "tradeType",
          scopedSlots: { customRender: "tradeType" }
        },
        {
          title: "操作",
          dataIndex: "action",
          fixed: "right",
          scopedSlots: { customRender: "action" }
        }
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
        onShowSizeChange: this.onShowSizeChange
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //查询数据表格
    getList() {
      this.loading = true;
      this.$getList("income/getList", this.listQuery)
        .then((res) => {
          this.data = [...res.data.list];
          this.paginationProps.total = res.data.totalCount * 1;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //查看
    selectPool(record) {
      this.$router.push({
        path: "/user/finance/orderdetails",
        query: {
          id: record.orderNo
        }
      });
    },
    //排序
    handleChange(pagination, filters, sorter) {
      if (sorter && sorter.order) {
        if (sorter.columnKey === "createTime") {
          this.listQuery.createTimeSort = sorter.order.replace("end", "");
        } else if (sorter.columnKey === "corporationCode") {
          this.listQuery.corporationCodeSort = sorter.order.replace("end", "");
        }
        this.getList();
      }
    },
    //查询
    handleSearch() {
      this.getList();
    },
    // 日期组件change
    startDateChange(date, dateString) {
      this.listQuery.startTime = dateString;
    },
    endDateChange(date, dateString) {
      this.listQuery.endTime = dateString;
    },
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
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
    }
  }
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
      padding-top: 15px;
      display: flex;
      // justify-content: space-between;
      .btn1 {
        padding-right: 20px;
      }
      .btn3 {
        width: 400px;
      }
      .btn2 {
        display: flex;
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
        padding-left: 20px;
      }
    }
    .table {
      padding-top: 20px;
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
