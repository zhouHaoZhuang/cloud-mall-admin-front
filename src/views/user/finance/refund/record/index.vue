<template>
  <div>
    <h1>退订记录</h1>
    <!-- <div class="top-menu">
      <span
        :class="{ 'top-menu-item': true, cutover: item.key == cutover }"
        v-for="item in topList"
        :key="item.key"
      >
        {{ item.title }}
      </span>
    </div> -->
    <div class="btns">
      <!-- <div class="btn1">
          <a-button type="primary" @click="handleJumpCloudPay">
            购买产品
          </a-button>
        </div> -->
      <!-- 按钮输入框组 -->
      <!-- <div class="btn3">
        <a-input-group compact>
          <a-select v-model="listQuery.key" style="width: 100px">
            <a-select-option value="orderNo"> 订单编号 </a-select-option>
            <a-select-option value="orderNo2"> 渠道商名称 </a-select-option>
            <a-select-option value="orderNo3"> 渠道商ID </a-select-option>
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
      </div> -->
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
          {{ value }}
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
    <div class="table">
      <a-table
        :columns="columns"
        :data-source="data"
        :loading="loading"
        :pagination="paginationProps"
        rowKey="id"
      >
        <a slot="name" slot-scope="text">{{ text }}</a>
        <div slot="createTime" slot-scope="text">
          {{ text | formatDate }}
        </div>
        <div slot="chargingType" slot-scope="text">
          <span v-if="text === 'Beforepay'">预付费</span>
          <span v-if="text === 'AfterPay'">后付费</span>
        </div>
        <div slot="tradeType" slot-scope="text">
          {{ tradeType[text] }}
        </div>
        <div slot="payStatus" slot-scope="text">
          {{ payState[text] }}
        </div>
        <div slot="action" slot-scope="text, record">
          <a-space>
            <a-button type="link" @click="selectPool(record)"> 详情 </a-button>
          </a-space>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import {
  payState,
  timeType,
  tradeType,
  payStatus
} from "@/utils/enum";

export default {
  data() {
    return {
      payState,
      timeType,
      tradeType,
      payStatus,
      cutover: "0",
      topList: [
        {
          title: "云服务器",
          key: "0"
        }
      ],
      data: [],
      columns: [
        {
          title: "退单编号",
          dataIndex: "orderNo"
        },
        {
          title: "订单类型",
          dataIndex: "tradeType",
          scopedSlots: { customRender: "tradeType" }
        },
        {
          title: "订单金额",
          dataIndex: "actualAmount",
          key:"1"
        },
        {
          title: "退款金额",
          dataIndex: "actualAmount",
          key:"2"
        },
        {
          title: "状态",
          dataIndex: "payStatus",
          scopedSlots: { customRender: "payStatus" }
        },
        {
          title: "计费方式",
          dataIndex: "chargingType",
          scopedSlots: { customRender: "chargingType" }
        },
        {
          title: "创建时间",
          dataIndex: "createTimeStr"
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      loading: false,
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
        total: 0,
        tradeType: "55"
      },
      paginationProps: {
        showQuickJumper: true,
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
          console.log(res);
          this.data = [...res.data.list];
          this.paginationProps.total = res.data.totalCount * 1;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSearch() {
      this.getList();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
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
    //退订详情
    selectPool(record) {
      this.$router.push({
        path: "/user/finance/recordDetail",
        query: {
          id: record.orderNo
        }
      });
    },
    // 表格分页快速跳转n页
    quickJump(currentPage) {
      this.listQuery.currentPage = currentPage;
      this.getList();
    },
    // 表格分页每页显示条数改变
    onShowSizeChange(current, pageSize) {
      this.listQuery.currentPage = current;
      this.listQuery.pageSize = pageSize;
      this.getList();
    }
  }
};
</script>

<style lang="less" scoped>
.top-menu {
  margin-bottom: 25px;
  background-color: #f0f3f5;
  // border-bottom: 1px solid #e1e4e6;
  .top-menu-item {
    display: inline-block;
    height: 100%;
    line-height: 50px;
    padding: 0 50px;
    margin-left: 1px;
  }
  .cutover {
    background-color: #fff;
    color: #0af;
    border-top: 4px solid #0af;
  }
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
</style>
