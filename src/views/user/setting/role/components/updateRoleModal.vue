<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    :title="modalTitle"
    wrapClassName="update-role-container"
    okText="确定"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="角色名称" prop="name">
        <a-input
          v-model="form.name"
          :disabled="type === 'edit'"
          :max-length="30"
          placeholder="请输入角色名称"
        />
      </a-form-model-item>
      <a-form-model-item label="状态">
        <a-switch v-model="form.status">
          <a-icon slot="checkedChildren" type="check" />
          <a-icon slot="unCheckedChildren" type="close" />
        </a-switch>
      </a-form-model-item>
      <a-form-model-item label="描述">
        <a-input
          v-model="form.description"
          type="textarea"
          :max-length="100"
          placeholder="请填写描述信息"
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  // 双向绑定
  model: {
    event: "changeVisible",
    prop: "value"
  },
  props: {
    // 组件传递的值
    value: {
      type: Boolean,
      default: false
    },
    // 单个权限详情
    detail: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    modalTitle() {
      return this.type === "add" ? "添加角色" : "修改角色";
    }
  },
  watch: {
    detail: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== "{}") {
          this.type = "edit";
          this.form = { ...this.detail };
        } else {
          this.type = "add";
        }
      },
      immediate: true
    },
    value: {
      handler(newVal) {
        if (!newVal) {
          this.$nextTick(() => {
            this.resetForm();
          });
        }
      }
    }
  },
  data() {
    return {
      type: "add",
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      loading: false,
      form: {
        name: "",
        status: true,
        description: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入角色名称",
            tigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  methods: {
    // 关闭弹窗
    handleCancel() {
      this.$emit("changeVisible", false);
    },
    // 重置表单数据
    resetForm() {
      this.$refs.ruleForm.clearValidate();
      this.form = {
        name: "",
        status: true,
        description: ""
      };
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const status = this.form.status ? 1 : 0;
          const req =
            this.type === "add"
              ? "organization/addRole"
              : "organization/editRole";
          const data =
            this.type === "add"
              ? { ...this.form, status }
              : {
                  ...this.form,
                  id: this.detail.id,
                  status
                };
          this.$store
            .dispatch(req, data)
            .then(res => {
              this.$message.success(this.modalTitle + "成功");
              this.$emit("success");
              this.$emit("changeVisible", false);
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>
