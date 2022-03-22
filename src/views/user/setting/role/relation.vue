<template>
  <div class="system-role-detail-container">
    <div class="role-info">
      <div class="public-title">角色关联资源</div>
      <div class="item">
        <div class="label">
          角色名称：
        </div>
        <div class="value">
          {{ detail.name }}
        </div>
      </div>
      <div class="item">
        <div class="label">
          角色描述：
        </div>
        <div class="value">
          {{ detail.description }}
        </div>
      </div>
    </div>
    <div class="tree-wrap">
      <div class="public-title">关联资源</div>
      <div class="info-box">
        <a-icon class="icon" type="info-circle" theme="filled" />
        如果取消关联父级节点，对应的子级节点都会取消关联！
      </div>
      <a-tree
        v-if="permMap.length > 0"
        v-model="checkedKeys"
        :replace-fields="replaceFields"
        checkable
        :show-line="true"
        :defaultExpandAll="true"
        :tree-data="permMap"
        @check="onCheck"
      />
    </div>
    <div class="btn-wrap">
      <a-space>
        <a-button type="primary" :loading="loading" @click="handleSave">
          保存
        </a-button>
        <a-button @click="handleCancel">
          取消
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 自定义渲染节点的字段
      replaceFields: {
        children: "childrenList",
        title: "name",
        key: "id"
      },
      // 多选选择的数据
      checkedKeys: [],
      // 权限菜单数据
      permMap: [],
      loading: false,
      detail: {}
    };
  },
  computed: {
    id() {
      return this.$route.query.id;
    }
  },
  watch: {
    $route: {
      handler(newVal) {
        if (newVal.path === "/user/setting/relation") {
          this.getDetail();
          this.getPermMap();
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 获取角色详情
    getDetail() {
      this.$store
        .dispatch("organization/getRoleDetail", { id: this.id })
        .then(res => {
          this.detail = { ...res.data };
          this.checkedKeys = [...res.data.permissionIdList];
        });
    },
    // 获取权限菜单
    getPermMap() {
      this.$store.dispatch("organization/getRolePermMap").then(res => {
        this.permMap = [...res.data];
      });
    },
    // 多选框选择
    onCheck(checkedKeys) {
      this.checkedKeys = [...checkedKeys];
    },
    // 取消
    handleCancel() {
      this.$router.back();
    },
    // 保存
    handleSave() {
      this.loading = true;
      this.$store
        .dispatch("organization/roleRelationPerm", {
          roleId: this.id,
          permissionIdList: this.checkedKeys
        })
        .then(res => {
          this.$message.success("角色关联资源成功");
          this.$router.back();
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.system-role-detail-container {
  min-height: 1200px;
  background: #fff;
  color: #000;
  .public-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 15px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
  }
  .role-info {
    margin-bottom: 15px;
    .item {
      display: flex;
      margin-bottom: 8px;
      .label {
        width: 100px;
        text-align: right;
        margin-right: 5px;
      }
    }
  }
  .tree-wrap {
    .info-box {
      display: flex;
      align-items: center;
      background: rgba(31, 148, 255, 0.2);
      border: 1px solid #1f94ff;
      color: #51575a;
      border-radius: 5px;
      padding: 5px 8px;
      margin-bottom: 10px;
      .icon {
        color: #1f94ff;
        margin-right: 10px;
      }
    }
  }
  .btn-wrap {
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }
}
</style>
