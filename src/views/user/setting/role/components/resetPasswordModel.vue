<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    title="子账号重置密码"
    wrapClassName="update-account-container"
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
      <a-form-model-item label="账号">
        {{ form.username }}
      </a-form-model-item>
      <a-form-model-item label="设置密码" prop="password">
        <a-input-password
          v-model="form.password"
          v-password-input
          :max-length="20"
          placeholder="6 - 20位密码，区分大小写"
          @keydown.native="keydown($event)"
        />
      </a-form-model-item>
      <a-form-model-item label="确认密码" prop="confirmPassword">
        <a-input-password
          v-model="form.confirmPassword"
          v-password-input
          :max-length="20"
          placeholder="确认新密码"
          @keydown.native="keydown($event)"
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
    // 单个子账号详情
    detail: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    detail: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== "{}") {
          this.form.username = newVal.username;
          this.form.typeCode = "common_admin";
        } else {
          this.form = {};
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
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (!this.pwdReg.test(value)) {
          callback(new Error("密码格式不正确"));
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      loading: false,
      form: {
        username: "",
        password: "",
        typeCode: "common_admin"
      },
      pwdReg: /(?=.*[0-9])(?=.*[a-zA-Z]).{6,20}/,
      rules: {
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["blur", "change"]
          },
          { validator: validatePass, trigger: ["blur", "change"] }
        ],
        confirmPassword: [
          {
            required: true,
            message: "请输入新密码",
            trigger: ["blur", "change"]
          },
          { validator: validatePass2, trigger: ["blur", "change"] }
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
        username: "",
        password: ""
      };
    },
    // 禁止输入空格
    keydown(event) {
      if (event.keyCode == 32) {
        event.returnValue = false;
      }
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/findPassword", {
              ...this.form
            })
            .then((res) => {
              this.$message.success("操作成功");
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
<style lang="less">
.update-account-container {
  .code-wrap {
    .ant-form-item-children {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .code {
    cursor: pointer;
    position: absolute;
    right: -145px;
    top: -10px;
  }
}
</style>
