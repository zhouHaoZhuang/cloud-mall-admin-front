<template>
  <div>
    <h2 class="return">
      <a-button style="margin-right: 20px" @click="$router.back()">
        <a-icon type="left" />
      </a-button>
      <span>绑定邮箱</span>
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
          <span>{{corporationCode}}</span>
        </a-form-model-item>
        <a-form-model-item ref="name" label="邮箱账号">
          <a-input v-model="form.newPassword" style="width: 250px" />
        </a-form-model-item>
        <a-form-model-item label="验证码" prop="code">
          <a-input v-model="form.code" style="width: 250px"> </a-input>
          <a-button style="margin-left: 10px;" type="primary"> 发送验证码 </a-button>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button @click="onSubmit" type="primary"> 确认绑定邮箱 </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
// import CodeBtn from "@/components/CodeBtn/index";
import { jumpCloudMall } from "@/utils/index";
export default {
  // components: { CodeBtn },
  data() {
    return {
      form: {
        name: "",
        code: "",
      },
      rules: {
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      },
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 8
      },
      corporationCode: "",
    };
  },
  created() {
    this.corporationCode = this.$route.query.corporationCode;
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // console.log('submit!', this.form);
          this.$store.dispatch("user/changePassword", this.form).then(() => {
            this.$message.success("修改成功");
            this.$store.dispatch("user/logout").then((res) => {
              jumpCloudMall("/login-pc?out=1");
            });
          });
        } else {
          this.$message.error("请检查输入项");
        }
      });
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
