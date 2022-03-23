<template>
  <div class="order-container">
    <div class="content">
      <div>
        <div class="ny-panel-title">账单管理</div>
      </div>
      <div class="btns">
        <!-- 按钮输入框组 -->
        <div class="btn3">
            <a-select v-model="listQuery.key" style="width: 100px">
              <a-select-option value="orderNo"> 账单编号 </a-select-option>
              <a-select-option value="orderNo2"> 订单编号 </a-select-option>
            </a-select>
            <a-input
              allowClear
              style="width: 260px"
              placeholder="请输入搜索关键词"
              enter-button
              v-model="listQuery.search"
            />
        </div>
        <!-- 日历 -->
        <div class="btn2">
          <a-form-model-item>
            <a-range-picker
              :show-time="{
                hideDisabledOptions: true,
                defaultValue: [
                  moment('00:00:00', 'HH:mm:ss'),
                  moment('11:59:59', 'HH:mm:ss'),
                ],
              }"
              format="YYYY-MM-DD HH:mm:ss"
              :placeholder="['开始时间', '结束时间']"
              @change="datePickerOnOk"
              
            >
            <a-icon slot="suffixIcon" type="calendar" />

         </a-range-picker>
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
          @change="handleChange"
        >
          <span slot="orderNo" style="color: #00aaff" slot-scope="text">
            {{ text }}
          </span>
          <span slot="discountAmount" style="color: #ff6600" slot-scope="text">
            {{ text }}
          </span>
          <div slot="createTime" slot-scope="text">
            {{ text | formatDate }}
          </div>
          <span slot="action" slot-scope="text, record">
            <a-button type="link" @click="goDetail(record)"> 详情 </a-button>
          </span>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      moment,
      listQuery: {
        key: "orderNo",
        search: "",
        startTime: "",
        endTime: "",
        createTimeSort: "desc",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        {
          title: "账单编号",
          dataIndex: "orderNo",
          scopedSlots: { customRender: "orderNo" },
          width: 150,
        },
        {
          title: "订单编号",
          dataIndex: "productName",
          width: 150,
        },
        {
          title: "支付状态",
          dataIndex: "discountAmount",
          scopedSlots: { customRender: "discountAmount" },
          width: 80,
        },
        {
          title: "单价",
          dataIndex: "createTime",
          width: 160,
          scopedSlots: { customRender: "createTime" },
          sorter: true,
          sortDirections: ["ascend", "descend"],
        },
        {
          title: "单价单位",
          dataIndex: "tradeStatus",
          width: 100,
          scopedSlots: { customRender: "tradeStatus" },
        },
        {
          title: "账单金额",
          dataIndex: "tradeType",
          width: 100,
          scopedSlots: { customRender: "tradeType" },
        },
        {
          title: "实付金额",
          dataIndex: "action1",
          width: 120,
          scopedSlots: { customRender: "action1" },
        },
        {
          title: "欠费金额",
          dataIndex: "action2",
          width: 120,
          scopedSlots: { customRender: "action2" },
        },
        {
          title: "消费时间",
          dataIndex: "action3",
          width: 120,
          scopedSlots: { customRender: "action3" },
        },
        {
          title: "计费项",
          dataIndex: "action4",
          width: 120,
          scopedSlots: { customRender: "action4" },
        },
        {
          title: "实际用量",
          dataIndex: "action5",
          width: 120,
          scopedSlots: { customRender: "action5" },
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
    goDetail(record) {
      console.log("我是详情",record)
      // this.visibleDetail = true;
      // this.$store
      //   .dispatch("withdraw/getRecordDetail", record.id)
      //   .then(res => {
      //     this.detailInfo = res.data;
      //   })
      //   .finally(() => {
      //     this.visibleDetail = true;
      //   });
    },
    datePickerOnOk(value) {
      if (value.length !== 0) {
        this.listQuery["qp-createTime-ge"] = moment(value[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.listQuery["qp-modifyTime-le"] = moment(value[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        this.listQuery["qp-createTime-ge"] = "";
        this.listQuery["qp-modifyTime-le"] = "";
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
      padding-top: 15px;
      display: flex;
      // justify-content: space-between;
      .btn1 {
        padding-right: 20px;
      }
      .btn3 {
        width: 400px;
       .ant-select{
          margin-right: 10px;
        }
      }
      .btn2 {
        margin-top: -4px;
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
