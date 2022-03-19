<template>
  <a-modal
    :visible="value"
    width="780px"
    centered
    title="修改加速区域"
    wrapClassName="update-region-container"
    okText="确定"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="加速区域" prop="type">
        <a-radio-group v-model="form.type">
          <a-radio :value="1"> 仅中国大陆 </a-radio>
          <a-radio :value="2"> 全球 </a-radio>
          <a-radio :value="3"> 全球（不包含中国大陆） </a-radio>
        </a-radio-group>
        <div class="info-txt">
          1.不同加速区域的价格不同，请您在了解各区域价格后再进行切换。
        </div>
        <div class="info-txt">
          2.切换加速区域后，短期内回源的流量会增加，命中率会下降，请您关注源站运行情况。
        </div>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  // 双向绑定
  model: {
    event: "changeVisible",
    prop: "value"
  },
  props: {
    // 组件传递的值
    value: {
      type: Boolean,
      default: false
    },
    domain: {
      type: String,
      default: ""
    }
  },
  watch: {
    value: {
      handler(newVal) {
        if (!newVal) {
          this.$nextTick(() => {
            this.resetForm();
          });
        }
      }
    }
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      loading: false,
      form: {
        type: 1
      },
      rules: {
        type: [
          {
            required: true,
            message: "请选择加速区域",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    // 关闭弹窗
    handleCancel() {
      this.$emit("changeVisible", false);
    },
    // 重置表单数据
    resetForm() {
      this.$refs.ruleForm.clearValidate();
      this.form = {
        type: 1
      };
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("domain/add", this.form)
            .then((res) => {
              this.$message.success("修改加速区域成功");
              this.$emit("success");
              this.$emit("changeVisible", false);
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
.update-region-container {
  .info-txt {
    color: #aaaabd;
    line-height: 22px;
  }
}
</style>
