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
      <a-form-model-item label="待重写URL" prop="regex">
        <a-input v-model="form.regex" placeholder="请输入待重写URL" />
        <div class="info-txt">
          以/开头的URI，不含http://头及域名。支持PCRE正则表达式，如 ^/hello$
        </div>
      </a-form-model-item>
      <a-form-model-item label="目标URL" prop="replacement">
        <a-input v-model="form.replacement" placeholder="请输入目标URL" />
        <div class="info-txt">以/开头的URI，不含http://头及域名</div>
      </a-form-model-item>
      <a-form-model-item label="类型" prop="flag">
        <a-radio-group v-model="form.flag">
          <a-radio value="redirect"> Redirect </a-radio>
          <a-radio value="break"> Break </a-radio>
        </a-radio-group>
        <div class="info-txt">
          若请求的URI匹配了当前规则，该请求将被302重定向跳转到目标URI。
        </div>
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
    modalTitle() {
      return this.type === "add" ? "添加重写设置" : "修改重写设置";
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
            this.form = {
              regex: this.detail.regex,
              replacement: this.detail.replacement,
              flag: this.detail.flag
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
        regex: "",
        replacement: "",
        flag: ""
      },
      rules: {
        regex: [
          {
            required: true,
            message: "请输入待重写URL",
            trigger: "change"
          }
        ],
        replacement: [
          {
            required: true,
            message: "请输入目标URL",
            trigger: "change"
          }
        ],
        flag: [
          {
            required: true,
            message: "请选择类型",
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
        regex: "",
        replacement: "",
        flag: ""
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
<style lang="less" scoped>
.update-source-container {
  .info-txt {
    color: #aaa;
    line-height: 22px;
  }
}
</style>
