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
          <div
            :class="{ green: text === 1, blue: text !== 1 }"
            slot="payStatus"
            slot-scope="text"
          >
            {{ text === 1 ? "已支付" : "未支付" }}
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
          dataIndex: "cutomerName",
          key: "cutomerName"
        },
        {
          title: "金额",
          dataIndex: "shortName",
          key: "shortName"
        },
        {
          title: "创建时间",
          dataIndex: "addressProject",
          key: "addressProject",
          scopedSlots: { customRender: "addressProject" },
          onFilter: (value, record) => record.name.includes(value),
          sorter: (a, b) => a.name.length - b.name.length
        },
        {
          title: "状态",
          dataIndex: "customerStatus",
          key: "customerStatus",
          scopedSlots: { customRender: "customerStatus" }
        },
        {
          title: "来源/用途",
          dataIndex: "",
          key: ""
        },
        {
          title: "操作",
          dataIndex: "",
          key: ""
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
  created(){
    this.getList();
    console.log(8989);
  },
  methods: {
    //查询数据表格
    getList() {
      this.$store.dispatch("finance/getList").then(res => {
        console.log(res);
        this.data = [...res.data.list];
      });
      // this.$getList("banner/getList",this.listQuery)
      // .then(res=>{
      //   this.data = [...res.data.list];
      //   this.paginationProps.total = res.data.totalCount * 1;
      // })
      // .finally(() =>{

      // })
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    handleMenuClick() {},
    onSearch(value) {
      console.log(value);
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
    }
  }
}
</style>
