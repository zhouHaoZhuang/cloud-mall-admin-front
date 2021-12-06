<template>
  <div class="record">
    <div class="search">
      <a-input-group compact enterButton="true">
        <a-select default-value="充值方式">
          <a-select-option value="充值方式"> 充值方式 </a-select-option>
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
          title: "充值金额",
          dataIndex: "name",
          key: "name",
          sorter: (a, b) => a.name.length - b.name.length,
          sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order
        },
        {
          title: "充值方式",
          dataIndex: "age",
          key: "age",
          sorter: (a, b) => a.age - b.age,
          sortOrder: sortedInfo.columnKey === "age" && sortedInfo.order
        },
        {
          title: "充值日期",
          dataIndex: "address",
          key: "address",
          sorter: (a, b) => a.address.length - b.address.length,
          sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order
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
.record {
  .search {
    margin-bottom: 20px;
  }
  .refresh{
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
