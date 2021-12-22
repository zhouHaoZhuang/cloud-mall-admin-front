<template>
  <div class="income-container">
    <div class="content">
      <div>
        <div class="ny-panel-title">收支明细</div>
      </div>
      <div class="btns">
        <div class="btn1">
          <a-button type="primary">前往充值</a-button>
        </div>
        <!-- 按钮 -->
        <div class="btn3">
          <a-input-group compact>
            <a-select v-model="listQuery.key">
              <a-select-option value="paymentLineId"> 流水单号 </a-select-option>
              <!-- <a-select-option value="来源/用途"> 来源/用途 </a-select-option> -->
            </a-select>
            <a-input-search style="width: 70%"
                            placeholder="请输入搜索关键词"
                            enter-button
                            @search="onSearch" />
          </a-input-group>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table">
        <a-table :columns="columns"
                 :data-source="data">
          <a slot="name"
             slot-scope="text">{{ text }}</a>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {},
  data () {
    return {
      listQuery: {
        key: 'paymentLineId',
        search: "",
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: "流水单号",
          dataIndex: "paymentLineId",
          key: "id",
          width: 150,
          onFilter: (value, record) => record.name.includes(value),
          sorter: (a, b) => a.name.length - b.name.length
        },
        {
          title: "收入(+)",
          dataIndex: "cutomerName",
          key: "cutomerName"
        },
        // type=O支出 i收入
        // dealAmount金额
        {
          title: "支出(-)",
          dataIndex: "shortName",
          key: "shortName"
        },
        {
          title: "余额",
          dataIndex: "afterAmount",
          scopedSlots: { customRender: "addressProject" },
          onFilter: (value, record) => record.name.includes(value),
          sorter: (a, b) => a - b
        },
        {
          title: "交易日期",
          dataIndex: "createTime",
          key: "customerStatus",
          scopedSlots: { customRender: "customerStatus" },
          onFilter: (value, record) => record.name.includes(value),
          sorter: (a, b) => a - b
        },
        {
          title: "来源用途",
          dataIndex: "org"
        }
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
        onShowSizeChange: this.onShowSizeChange
      },
      tableLoading: false
    };
  },
  methods: {
    handleChange (value) {
      console.log(`selected ${value}`);
    },
    quickJump (current) {

      this.listQuery.currentPage = current;
      this.getList();
    },
    onShowSizeChange (current, pageSize) {
      this.listQuery.pageSize = pageSize;
      this.listQuery.currentPage = current;
      this.getList();
    },
    getList () {
      this.$store.dispatch("finance/getRechargeList", this.listQuery).then(res => {
        this.data = res.data.list;
        this.paginationProps.total = res.data.total;
      });
    },
    onSearch (value) {
      this.listQuery.search = value;
      console.log(value, this.listQuery.key);
      this.getList();
    }
  }
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
  }
}
</style>
