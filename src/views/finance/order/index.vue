<template>
  <div class="container">
    <div class="clearfix">
      <div>
        <div class="ny-panel-title">订单管理</div>
      </div>
      <div class="btnsh">
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
              @search="onSearch"
            />
          </a-input-group>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table">
        <a-table :columns="columns" :data-source="data">
          <a slot="name" slot-scope="text">{{ text }}</a>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listQuery: {
        key: undefined,
        search: "",
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: "订单编号",
          dataIndex: "id",
          key: "id",
          width: 150,
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
          scopedSlots: { customRender: "customerStatus" },
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
      data: []
    };
  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    handleMenuClick() {},
    onSearch(value) {
      console.log(value);
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  background-color: #fff;
  .clearfix {
    .ny-panel-title {
      display: inline-block;
      margin: 0;
      height: 40px;
      line-height: 40px;
      font-size: 22px;
      color: #272829;
    }
    .btnsh {
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
