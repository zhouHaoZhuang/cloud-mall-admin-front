<template>
  <div>
    <DetailHeader title="新增发票信息" />
    <div>
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="开票类型" prop="resource">
          <a-radio-group v-model="form.resource">
            <a-radio value="1"> 个人 </a-radio>
            <a-radio value="2"> 企业 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="发票抬头">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="发票类型" prop="name">
          <a-radio-group v-model="form.resource">
            <a-radio value="1"> 增值税普通发票 </a-radio>
            <a-radio value="2"> 增值税专用发票 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="税务登记号" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="基本开户银行名称" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="基本开户银行账号" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="公司地址" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item
          help="格式：021-6001-6001或者手机号"
          label="联系电话"
          prop="name"
        >
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit"> 保存信息 </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import DetailHeader from "@/components/Common/detailHeader.vue";
export default {
  components: {
    DetailHeader
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        name: "",
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "Please input Activity name",
            trigger: "blur"
          },
          {
            min: 3,
            max: 5,
            message: "Length should be 3 to 5",
            trigger: "blur"
          }
        ]
      }
    };
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
    }
  }
};
</script>

<style></style>
