<template>
  <div class="work-reply-container">
    <div class="title">发表回复</div>
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="问题描述" prop="description">
        <a-input
          v-model="form.description"
          type="textarea"
          allowClear
          :maxLength="2000"
          placeholder="请输入您的问题描述情况"
        />
      </a-form-model-item>
      <a-form-model-item label="附件上传">
        <Upload :defaultFile="form.img" :limit="5" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
        <a-button type="primary" @click="onSubmit"> 继续提问 </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import Upload from "@/components/Upload/index";
export default {
  components: {
    Upload
  },
  props: {
    // 工单详情
    detail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
      other: "",
      form: {
        description: "",
        img: ""
      },
      rules: {
        description: [
          {
            required: true,
            message: "请输入问题描述",
            trigger: ["change", "blur"]
          }
        ]
      }
    };
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(15);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.work-reply-container {
  font-size: 12px;
  .title {
    height: 36px;
    border-bottom: 1px solid #eee;
    background-color: #f5f9fa;
    padding-left: 20px;
    line-height: 36px;
    font-size: 14px;
    margin-bottom: 40px;
  }
}
</style>
