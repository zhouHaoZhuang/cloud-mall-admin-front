<template>
  <div class="record-content">
    <p class="record-title">
      <span
        >温馨提示：线下汇款后，您的款项具体到账时间依赖于银行系统，请耐心等待。常见问题可查看 </span
      ><a>充值说明</a>
    </p>
    <div class="search">
      <a-input-group compact enterButton="true">
        <a-select default-value="汇款银行">
          <a-select-option value="汇款银行"> 汇款银行 </a-select-option>
          <a-select-option value="汇款账号"> 汇款账号 </a-select-option>
          <a-select-option value="汇款户名"> 汇款户名 </a-select-option>
        </a-select>
        <a-input-search
          style="width: 250px"
          placeholder="请输入搜索关键词"
          enter-button
          @search="onSearch"
        />
        <span class="refresh">
          <a-icon type="reload" />
        </span>
      </a-input-group>
    </div>
    <div>
      <a-table :columns="columns" :data-source="data" @change="handleChange" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          key: "1",
          name: "John Brown",
          age: 32,
          address: "New York No. 1 Lake Park"
        },
        {
          key: "2",
          name: "Jim Green",
          age: 42,
          address: "London No. 1 Lake Park"
        }
      ],
      sortedInfo: null
    };
  },
  computed: {
    columns() {
      let { sortedInfo } = this;
      sortedInfo = sortedInfo || {};
      const columns = [
        {
          title: "汇款账户",
          dataIndex: "name",
        },
        {
          title: "账户名称",
          dataIndex: "title",
        },
        {
          title: "汇款金额",
          dataIndex: "age",
          key: "age",
          sorter: (a, b) => a.age - b.age,
          sortOrder: sortedInfo.columnKey === "age" && sortedInfo.order
        },
        {
          title: "汇款日期",
          dataIndex: "address",
          key: "address",
          sorter: (a, b) => a.address.length - b.address.length,
          sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order
        },
        {
            title: "审核状态",
            key: "store",
        },
        {
            title: "操作",
            key: "action",
        }
      ];
      return columns;
    }
  },
  methods: {
    onSearch(value) {
      console.log(value);
    },
    handleChange(pagination, filters, sorter) {
      console.log("Various parameters", pagination, filters, sorter);
      this.filteredInfo = filters;
      this.sortedInfo = sorter;
    },
    clearFilters() {
      this.filteredInfo = null;
    },
    clearAll() {
      this.filteredInfo = null;
      this.sortedInfo = null;
    },
    setAgeSort() {
      this.sortedInfo = {
        order: "descend",
        columnKey: "age"
      };
    }
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
.record-content {
   .record-title {
    padding: 7px 22px 5px 37px;
    background: #fff3eb url(https://www.ydidc.com/template/User/Zkeys/PC/Static/css/common/common/img/uc/tip_icon_warn_16.png) no-repeat 10px
      8px;
    min-height: 32px;
    border: 1px solid #ffda95;
    border-radius: 2px;
    color: #ff6600;
    font-size: 12px;
  }
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
