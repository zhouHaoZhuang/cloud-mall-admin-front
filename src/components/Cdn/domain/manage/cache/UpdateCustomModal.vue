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
      <a-form-model-item label="错误码" prop="error_code">
        <a-select
          v-model="form.error_code"
          style="width: 100%"
          placeholder="请选择"
        >
          <a-select-option value="404"> 404 </a-select-option>
          <a-select-option value="400"> 400 </a-select-option>
          <a-select-option value="403"> 403 </a-select-option>
          <a-select-option value="405"> 405 </a-select-option>
          <a-select-option value="414"> 414 </a-select-option>
          <a-select-option value="416"> 416 </a-select-option>
          <a-select-option value="500"> 500 </a-select-option>
          <a-select-option value="501"> 501 </a-select-option>
          <a-select-option value="502"> 502 </a-select-option>
          <a-select-option value="503"> 503 </a-select-option>
          <a-select-option value="504"> 504 </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="描述">
        <span v-if="form.error_code">
          {{ errorCodeEnum[form.error_code].info }}
        </span>
      </a-form-model-item>
      <a-form-model-item label="链接" prop="rewrite_page">
        <a-input v-model="form.rewrite_page" placeholder="请输入链接" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { getParameter } from "@/utils/index";
import { errorCodeEnum } from "@/utils/enum";
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
    functionName: {
      type: String,
      default: ""
    },
    detail: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    modalTitle() {
      return this.type === "add" ? "添加自定义页面" : "修改自定义页面";
    },
    domain() {
      return this.$route.query.domain;
    }
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal) {
          if (JSON.stringify(this.detail) !== "{}") {
            this.type = "edit";
            this.configId = newVal.configId;
            this.form = {
              error_code: this.detail.error_code,
              rewrite_page: this.detail.rewrite_page
            };
          } else {
            this.type = "add";
            this.configId = undefined;
          }
        } else {
          this.resetForm();
        }
      }
    }
  },
  data() {
    return {
      errorCodeEnum,
      type: "add",
      configId: undefined,
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      loading: false,
      form: {
        error_code: "",
        rewrite_page: ""
      },
      rules: {
        error_code: [
          {
            required: true,
            message: "请选择错误码",
            trigger: "change"
          }
        ],
        rewrite_page: [
          {
            required: true,
            message: "请输入链接",
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
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate();
      });
      this.form = {
        error_code: "",
        rewrite_page: ""
      };
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let tempForm = {
            ...this.form
          };
          const newForm = {
            ...getParameter(
              tempForm,
              this.functionName,
              this.domain,
              [],
              this.configId
            )
          };
          this.loading = true;
          this.$store
            .dispatch("cdn/saveConfig", newForm)
            .then((res) => {
              this.$message.success(`设置成功`);
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
