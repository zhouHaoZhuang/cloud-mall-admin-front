<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    destroyOnClose
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
      <a-form-model-item label="URL鉴权">
        <a-switch v-model="form.enable">
          <a-icon slot="checkedChildren" type="check" />
          <a-icon slot="unCheckedChildren" type="close" />
        </a-switch>
      </a-form-model-item>
      <a-form-model-item label="鉴权类型">
        <a-radio-group v-model="form.auth_type" :disabled="!form.enable">
          <a-radio value="type_a"> A方式 </a-radio>
          <a-radio value="type_b"> B方式 </a-radio>
          <a-radio value="type_c"> C方式 </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="主KEY">
        <a-input
          v-model="form.auth_key1"
          v-filterInput-input
          :disabled="!form.enable"
        />
        <div class="info-txt">6~32个字符支持大写字母、小写字母、数字。</div>
      </a-form-model-item>
      <a-form-model-item label="备KEY">
        <a-input
          v-model="form.auth_key2"
          v-filterInput-input
          :disabled="!form.enable"
        />
        <div class="info-txt">6~32个字符支持大写字母、小写字母、数字。</div>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { getParameter, getForm } from "@/utils/index";
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
    modalMap: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    modalTitle() {
      return this.modalMap[this.type];
    },
    functionName() {
      return this.modalMap[this.type].functionName;
    },
    domain() {
      return this.$route.query.domain;
    }
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal) {
          this.getConfig();
        }
      }
    }
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      loading: false,
      form: {},
      rules: {
        key1: [
          {
            required: true,
            message: "请输入主KEY",
            trigger: "blur"
          }
        ],
        abc: [
          {
            required: true,
            message: "请输入备KEY",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 获取hsts配置详情
    getConfig() {
      this.$store
        .dispatch("cdn/getDomainConfig", {
          functionNames: this.functionName,
          domainName: this.domain
        })
        .then((res) => {
          const data = res.data.domainConfigs.domainConfig;
          if (data.length > 0) {
            const newForm = { ...this.modalMap[this.type].form };
            this.form = {
              ...getForm(data[0], newForm),
              enable: true
            };
          } else {
            this.form = { ...this.modalMap[this.type].form, enable: false };
          }
        });
    },
    // 关闭弹窗
    handleCancel() {
      this.$emit("changeVisible", false);
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let tempForm = { ...this.form };
          if (!tempForm.enable) {
            tempForm.auth_type = "no_auth";
          }
          delete tempForm.enable;
          const newForm = {
            ...getParameter(tempForm, this.functionName, this.domain)
          };
          this.loading = true;
          this.$store
            .dispatch("cdn/saveConfig", newForm)
            .then((res) => {
              this.$message.success(`设置成功`);
              this.$emit("success", this.type);
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
