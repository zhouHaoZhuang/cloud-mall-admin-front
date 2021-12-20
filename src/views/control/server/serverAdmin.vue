<template>
  <div class="cloud-container">
    <!-- 云服务器管理 -->
    <div class="cloud-top">
      <div class="left">
        <div class="title">云服务器管理</div>
        <a-select
          class="select"
          placeholder="全部线路"
          style="width: 120px"
          @change="handleAddressChange"
        >
          <a-select-option value="jack"> Jack </a-select-option>
          <a-select-option value="lucy"> Lucy </a-select-option>
          <a-select-option value="Yiminghe"> yiminghe </a-select-option>
        </a-select>
      </div>
      <div class="help">
        <a-icon type="folder-open" />
        <a-icon type="compass" />
        <a href="">云服务器帮助文档</a>
      </div>
    </div>
    <!-- 新建 -->
    <div class="btnss">
      <div class="btn1">
        <a-button type="primary">+新建</a-button>
      </div>
      <div class="btn1">
        <a-button type="primary" disabled> 启动 </a-button>
      </div>
      <div class="btn2">
        <a-dropdown>
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="1"> 关机 </a-menu-item>
            <a-menu-item key="2"> 重启 </a-menu-item>
            <a-menu-item key="3"> 批量续费 </a-menu-item>
          </a-menu>
          <a-button> 更多操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
      </div>
      <div class="btn3">
        <a-input-group compact>
          <a-select default-value="IP地址">
            <a-select-option value="IP地址"> IP地址 </a-select-option>
            <a-select-option value="实例名称"> 实例名称 </a-select-option>
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
    <div class="table">
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="data"
      >
        <a slot="name" slot-scope="text">{{ text }}</a>
      </a-table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    }),
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
        }
        //禁用
        // getCheckboxProps: (record) => ({
        //   props: {
        //     disabled: record.name === "Disabled User",
        //     name: record.name
        //   }
        // })
      };
    }
  },
  data() {
    return {
      columns: [
        {
          title: "实例名称",
          dataIndex: "id",
          key: "id",
          width: 150,
          onFilter: (value, record) => record.name.includes(value),
          sorter: (a, b) => a.name.length - b.name.length
        },
        {
          title: "监控",
          dataIndex: "cutomerName",
          key: "cutomerName"
        },
        {
          title: "地域",
          dataIndex: "shortName",
          key: "shortName"
        },
        {
          title: "IP地址",
          dataIndex: "addressProject",
          key: "addressProject",
          scopedSlots: { customRender: "addressProject" }
        },
        {
          title: "状态",
          dataIndex: "customerStatus",
          key: "customerStatus",
          scopedSlots: { customRender: "customerStatus" }
        },
        {
          title: "配置",
          dataIndex: "",
          key: ""
        },
        {
          title: "类型/到期日期",
          dataIndex: "",
          key: "1",
          onFilter: (value, record) => record.name.includes(value),
          sorter: (a, b) => a.name.length - b.name.length
        },
        {
          title: "自动续费/周期",
          dataIndex: "",
          key: "2",
          onFilter: (value, record) => record.name.includes(value),
          sorter: (a, b) => a.name.length - b.name.length
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
  created() {},
  methods: {
    // 头部线路切换
    handleAddressChange(value) {
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
.cloud-container {
  background-color: #fff;
  .cloud-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      .title {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        font-size: 22px;
        color: #272829;
        margin-right: 30px;
      }
    }
  }
  .btnss {
    padding-top: 15px;
    display: flex;
    .btn1 {
      padding-right: 10px;
    }
    .btn2 {
      padding-right: 15px;
    }
    .btn3 {
      width: 400px;
    }
  }
  .table {
    padding-top: 20px;
  }
}
</style>
