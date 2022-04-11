<template>
  <div class="system-admin-container">
    <div class="btns">
      <a-space>
        <a-button
          v-permission="'add'"
          type="primary"
          icon="plus"
          @click="handleAdd"
        >
          添加子账号
        </a-button>
      </a-space>
    </div>
    <div class="table-con">
      <a-table
        :loading="tableLoading"
        :columns="columns"
        :data-source="data"
        rowKey="id"
        :pagination="false"
      >
        <span slot="roleNames" slot-scope="text">
          <span>正常{{ text }}</span>
        </span>
        <span slot="status" slot-scope="text">
          <span v-if="text === 1">
            <a-badge status="success" />
            正常
          </span>
          <span v-else>
            <a-badge status="error" />
            冻结中
          </span>
        </span>
        <span slot="createTime" slot-scope="text">
          {{ text | formatDate }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a-space>
            <a-button
              v-permission="'del'"
              type="link"
              @click="handleFrozen(record)"
            >
              {{ record.status === 1 ? "冻结账号" : "解冻账号" }}
            </a-button>
            <a-button
              v-permission="'modify'"
              type="link"
              @click="handleEdit(record)"
            >
              编辑
            </a-button>
            <a-button type="link" @click="handleReset(record)">
              重置密码
            </a-button>
          </a-space>
        </span>
      </a-table>
    </div>
    <!-- 添加/编辑子账号的弹窗 -->
    <UpdateAccountModal
      v-model="visible"
      :detail="modalDetail"
      @success="modalSuccess"
    />
    <!-- 重置密码弹框 -->
    <ResetPasswordModel
      v-model="visibleReset"
      :detail="modalDetail"
      @success="modalSuccess"
    />
  </div>
</template>

<script>
import UpdateAccountModal from "./components/updateAccountModal";
import ResetPasswordModel from "./components/resetPasswordModel.vue";
export default {
  components: {
    UpdateAccountModal,
    ResetPasswordModel
  },
  data() {
    return {
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: "账号",
          dataIndex: "username"
        },
        {
          title: "子账号名称",
          dataIndex: "nickname"
        },
        {
          title: "手机号",
          dataIndex: "phone"
        },
        {
          title: "角色",
          dataIndex: "roleNames",
          scopedSlots: { customRender: "roleNames" }
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" }
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          scopedSlots: { customRender: "createTime" }
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
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
      tableLoading: false,
      // 弹窗相关数据
      visible: false,
      modalDetail: {},
      visibleReset: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 查询
    search() {
      this.listQuery.currentPage = 1;
      this.getList();
    },
    // 查询表格数据
    getList() {
      this.tableLoading = true;
      this.$store
        .dispatch("organization/getAccountList", this.listQuery)
        .then((res) => {
          this.data = [...res.data.list];
          this.paginationProps.total = res.data.totalCount * 1;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    // 表格分页快速跳转n页
    quickJump(currentPage) {
      this.listQuery.currentPage = currentPage;
      this.getList();
    },
    // 表格分页切换每页条数
    onShowSizeChange(current, pageSize) {
      this.listQuery.currentPage = current;
      this.listQuery.pageSize = pageSize;
      this.getList();
    },
    // 添加子账号
    handleAdd() {
      this.modalDetail = {};
      this.visible = true;
    },
    // 编辑子账号
    handleEdit(record) {
      const newRoleIds = record.roleIds.split(",");
      this.modalDetail = {
        ...record,
        roleIds: newRoleIds,
        oldRoleIds: newRoleIds
      };
      this.visible = true;
    },
    //重置密码
    handleReset(record) {
      const newRoleIds = record.roleIds.split(",");
      this.modalDetail = {
        ...record,
        roleIds: newRoleIds,
        oldRoleIds: newRoleIds
      };
      this.visibleReset = true;
    },
    // 添加/编辑弹窗事件成功的回调
    modalSuccess() {
      this.getList();
    },
    // 冻结账号
    handleFrozen(record) {
      const contentTxt =
        record.status === 1
          ? "被冻结的账号无法进行登录，你还要继续吗？"
          : "是否要对该账号做解除冻结操作？";
      this.$confirm({
        title: `账号${record.status === 1 ? "冻结" : "解冻"}提示`,
        content: contentTxt,
        onOk: () => {
          this.$store
            .dispatch("organization/editAccountStatus", {
              userCode: record.id,
              status: record.status === 0 ? 1 : 0,
              typeCode: "common_admin"
            })
            .then((res) => {
              this.$message.success("操作成功");
              this.getList();
            });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.system-admin-container {
  background: #fff;
  .btns {
    margin-bottom: 20px;
  }
  .table-con {
    .actions-wrap {
      .title {
        font-size: 16px;
      }
      .list {
        display: flex;
        margin-top: 10px;
        .item {
          margin: 0 8px 0 0;
          padding: 0 7px;
          font-size: 12px;
          line-height: 20px;
          white-space: nowrap;
          background: #fafafa;
          border: 1px solid #d9d9d9;
          border-radius: 2px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
