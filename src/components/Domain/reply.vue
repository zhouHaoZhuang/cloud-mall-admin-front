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
      <a-form-model-item label="问题描述" prop="replyDetail">
        <a-input
          v-model="form.replyDetail"
          type="textarea"
          allowClear
          :maxLength="2000"
          placeholder="请输入您的问题描述情况"
        />
      </a-form-model-item>
      <a-form-model-item label="附件上传">
        <Upload
          :defaultFile="form.replyUrl"
          :limit="5"
          replaceUrl="formService"
          @change="imgChange"
        />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
        <a-button type="primary" :loading="loading" @click="onSubmit">
          继续提问
        </a-button>
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
        replyDetail: "",
        replyUrl: []
      },
      rules: {
        replyDetail: [
          {
            required: true,
            message: "请输入问题描述",
            trigger: ["change", "blur"]
          }
        ]
      },
      loading: false
    };
  },
  methods: {
    // 图片上传
    imgChange({ urlList, firstImageUrl }) {
      this.form.replyUrl = [...urlList];
    },
    // 重置表单
    resetForm() {
      this.form = {
        replyDetail: "",
        replyUrl: []
      };
    },
    // 提交
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const data = {
            ...this.form,
            identityType: 1,
            secret: 0,
            workOrderNo: this.detail.workOrderNo,
            replyUrl: this.form.replyUrl.toString()
          };
          this.$store
            .dispatch("workorder/sendMessage", data)
            .then((res) => {
              this.$message.success("提交成功");
              this.resetForm();
              this.$emit("success");
            })
            .finally(() => {
              this.loading = false;
            });
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
