<template>
  <div>
    <h2 class="return">
      <a-button style="margin-right: 20px" @click="$router.back()">
        <a-icon type="left" />
      </a-button>
      <span>修改绑定手机</span>
    </h2>
    <div>
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="会员ID" prop="phone">
          <span>{{ corporationCode }}</span>
        </a-form-model-item>
        <a-form-model-item ref="email" label="原手机号码" prop="email">
          <span>{{ phoneNumber }}</span>
        </a-form-model-item>
        <a-form-model-item label="手机验证码" prop="code">
          <a-input v-model="form.code" style="width: 250px"> </a-input>
          <a-button
            style="margin-left: 10px"
            type="primary"
            @click="sendEmail"
            :disabled="loading"
          >
            {{ btnTxt }}
          </a-button>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button @click="onSubmit" type="primary"> 确认</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        code: "",
        email: ""
      },
      rules: {
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱账号", trigger: "blur" },
          { type: "email", message: "您输入的邮箱格式不正确", trigger: "blur" }
        ]
      },
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 8
      },
      corporationCode: "",
      countdown: 0,
      btnTxt: "发送验证码",
      loading: false,
      time: null,
      timeCount: 60,
      phoneNumber: ""
    };
  },
  created() {
    this.corporationCode = this.$route.query.corporationCode;
    this.phoneNumber = this.$route.query.phoneNumber;
  },
  beforeDestroy() {
    clearInterval(this.time);
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // console.log('submit!', this.form);
          this.$store.dispatch("user/emailBinding", this.form).then(() => {
            this.$message.success("绑定成功");
            this.$router.back();
          });
        }
      });
    },
    sendEmail() {
      if (this.form.email) {
        this.loading = true;
        this.$store
          .dispatch("user/sendEmail", this.form)
          .then(() => {
            this.$message.success("发送成功");
            this.startTime();
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    startTime() {
      this.time = setInterval(() => {
        if (this.timeCount - 1 === 0) {
          clearInterval(this.time);
          this.btnTxt = "获取验证码";
          this.timeCount = 60;
          this.loading = false;
          return;
        }
        this.timeCount -= 1;
        this.btnTxt = this.timeCount + "S";
      }, 1000);
    }
  }
};
</script>

<style lang="less" scoped>
.alert-warn {
  padding: 7px 22px 5px 37px;
  background: #fff3eb url(../../../../assets/img/pay/ExclamationMark.png)
    no-repeat 10px 8px;
  min-height: 32px;
  border: 1px solid #ffdac2;
  border-radius: 2px;
  color: #f60;
  font-size: 12px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.return {
  display: flex;
  align-items: center;
}
</style>
