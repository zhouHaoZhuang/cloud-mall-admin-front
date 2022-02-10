<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item label="问题类别" prop="region">
      <a-select v-model="form.region">
        <a-select-option
          v-for="(obj, ind) in question"
          :key="ind"
          :value="obj.value"
        >
          {{ obj.title }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    
    <a-form-model-item ref="name" label="问题标题" prop="name">
      <a-input
        v-model="form.name"
        @blur="
          () => {
            $refs.name.onFieldBlur();
          }
        "
      />
    </a-form-model-item>
    <a-form-model-item label="问题描述" prop="desc">
      <a-input v-model="form.desc" type="textarea" />
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit"> 提交 </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
export default {
  props: { classId: Number },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      question: [
        { value: 1, title: "服务器类问题" },
        { value: 2, title: "财务类问题" },
        { value: 3, title: "合同类问题" },
        { value: 4, title: "会员账号问题" },
        { value: 5, title: "售前类问题" },
        { value: 6, title: "备案类问题" },
        { value: 7, title: "商标类问题" }
      ],
      other: "",
      form: {
        name: "",
        region: this.classId,
        desc: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "该项不能为空",
            trigger: "blur"
          }
        ],
        region: [
          {
            required: true,
            message: "该项不能为空",
            trigger: "change"
          }
        ],
        desc: [
          {
            required: true,
            message: "该项不能为空",
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
          alert("提交成功!");
        } else {
          console.log("提交失败!!");
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
