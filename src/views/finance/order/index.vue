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
            <a-select default-value="订单编号">
              <a-select-option value="订单标号"> 订单标号 </a-select-option>
            </a-select>
            <a-input-search
              style="width: 70%"
              placeholder="请输入搜索关键词"
              enter-button
              v-model="listQuery.search"
              @search="onSearch"
            />
          </a-input-group>
        </div>
        <!-- 日历 -->
        <div class="btn2">
          <div class="btn4">
            <a-date-picker
              v-model="startValue"
              :disabled-date="disabledStartDate"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="开始时间"
              @openChange="handleStartOpenChange"
            />
          </div>
          <span class="zhi">至</span>
          <div class="btn4">
            <a-date-picker
              v-model="endValue"
              :disabled-date="disabledEndDate"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="结束时间"
              @openChange="handleEndOpenChange"
            />
          </div>
        </div>
        <div class="btn5">
          <a-select
            default-value="请选择"
            style="width: 120px"
            @change="handleChange"
          >
            <a-select-option value="jack"> 请选择 </a-select-option>
            <a-select-option value="lucy"> 已支付 </a-select-option>
            <a-select-option value="Yiminghe"> 未支付 </a-select-option>
            <a-select-option value="Yiminghe"> 已失效 </a-select-option>
          </a-select>
        </div>
        <div class="btn6">
          <a-button type="primary">确定查询</a-button>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table">
        <a-table
          :columns="columns"
          :data-source="data"
          rowKey="id"
          :pagination="paginationProps"
          :scroll="{ x: 1400 }"
          @change="handleChange"
        >
          <a slot="name" slot-scope="text">{{ text }}</a>
          <div slot="action" slot-scope="text">
            <a-button type="link" @click="selectPool(text)"> 查看 </a-button>
          </div>
          <div slot="createTime" slot-scope="text">
            {{ text | formatDate }}
          </div>
          <div slot="tradeType" slot-scope="text">
            <span v-if="text === 1">云服务新购</span>
            <span v-if="text === 5">升配</span>
            <span v-if="text === 10">降配</span>
            <span v-if="text === 15">云服务续费</span>
            <span v-if="text === 20">退费</span>
          </div>
          <div
            :class="{ green: text === 1, blue: text !== 1 }"
            slot="payStatus"
            slot-scope="text"
          >
            {{ text === 1 ? "已支付" : "已失效" }}
          </div>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "orderNO",
      listQuery: {
        key: undefined,
        search: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
        sorter: ""
      },
      columns: [
        {
          title: "订单编号",
          dataIndex: "orderNo",
          key: "orderNo",
          width: 150
        },
        {
          title: "产品名称",
          dataIndex: "productName",
          key: "productName"
        },
        {
          title: "金额",
          dataIndex: "actualPrice",
          key: "actualPrice"
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          width: 190,
          scopedSlots: { customRender: "createTime" },
          sorter: true,
          sortDirections: ["ascend", "descend"]
        },
        {
          title: "状态",
          dataIndex: "payStatus",
          key: "payStatus",
          width: 100,
          scopedSlots: { customRender: "payStatus" }
        },
        {
          title: "来源/用途",
          dataIndex: "tradeType",
          key: "tradeType",
          scopedSlots: { customRender: "tradeType" }
        },
        {
          title: "操作",
          key: "action",
          dataIndex: "orderNo",
          fixed: "right",
          scopedSlots: { customRender: "action" }
        }
      ],
      data: [],
      startValue: null,
      endValue: null,
      // 表格分页器配置
      paginationProps: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20", "30"],
        total: 0,
        current: 1, //当前页
        pageSize: 5, //每页显示数量
        showTotal: (total, range) =>
          `共 ${total} 条记录 第 ${this.paginationProps.current} / ${Math.ceil(
            this.paginationProps.total / this.paginationProps.pageSize
          )}  页`,
        onChange: this.changepage,
        onShowSizeChange: this.onShowSizeChange
      },
      num: "",
      endOpen: false,
      isTime: true
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //查询数据表格
    getList() {
      this.$store.dispatch("finance/getList").then((res) => {
        console.log(res);
        this.data = [...res.data.list];
      });
    },
    //查看
    selectPool(text, i) {
      console.log(text);
      this.$router.push({
        path: "/user/finance/orderdetails",
        query: {
          id: text
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
    // handleChange(value) {
    //   console.log(`selected ${value}`);
    // },
    handleMenuClick() {},
    //查询
    onSearch() {
     
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
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    changeKey(val) {
      // console.log(val);
      this.title = val;
      if (this.title !== "createTime") {
        this.isTime = true;
      } else {
        this.isTime = false;
      }
    },
    changepage(current, pageSize) {
      this.paginationProps.current = current;
      this.paginationProps.pageSize = pageSize;
      this.getList();
    },
    onShowSizeChange(current, pageSize) {
      // console.log("改变了分页的大小", current, pageSize);
      this.paginationProps.current = current;
      this.paginationProps.pageSize = pageSize;
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
          width: 100px;
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
        width: 52px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border-radius: 2px;
      }
      .blue {
        background-color: rgb(64, 169, 255);
        color: rgb(255, 255, 255);
        font-size: 12px;
        width: 52px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border-radius: 2px;
      }
    }
  }
}
</style>
