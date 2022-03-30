<template>
  <div class="order-container">
    <div class="content">
      <div>
        <div class="ny-panel-title">订单管理</div>
      </div>
      <div class="prompt-message">
        <p>
          CDN加速产品在5天内未使用的情况下支持5天无理由退款，一经使用或者超过5天不支持退款。
        </p>
      </div>
      <div class="btns">
        <!-- <div class="btn1">
          <a-button type="primary" @click="handleJumpCloudPay">
            购买产品
          </a-button>
        </div> -->
        <!-- 按钮输入框组 -->
        <div class="btn3">
          <a-input-group compact>
            <a-select v-model="listQuery.key" style="width: 100px">
              <a-select-option value="orderNo2"> 退单编号 </a-select-option>
              <a-select-option value="orderNo"> 订单编号 </a-select-option>
              <a-select-option value="productName">
                产品
              </a-select-option>
            
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
        <a-select
          class="right-skew"
          v-model="listQuery.tradeType"
          placeholder="订单类型"
          allowClear
          style="width: 110px"
        >
          <a-select-option
            v-for="(value, key) in tradeType"
            :key="key"
            :value="key"
          >
            <span :title="value">{{ value }}</span>
          </a-select-option>
        </a-select>
        <a-select
          class="right-skew"
          v-model="listQuery.payStatus"
          placeholder="支付状态"
          allowClear
          style="width: 110px"
        >
          <a-select-option
            v-for="(value, key) in payState"
            :key="key"
            :value="key"
          >
            {{ value }}
          </a-select-option>
        </a-select>
        <!-- <a-select
          class="right-skew"
          v-model="listQuery.time"
          placeholder="时间类型"
          allowClear
          style="width: 110px"
        >
          <a-select-option
            v-for="(value, key) in timeType"
            :key="key"
            :value="key"
          >
            {{ value }}
          </a-select-option>
        </a-select> -->
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
          <div slot="payTime" slot-scope="text">
            {{ text | formatDate }}
          </div>
          <div slot="payStatus" slot-scope="text">
            {{ payState[text] }}
          </div>
          <div slot="tradeType" slot-scope="text">
            {{ tradeType[text] }}
          </div>
          <div slot="action" slot-scope="text, record">
            <a-space>
              <a-button type="link" @click="selectPool(record)">
                详情
              </a-button>
              <!-- <a-button type="link" @click="subscription(record)">
                退订
              </a-button> -->
              <!-- <a-button type="link" @click="cancelOrder(record)">
                支付
              </a-button> -->
              <a-button type="link" @click="cancelOrder(record)">
                关闭
              </a-button>
              <!-- <a-popconfirm
                :title="`你要关闭订单${record.orderNo}号为多少的订单吗?`"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirm"
                @cancel="cancel"
              >
                <a href="#">关闭</a>
              </a-popconfirm> -->
              <!-- <a-button
                v-if="record.tradeStatus === 1"
                type="link"
                @click="cancelOrder(record)"
              >
                退订
              </a-button> -->
            </a-space>
          </div>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import { jumpCloudMall } from "@/utils/index";
import {
  orderStatusEnum,
  tradeTypeEnum,
  tradeType,
  payState,
  timeType
} from "@/utils/enum";
export default {
  data() {
    return {
      orderStatusEnum,
      tradeTypeEnum,
      tradeType,
      payState,
      timeType,
      listQuery: {
        key: "orderNo",
        search: "",
        startTime: "",
        endTime: "",
        enmu: undefined,
        state: undefined,
        time: undefined,
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: "订单编号",
          dataIndex: "orderNo"
        },
        {
          title: "订单类型",
          dataIndex: "tradeType",
          scopedSlots: { customRender: "tradeType" }
        },
        {
          title: "产品",
          dataIndex: "productName"
        },
        {
          title: "原价",
          dataIndex: "originAmount"
        },
        {
          title: "应付金额",
          dataIndex: "actualAmount"
        },
        {
          title: "创建时间",
          dataIndex: "createTimeStr"
        },
        {
          title: "支付时间",
          dataIndex: "payTime",
          scopedSlots: { customRender: "payTime" }
        },
        {
          title: "支付状态",
          dataIndex: "payStatus",
          scopedSlots: { customRender: "payStatus" }
        },
        {
          title: "操作",
          dataIndex: "action",
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
    cancelOrder(record) {
      this.$confirm({
        title: "确认要取消订单吗？",
        onOk: () => {
          this.$store
            .dispatch("income/cancelOrder", { id: record.id })
            .then((res) => {
              this.$message.success("取消订单成功");
              this.getDetail();
            });
        }
      });
    },
    formatSearch() {
      if (this.listQuery.key === "orderNo") {
        this.listQuery["orderNo"] = this.listQuery.search;
      } else if (this.listQuery.key === "corporationName") {
        this.listQuery["corporationName"] = this.listQuery.search;
      } else if (this.listQuery.key === "corporationCode") {
        this.listQuery["corporationCode"] = this.listQuery.search;
      }
    },
    //查询数据表格
    getList() {
      this.loading = true;
      this.formatSearch();
      this.$getList("income/getList", this.listQuery)
        .then((res) => {
          this.data = [...res.data.list];
          this.paginationProps.total = res.data.totalCount * 1;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    confirm() {
      console.log("确定");
    },
    cancel() {
      console.log("我取消了");
    },
    subscription(record) {
      this.$router.push({
        path: "/user/finance/unsubscribe",
        query: {
          id: record.orderNo
        }
      });
    },
    //查看
    selectPool(record) {
      this.$router.push({
        path: "/user/finance/orderDetail",
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
    },
    // 跳转云商城服务器购买页面
    handleJumpCloudPay() {
      jumpCloudMall("/cloud-price", true);
    }
  }
};
</script>

<style lang="less" scoped>
.order-container {
  background-color: #fff;
  .content {
    .prompt-message {
      text-indent: 2em;
      width: 800px;
      height: 60px;
      line-height: 60px;
      background-color: #f2f2f2;
    }
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
        width: 380px;
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
      .right-skew {
        margin-right: 20px;
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
