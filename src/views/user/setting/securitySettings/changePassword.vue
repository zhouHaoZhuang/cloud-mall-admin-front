<template>
  <div>
    <h2 class="return">
      <a-button style="margin-right: 20px;" @click="$router.back()">
        <a-icon type="left" />
      </a-button>
      <span>修改密码</span>
    </h2>
    <div class="alert-warn">
      注意账户安全，请尽量避免采用手机号、电话号码、生日、学号、身份证等个人信息设置密码
    </div>
    <div>
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="name" label="会员ID">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item ref="name" label="当前登陆密码" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item ref="name" label="输入新的登陆新密码" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item ref="name" label="确认密码" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary"> 提交修改 </a-button>
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
      },
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
      },
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 8,
      },
    };
  },
};
</script>

<style lang="less" scoped>
.alert-warn {
  padding: 7px 22px 5px 37px;
  background: #fff3eb url(../../../../assets/img/pay/ExclamationMark.png) no-repeat
    10px 8px;
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
