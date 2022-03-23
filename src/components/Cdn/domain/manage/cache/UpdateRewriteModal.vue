<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    :title="modalTitle"
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
      <a-form-model-item label="待重写URL" prop="type">
        <a-input v-model="form.type" placeholder="请输入待重写URL" />
        <div class="info-txt">
          以/开头的URI，不含http://头及域名。支持PCRE正则表达式，如 ^/hello$
        </div>
      </a-form-model-item>
      <a-form-model-item label="目标URL" prop="type">
        <a-input v-model="form.type" placeholder="请输入目标URL" />
        <div class="info-txt">以/开头的URI，不含http://头及域名</div>
      </a-form-model-item>
      <a-form-model-item label="类型" prop="type">
        <a-radio-group v-model="form.type">
          <a-radio :value="1"> Redirect </a-radio>
          <a-radio :value="2"> Break </a-radio>
        </a-radio-group>
        <div class="info-txt">
          若请求的URI匹配了当前规则，该请求将被302重定向跳转到目标URI。
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
    detail: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    modalTitle() {
      return this.type === "add" ? "添加重写设置" : "修改重写设置";
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
    },
    detail: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== "{}") {
          this.type = "edit";
        } else {
          this.type = "add";
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      type: "add",
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
