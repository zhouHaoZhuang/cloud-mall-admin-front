<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    title="实例名称"
    wrapClassName="updateName-modal-container"
    okText="确定"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="info-box">
      <a-icon class="icon" type="exclamation-circle" />
      提示：重设密码后系统自行重启云服务器生效，请您提前保存相关信息。
    </div>
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="用户名">
        <a-input style="width: 280px" value="adminssss" disabled />
      </a-form-model-item>
      <a-form-model-item label="新登录密码" props="password">
        <a-input style="width: 280px" />
        <div class="txt">
          1、密码长度8-30位，由英文字母、数字和特殊符号组成，且必须包含字母及数字
        </div>
        <div class="txt">
          2、特殊符号支持如下_ ( ) ` ~ ! @ # $ % ^ * - + = { } [ ] : ; , . ? /
        </div>
      </a-form-model-item>
      <a-form-model-item label="确认登录密码" props="confirmPassword">
        <a-input style="width: 280px" />
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
        callback(new Error("请输入确认密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      loading: false,
      pwdReg: /(?=.*[0-9])(?=.*[a-z]).{8,30}/,
      form: {},
      rules: {
        password: [{ validator: validatePass, trigger: ["blur", "change"] }],
        confirmPassword: [
          { validator: validatePass2, trigger: ["blur", "change"] }
        ]
      }
    };
  },
  created() {},
  methods: {
    // 关闭弹窗
    handleCancel() {
      this.$emit("changeVisible", false);
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert("submit!");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.updateName-modal-container {
  background: #fff;
  .info-box {
    display: flex;
    align-items: center;
    padding: 7px 22px 5px 37px;
    min-height: 32px;
    border: 1px solid #ffdac2;
    border-radius: 2px;
    color: #ff6600;
    font-size: 12px;
    margin-bottom: 20px;
    background: #fff3eb;
    .icon {
      font-size: 16px;
      margin-right: 6px;
    }
  }
  .txt {
    font-size: 12px;
    color: #999;
    line-height: 24px;
  }
}
</style>
