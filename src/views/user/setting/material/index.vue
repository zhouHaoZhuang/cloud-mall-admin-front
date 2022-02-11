<template>
  <div>
    <h2>基本资料</h2>
    <div class="alert-warn">
      <span>请完善以下信息，方便我们更好的为您服务！</span>
    </div>
    <p class="basic-information">基本信息</p>
    <div>
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="name" label="会员ID">
          <span>{{ corporationCode }}</span>
        </a-form-model-item>
        <a-form-model-item ref="name" label="真实姓名">
          <span>{{ realName }}</span>
        </a-form-model-item>
        <a-form-model-item ref="name" label="QQ号码" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 2 }">
          <a-button type="primary" @click="onSubmit"> 保存 </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      // realName: "",
      // corporationCode: "",
      form: {
        name: ""
      },
      rules: {
        name: [{ required: true, message: "请输入QQ号码", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState({
      userRealInfo: (state) => state.user.userRealInfo
    }),
    realName() {
      if (this.userRealInfo && this.userRealInfo.realName) {
        return "*" + this.userRealInfo.realName.slice(1);
      } else {
        return "----";
      }
    },
    corporationCode() {
      if (this.userRealInfo && this.userRealInfo.corporationCode) {
        return this.userRealInfo.corporationCode;
      } else {
        return "";
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
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
}
.basic-information {
  margin: 36px 0;
  color: #0af;
  font-weight: 700;
}
</style>
