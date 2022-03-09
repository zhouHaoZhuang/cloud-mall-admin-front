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
        <a-form-model-item label="会员ID">
          <span>{{ corporationCode }}</span>
        </a-form-model-item>
        <a-form-model-item label="原手机号码">
          <span>{{ phoneNumber }}</span>
        </a-form-model-item>
        <a-form-model-item label="新手机号" prop="phone">
          <a-input v-model="form.phone" style="width: 250px" />
        </a-form-model-item>
        <a-form-model-item label="手机验证码" prop="code">
          <a-input
            v-model="form.code"
            style="width: 250px;"
            placeholder="输入验证码"
            v-number-evolution
            :max-length="6"
          >
            <a-icon slot="prefix" type="smile" />
          </a-input>
          <CodeBtn style="margin-left: 10px;" codeType="3" :phone="form.phone" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button @click="onSubmit" type="primary"> 确认</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import CodeBtn from "@/components/CodeBtn/index";

export default {
  components: { CodeBtn },
  data() {
    return {
      form: {
        code: "",
        phone: ""
      },
      rules: {
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入新手机号", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "您输入的手机号格式不正确",
            trigger: "blur"
          }
        ]
      },
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 8
      },
      corporationCode: "",
      phoneNumber: ""
    };
  },
  created() {
    this.corporationCode = this.$route.query.corporationCode;
    this.phoneNumber = this.$route.query.phoneNumber;
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log('submit!', this.form);
          this.$store.dispatch("user/phoneBinding", this.form).then(() => {
            this.$message.success("修改绑定成功");
            this.$store.dispatch("user/getUserActualName");
            this.$router.back();
          });
        }
      });
    },
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
