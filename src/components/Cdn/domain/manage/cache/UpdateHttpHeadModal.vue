<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    title="HTTP头设置"
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
      <a-form-model-item label="参数">
        <a-select
          v-model="form.key"
          :disabled="type === 'modify'"
          placeholder="请选择"
        >
          <a-select-option value="Cache-Control">
            Cache-Control
          </a-select-option>
          <a-select-option value="Content-Disposition">
            Content-Disposition
          </a-select-option>
          <a-select-option value="Content-Type"> Content-Type</a-select-option>
          <a-select-option value="Pragma"> Pragma </a-select-option>
          <a-select-option value="Access-Control-Allow-Origin">
            Access-Control-Allow-Origin
          </a-select-option>
          <a-select-option value="Access-Control-Allow-Methods">
            Access-Control-Allow-Methods
          </a-select-option>
          <a-select-option value="Access-Control-Allow-Headers">
            Access-Control-Allow-Headers
          </a-select-option>
          <a-select-option value="Access-Control-Expose-Headers">
            Access-Control-Expose-Headers
          </a-select-option>
          <a-select-option value="Access-Control-Allow-Credentials">
            Access-Control-Allow-Credentials
          </a-select-option>
          <a-select-option value="Access-Control-Max-Age">
            Access-Control-Max-Age
          </a-select-option>
        </a-select>
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
            this.type = "modify";
            this.configId = newVal.configId;
            this.form = {
              key: this.detail.key,
              value: this.detail.value
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
      type: "add",
      configId: undefined,
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      loading: false,
      form: {
        key: "Cache-Control",
        value: ""
      },
      rules: {
        key: [
          {
            required: true,
            message: "请选择参数",
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
        key: "Cache-Control",
        value: ""
      };
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let tempForm = {
            key: this.form.key,
            value: this.form.value,
            header_operation_type: "add"
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
<style lang="less" scoped>
.update-source-container {
  .info-txt {
    color: #aaa;
    line-height: 22px;
  }
}
</style>
