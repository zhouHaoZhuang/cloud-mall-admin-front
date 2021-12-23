<template>
  <div class="record">
    <div class="search">
      <a-input-group compact
                     enterButton="true">
        <a-select v-model="title">
          <a-select-option value="memo"> 充值方式 </a-select-option>
        </a-select>
        <a-input-search style="width: 250px"
                        placeholder="请输入搜索关键词"
                        enter-button
                        @search="onSearch" />
        <span class="refresh">
          <a-icon type="reload" />
        </span>
      </a-input-group>
    </div>
    <div>
      <a-table :columns="columns"
               :data-source="data"
               @change="handleChange"
               row-key="id"
               :pagination="paginationProps" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: [],
      columns: [
        {
          title: "充值金额",
          dataIndex: "amount",
          key: "amount",
          sorter: (a, b) => a.amount - b.amount,
        },
        {
          title: "充值方式",
          dataIndex: "memo",
          key: "memo",
          sorter: (a, b) => a.age - b.age,
        },
        {
          title: "充值日期",
          dataIndex: "payTime",
          key: "payTime",
          sorter: (a, b) => a.payTime - b.payTime,
        }
      ],
      title: 'memo',
      listQuery: {
        key: '',
        search: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
        sorter: '',
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
      },
    };
  },
  methods: {
    onSearch (value) {
      console.log(value);
    },
    // 排序的回调
    handleChange (value) {
      console.log(value);
    },
    getList () {
      this.$getList("finance/getList", this.listQuery).then(res => {
        this.data = res.data.list;
        this.paginationProps.total = res.data.total * 1;
      });
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
  }
};
</script>

<style lang="less" scoped>
.table-operations {
  margin-bottom: 16px;
}

.table-operations > button {
  margin-right: 8px;
}
.record {
  .search {
    margin-bottom: 20px;
  }
  .refresh {
    float: right;
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    border: 1px solid #d9d9d9;
    font-size: 17px;
  }
}
</style>
