<template>
  <div class="cloud-container">
    <div class="content">
      <div>
        <div class="ny-panel-title">云服务器回收站</div>
        <div class="btn1">
          <div><a href="">云服务器帮助文档</a></div>
        </div>
      </div>
      <div class="hint">
        <a-alert
          message="回收站内云服务器时间到期后无法人工恢复数据等操作。"
          type="warning"
          show-icon
        />
      </div>
      <div class="btns">
        <div class="btn2">
          <a-button type="primary" disabled>恢复</a-button>
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
          sorter: (a, b) => a.name.length - b.name.length,
        },
        {
          title: "地域",
          dataIndex: "cutomerName",
          key: "cutomerName"
        },
        {
          title: "回收状态",
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
          title: "配置",
          dataIndex: "",
          key: ""
        },
        {
          title: "类型/到期日期",
          dataIndex: "",
          key: ""
        },
        {
          title: "回收倒计时",
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
  created() {},
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
.cloud-container {
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
    .btn {
      display: inline-block;
      padding-left: 30px;
    }
    .btn1 {
      display: inline-block;
      font-size: 16px;
      padding-left: 780px;
    }
    .hint {
      padding-top: 20px;
    }
    .btns {
      padding-top: 15px;
      display: flex;
      // justify-content: space-between;
      .btn2 {
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
