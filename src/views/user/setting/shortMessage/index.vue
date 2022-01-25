<template>
  <div>
    <h2>短信通知设置</h2>
    <div class="alert-warn">
      <div>
        1.关闭短信通知设置，会导致业务开通，业务到期，业务续费等通知无法通过短信收取。
      </div>
      <div>
        2.由于关闭短信通知，未及时续费，造成的业务被删除或者数据丢失，后果自负。
      </div>
    </div>
    <div>
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="短信通知" prop="name">
          <a-radio-group v-model="form.resource">
            <a-radio value="1"> 开启 </a-radio>
            <a-radio value="2"> 关闭 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 2 }">
          <a-button type="primary" @click="onSubmit"> 保存 </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
      form: {
        name: "",
        resource: "1",
      },
      rules: {
        name: [
          {
            required: true,
            message: "Please input Activity name",
            trigger: "blur",
          },
        ],
      },
    };
  },
	methods: {
		 onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
	},
};
</script>

<style lang="less" scoped>
.alert-warn {
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 7px 22px 5px 37px;
  background: #fff3eb url(../../../assets/img/pay/ExclamationMark.png) no-repeat
    10px 8px;
  min-height: 32px;
  border: 1px solid #ffdac2;
  border-radius: 2px;
  color: #f60;
  font-size: 12px;
}
</style>
