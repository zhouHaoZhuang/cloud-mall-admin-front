<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    title="URL鉴权"
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
      <a-form-model-item label="URL鉴权" prop="type">
        <a-switch v-model="form.type">
          <a-icon slot="checkedChildren" type="check" />
          <a-icon slot="unCheckedChildren" type="close" />
        </a-switch>
      </a-form-model-item>
      <a-form-model-item label="鉴权类型" prop="type">
        <a-radio-group v-model="form.type">
          <a-radio :value="1"> A方式 </a-radio>
          <a-radio :value="2"> B方式 </a-radio>
          <a-radio :value="3"> C方式 </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="主KEY" prop="type">
        <a-input v-model="form.type" v-filterInput-input />
        <div class="info-txt">6~32个字符支持大写字母、小写字母、数字。</div>
      </a-form-model-item>
      <a-form-model-item label="备KEY" prop="type">
        <a-input v-model="form.type" v-filterInput-input />
        <div class="info-txt">6~32个字符支持大写字母、小写字母、数字。</div>
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
  computed: {
    modalTitle() {
      return this.modalMap[this.type];
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
