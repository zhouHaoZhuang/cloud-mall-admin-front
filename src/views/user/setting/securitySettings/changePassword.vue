<template>
  <div>
    <h2 class="return">
      <a-button style="margin-right: 20px" @click="$router.back()">
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
        <!-- <a-form-model-item ref="name" label="会员ID">
          <a-input v-model="form.name" />
        </a-form-model-item> -->
        <!-- <a-form-model-item ref="name" label="验证手机号" prop="name">
          <a-input v-model="form.name" />
          <CodeBtn :phone="form.phone" />
        </a-form-model-item> -->
        <a-form-model-item label="验证手机号" prop="phone">
          <a-input v-model="form.phone"></a-input>
        </a-form-model-item>
        <a-form-model-item label="验证码" prop="code">
          <a-input
            v-model="form.code"
            style="width: 250px"
            placeholder="输入验证码"
            v-number-evolution
            :max-length="6"
          >
            <a-icon slot="prefix" type="smile" />
          </a-input>
          <CodeBtn :phone="form.phone" />
        </a-form-model-item>
        <a-form-model-item ref="name" label="新密码" prop="newPassword">
          <a-input-password v-model="form.newPassword" />
        </a-form-model-item>
        <a-form-model-item ref="name" label="确认密码" prop="newPasswordEnter">
          <a-input-password v-model="form.newPasswordEnter"/>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button @click="onSubmit" type="primary"> 提交修改 </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import CodeBtn from '@/components/CodeBtn/index';
export default {
  components: { CodeBtn },
  data() {
    return {
      form: {
        name: '',
      },
      rules: {
        phone: [{ required: true, message: '请输入验证手机号', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        newPasswordEnter: [{ required: true, message: '确认密码', trigger: 'blur' }],
      },
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 8,
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // console.log('submit!', this.form);
          if (this.form.newPassword !== this.form.newPasswordEnter) {
            this.$message.error('两次密码不一致');
            return;
          }
          this.$store.dispatch('user/changePassword', this.form).then(() => {
            this.$message.success('修改成功');
          });
        } else {
          this.$message.error('请检查输入项');
        }
      });
    },
  },
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
