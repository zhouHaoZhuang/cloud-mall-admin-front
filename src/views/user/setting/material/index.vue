<template>
  <div>
    <h2 class="ny-panel-title">基本资料</h2>
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
        <a-form-model-item label="会员ID">
          <span>{{ corporationCode }}</span>
        </a-form-model-item>
        <a-form-model-item label="真实姓名">
          <span>{{ realName }}</span>
        </a-form-model-item>
        <a-form-model-item label="QQ号码" prop="qq">
          <a-input v-model="form.qq" />
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
        qq: ""
      },
      rules: {
        qq: [
          { required: true, message: "请输入QQ号码", trigger: "blur" },
          {
            pattern: /^[1-9][0-9]{4,9}$/,
            message: "请输入正确的QQ号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      userRealInfo: (state) => state.user.userRealInfo
    }),
    realName() {
      if (!this.userRealInfo) {
        return "";
      }
      if (this.userRealInfo.isMain === 0) {
        return this.userRealInfo.realName;
      }
      if (this.userRealInfo.isMain === 1) {
        return this.userRealInfo.nickName;
      }
      return "未实名认证";
    },
    corporationCode() {
      if (this.userRealInfo && this.userRealInfo.corporationCode) {
        return this.userRealInfo.corporationCode;
      } else {
        return "";
      }
    }
  },
  mounted() {
    console.log(this.userRealInfo.id, "------------");
    this.form.qq = this.userRealInfo.qq;
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.form.id = this.userRealInfo.id;
          this.$store.dispatch("user/updateQQ", this.form).then((res) => {  
            this.$message.success("保存成功");
            this.$store.dispatch("user/getUserActualName");
          });
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
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
}
.basic-information {
  margin: 36px 0;
  color: #0af;
  font-weight: 700;
}
</style>
