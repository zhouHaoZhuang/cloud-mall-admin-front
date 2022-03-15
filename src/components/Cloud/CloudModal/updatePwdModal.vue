<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    title="重设密码"
    wrapClassName="updatePwd-modal-container"
    okText="确定"
    :confirmLoading="loading"
    @ok="handleResetPwd"
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
        <a-input v-model="form.user" style="width: 280px" disabled />
      </a-form-model-item>
      <a-form-model-item label="新登录密码" prop="password">
        <a-input-password
          v-model="form.password"
          type="password"
          style="width: 280px"
          :max-length="30"
        />
        <div class="txt">
          1、8-30个字符，必须同时包含下面四项中的三项：大写字母、小写字母、数字、和特殊字符
        </div>
        <div class="txt">
          2、 （仅支持下列特殊字符： ( ) ` ~ ! @ # $ % ^ {{ "&" }} * - _ + = | {
          } : ; ' > <span v-text="'<'"></span> , . ? / ）。
        </div>
      </a-form-model-item>
      <a-form-model-item label="确认登录密码" prop="confirmPassword">
        <a-input-password
          v-model="form.confirmPassword"
          type="password"
          style="width: 280px"
          :max-length="30"
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { judgePwdFormat } from "@/utils/index";
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
    // 实例详情
    detail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (judgePwdFormat(value) < 3) {
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
      // 必须包含大写字母，小写字母，数字，特殊字符
      // pwdReg:
      //   /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[()`~!@#$%^&*-_+=|{}:;'><,.?/]).*$/,
      // // 必须包含大写字母，小写字母，数字
      // pwdReg1: /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/,
      // // 必须包含大写字母，小写字母，特殊字符
      // pwdReg2:
      //   /^.*(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[()`~!@#$%^&*-_+=|{}:;'><,.?/]).*$/,
      // // 必须包含大写字母，数字，特殊字符
      // pwdReg3:
      //   /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[()`~!@#$%^&*-_+=|{}:;'><,.?/]).*$/,
      // // 必须包含小写字母，数字，特殊字符
      // pwdReg4:
      //   /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[()`~!@#$%^&*-_+=|{}:;'><,.?/]).*$/,
      // 不允许包含的特殊字符集合正则
      // specialReg: new RegExp("[《》！￥……（）—【】‘；：”“。，、？]"),
      form: {
        user: "root (Linux) / administrator (Windows)",
        password: "",
        confirmPassword: ""
      },
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
    // 重置服务器密码
    handleResetPwd() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const data = {
            instanceId: this.detail.instanceId,
            regionId: this.detail.regionId,
            password: this.form.password
          };
          this.$store
            .dispatch("cloud/updateCloudInfo", data)
            .then((res) => {
              this.$message.success("修改实例密码成功");
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

<style lang="less" scoped>
.updatePwd-modal-container {
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
