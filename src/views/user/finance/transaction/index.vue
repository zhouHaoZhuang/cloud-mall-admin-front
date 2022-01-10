<template>
  <div class="income-container">
    <div class="content">
      <div>
        <div class="ny-panel-title">收支明细</div>
      </div>
      <div class="btns">
        <div class="btn1">
          <a-button type="primary" @click="goRecharge">前往充值</a-button>
        </div>
        <!-- 按钮 -->
        <div class="btn3">
          <a-input-group compact>
            <a-select v-model="listQuery.key">
              <a-select-option value="paymentLineId">
                流水单号
              </a-select-option>
              <!-- <a-select-option value="来源/用途"> 来源/用途 </a-select-option> -->
            </a-select>
            <a-input-search
              style="width: 70%"
              placeholder="请输入搜索关键词"
              enter-button
              @search="onSearch"
            />
          </a-input-group>
        </div>
        <span class="refresh" @click="$router.go(0)">
          <a-icon type="redo" />
        </span>
      </div>
      <!-- 表格 -->
      <div class="table">
        <a-table
          :columns="columns"
          :data-source="data"
          row-key="id"
          :pagination="paginationProps"
          @change="sortDirections"
        >
          <div slot="income" slot-scope="text">
            <span class="gold">{{ text.type === "I" ? text.dealAmount : "--" }}</span>
          </div>
          <div slot="expenditure" slot-scope="text">
            <span>{{ text.type === "O" ? text.dealAmount : "--" }}</span>
          </div>
          <a slot="name" slot-scope="text">{{ text }}</a>
          <div slot="createTime" slot-scope="text">
            {{ text | formatDate }}
          </div>
          <div class="gold" slot="afterAmount" slot-scope="text">
            {{ afterAmount }}
          </div>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {},
  data() {
    return {
      listQuery: {
        key: "paymentLineId",
        search: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
        sorter: "",
        paymentLineId: "",
      },
      columns: [
        {
          title: "流水单号",
          dataIndex: "paymentLineId",
          key: "id",
          width: 150,
          sorter: (a, b) => a.id - b.id,
        },
        {
          title: "收入(+)",
          key: "income",
          scopedSlots: { customRender: "income" },

        },
        // type=O支出 i收入
        // dealAmount金额
        {
          title: "支出(-)",
          key: "expenditure",
          scopedSlots: { customRender: "expenditure" },
        },
        {
          title: "余额",
          dataIndex: "afterAmount",
          scopedSlots: { customRender: "afterAmount" },
          sorter: (a, b) => a.afterAmount - b.afterAmount,
        },
        {
          title: "交易日期",
          dataIndex: "createTime",
          key: "createTime",
          scopedSlots: { customRender: "createTime" },
          sorter: (a, b) => a - b,
        },
        {
          title: "来源用途",
          dataIndex: "memo",
        },
      ],
      data: [],
      paginationProps: {
        showQuickJumper: true,
        showSizeChanger: true,
        total: 1,
        showTotal: (total, range) =>
          `共 ${total} 条记录 第 ${this.listQuery.currentPage} / ${Math.ceil(
            total / this.listQuery.pageSize
          )} 页`,
        onChange: this.quickJump,
        onShowSizeChange: this.onShowSizeChange,
      },
      tableLoading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    sortDirections(pagination, filters, sorter) {
      if (sorter && sorter.order) {
        this.listQuery.key = sorter.columnKey;
        this.listQuery.sorter =
          sorter.order.replace("end", "") + `-${sorter.columnKey}`;
        this.getList();
        // console.log("排序被点击了", sorter.columnKey);
      }
    },
    quickJump(current) {
      this.listQuery.currentPage = current;
      this.getList();
    },
    onShowSizeChange(current, pageSize) {
      this.listQuery.pageSize = pageSize;
      this.listQuery.currentPage = current;
      this.getList();
    },
    goRecharge() {
      this.$router.push({
        path: "/user/finance/recharge",
      });
    },
    getList() {
      this.$store.dispatch("finance/getList", this.listQuery).then((res) => {
        this.data = res.data.list;
        this.paginationProps.total = res.data.total * 1;
      });
    },
    onSearch(value) {
      this.listQuery.paymentLineId = value;
      // console.log(value, this.listQuery.key);
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.income-container {
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
      width: 100%;
      position: relative;
      // justify-content: space-between;
      .btn1 {
        padding-right: 20px;
      }
      .btn3 {
        width: 400px;
      }
    }
    .table {
      padding-top: 20px;
    }
    .refresh {
      position: absolute;
      top: 0;
      right: 0;
      width: 32px;
      height: 32px;
      display: inline-block;
      text-align: center;
      font-size: 19px;
      line-height: 32px;
      transform: rotate(-90deg);
      border: 1px solid #ddd;
    }
  }
}
.gold{
  color: #FF8C46;
}
</style>
