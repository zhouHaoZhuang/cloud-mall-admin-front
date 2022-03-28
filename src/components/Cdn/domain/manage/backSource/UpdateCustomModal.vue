<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    title="回源HTTP头"
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
      <a-form-model-item label="回源HTTP头">
        <a-select
          v-model="form.type"
          :disabled="type === 'edit'"
          style="width: 100%"
          placeholder="请选择"
        >
          <a-select-option :value="-1"> 自定义回源头 </a-select-option>
          <a-select-option value="Accept-Encoding">
            Accept-Encoding
          </a-select-option>
          <a-select-option value="Accept-Language">
            Accept-Language
          </a-select-option>
          <a-select-option value="User-Agent"> User-Agent </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item v-if="form.type === -1" label="自定义参数" prop="key">
        <a-input
          v-model="form.key"
          :disabled="type === 'edit'"
          placeholder="请输入自定义参数"
        />
      </a-form-model-item>
      <a-form-model-item label="取值" prop="value">
        <a-input v-model="form.value" placeholder="请输入取值" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { getParameter } from "@/utils/index";
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
            this.form = {
              type: this.detail.key ? -1 : this.detail.key,
              key: this.detail.key,
              value: this.detail.value
            };
          } else {
            this.type = "add";
          }
        } else {
          this.resetForm();
        }
      }
    }
  },
  data() {
    return {
      type: "add",
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      loading: false,
      form: {
        type: undefined,
        key: "",
        value: ""
      },
      rules: {
        type: [
          {
            required: true,
            message: "请选择参数",
            trigger: "change"
          }
        ],
        key: [
          {
            required: true,
            message: "请输入自定义参数",
            trigger: "change"
          }
        ],
        value: [
          {
            required: true,
            message: "请输入取值",
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
        type: undefined,
        key: "",
        value: ""
      };
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let tempForm = {
            key: this.form.type === -1 ? this.form.key : this.form.type,
            value: this.form.value
          };
          const newForm = {
            ...getParameter(tempForm, this.functionName, this.domain)
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
