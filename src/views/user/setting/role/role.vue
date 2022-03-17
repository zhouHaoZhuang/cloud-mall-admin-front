<template>
  <div class="system-role-container">
    <div class="role-content">
      <div class="public-header-wrap">
        <a-form-model layout="inline" :model="listQuery">
          <a-form-model-item>
            <a-button
              v-permission="'add'"
              type="primary"
              icon="plus"
              @click="handleAddRole"
            >
              添加角色
            </a-button>
          </a-form-model-item>
          <a-form-model-item>
            <a-input
              v-model="listQuery.search"
              allowClear
              placeholder="请输入角色名称进行搜索"
            />
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" @click="search">
              查询
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div class="public-table-wrap">
        <a-table
          :loading="tableLoading"
          :columns="columns"
          :data-source="data"
          rowKey="id"
          :pagination="false"
        >
          <div slot="type" slot-scope="text">
            {{ roleTypeEnum[text] }}
          </div>
          <div slot="status" slot-scope="text, record">
            <a-switch :checked="text" @change="handleChangeStatus(record)">
              <a-icon slot="checkedChildren" type="check" />
              <a-icon slot="unCheckedChildren" type="close" />
            </a-switch>
          </div>
          <div slot="action" slot-scope="text, record">
            <a-space>
              <a-button
                v-permission="'relation'"
                type="link"
                @click="handleRelation(record)"
              >
                关联资源
              </a-button>
              <a-button
                v-permission="'edit'"
                type="link"
                @click="handleEditRole(record)"
              >
                编辑
              </a-button>
              <a-button
                v-permission="'del'"
                type="link"
                @click="handleDel(record)"
              >
                移除
              </a-button>
            </a-space>
          </div>
        </a-table>
      </div>
    </div>
    <!-- 添加/编辑权限弹窗 -->
    <UpdateRoleModal
      v-model="visible"
      :detail="modalDetail"
      @success="modalSuccess"
    />
  </div>
</template>

<script>
import { roleTypeEnum } from "@/utils/enum";
import UpdateRoleModal from "./components/updateRoleModal";
export default {
  components: {
    UpdateRoleModal
  },
  data() {
    return {
      roleTypeEnum,
      listQuery: {
        key: "name",
        search: "",
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: "角色名称",
          dataIndex: "name"
        },
        {
          title: "角色类型",
          dataIndex: "type",
          scopedSlots: { customRender: "type" }
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" }
        },
        {
          title: "描述",
          dataIndex: "description"
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
      modalDetail: {}
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
      this.$getListQp("organization/getRoleList", this.listQuery)
        .then(res => {
          this.data = res.data.list.map(ele => {
            return {
              ...ele,
              status: ele.status === 0 ? false : true
            };
          });
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
    // 新增角色
    handleAddRole() {
      this.modalDetail = {};
      this.visible = true;
    },
    // 编辑角色
    handleEditRole(record) {
      this.modalDetail = { ...record };
      this.visible = true;
    },
    // 添加/编辑弹窗事件成功的回调
    modalSuccess() {
      this.getList();
    },
    // 关联资源-给角色添加权限
    handleRelation(record) {
      this.$router.push({
        path: "/user/setting/relation",
        query: {
          id: record.id
        }
      });
    },
    // 修改角色状态
    handleChangeStatus(record) {
      const statusTxt = !record.status ? "启用" : "禁用";
      console.log(record, record.status, statusTxt);
      this.$confirm({
        title: `确认要${statusTxt}当前角色吗？`,
        onOk: () => {
          this.$store
            .dispatch("organization/editRole", {
              id: record.id,
              status: record.status ? 0 : 1
            })
            .then(res => {
              this.$message.success(`${statusTxt}成功`);
              this.getList();
            });
        }
      });
    },
    // 删除
    handleDel(record) {
      this.$confirm({
        title: "确认要移除当前角色吗？",
        onOk: () => {
          this.$store
            .dispatch("organization/delRole", { id: record.id })
            .then(res => {
              this.$message.success("移除成功");
              this.getList();
            });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.system-role-container {
  .top-search {
    height: 80px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    input {
      border-radius: 0 !important;
    }
    .ant-btn-lg {
      border-radius: 0 4px 4px 0 !important;
    }
  }
  .role-content {
    background: #fff;
  }
  .public-table-wrap{
    margin-top: 20px;
  }
}
</style>
