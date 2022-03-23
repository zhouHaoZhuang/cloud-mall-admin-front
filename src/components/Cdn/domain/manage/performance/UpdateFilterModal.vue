<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    title="过滤参数"
    wrapClassName="update-source-container"
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
      <a-form-model-item label="过滤参数" prop="type">
        <a-switch v-model="form.type">
          <a-icon slot="checkedChildren" type="check" />
          <a-icon slot="unCheckedChildren" type="close" />
        </a-switch>
        <div class="info-txt">
          回源时会去除 URL
          中？之后的参数，有效提高文件缓存命中率，提升分发效率。
        </div>
      </a-form-model-item>
      <a-form-model-item v-if="this.type === 1" label="保留参数" prop="type">
        <a-input v-model="form.type" />
        <div class="info-txt">最多10个, 使用英文逗号做分隔符。</div>
      </a-form-model-item>
      <a-form-model-item v-else label="忽略参数" prop="type">
        <a-input v-model="form.type" />
        <div class="info-txt">请使用空格分隔。</div>
      </a-form-model-item>
      <a-form-model-item label="保留回源参数" prop="type">
        <a-switch v-model="form.type">
          <a-icon slot="checkedChildren" type="check" />
          <a-icon slot="unCheckedChildren" type="close" />
        </a-switch>
        <div class="info-txt">
          开启后回源保留所有参数，未开启时缓存hashkey的参数一致。
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
    type: {
      type: Number,
      default: 1
    },
    detail: {
      type: Object,
      default: () => {}
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
              this.$message.success(`修改${this.modalTitle}成功`);
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
.update-source-container {
  .info-txt {
    color: #aaa;
    line-height: 22px;
  }
}
</style>
