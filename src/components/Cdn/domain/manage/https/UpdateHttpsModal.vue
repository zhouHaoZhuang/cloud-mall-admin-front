<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    destroyOnClose
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
      <a-form-model-item v-if="this.type === 1" label="跳转类型" prop="enable">
        <a-radio-group v-model="form.enable">
          <a-radio :value="1"> 默认 </a-radio>
          <a-radio :value="2"> HTTPS > HTTP </a-radio>
          <a-radio :value="3"> HTTP > HTTPS </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <div v-if="this.type === 2">
        <a-form-model-item label="HSTS开关" prop="enabled">
          <a-switch v-model="form.enabled">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
        </a-form-model-item>
        <a-form-model-item
          label="过期时间"
          :prop="form.enabled ? 'https_hsts_max_age' : ''"
        >
          <a-input
            v-model="form.https_hsts_max_age"
            :disabled="!form.enabled"
            v-number-evolution="{ value: 0, min: 0, max: 730 }"
            suffix="天"
            style="width: 100px"
          />
          <div class="info-txt">
            该时间表示HSTS
            响应头在浏览器的缓存时间，建议填入60天，可填时间范围为0-730天。
          </div>
        </a-form-model-item>
        <a-form-model-item label="包含子域名">
          <a-switch
            :disabled="!form.enabled"
            v-model="form.https_hsts_include_subdomains"
          >
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
          <div class="info-txt">
            请谨慎开启，开启前，请确保该加速所有子域名都已开启HTTPS，否则会导致子域名自动跳转到HTTPS后无法访问
          </div>
        </a-form-model-item>
      </div>
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
      return this.modalMap[this.type].title;
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
          if (this.type === 1) {
            this.getForceConfig();
          }
          if (this.type === 2) {
            this.getConfig();
          }
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
        enable: [
          {
            required: true,
            message: "请选择跳转类型",
            trigger: "change"
          }
        ],
        https_hsts_max_age: [
          {
            required: true,
            message: "请输入过期时间",
            trigger: ["change", "blur"]
          }
        ]
      }
    };
  },
  methods: {
    // 获取强制跳转配置
    getForceConfig() {
      this.$store
        .dispatch("cdn/getDomainConfig", {
          functionNames: "http_force,https_force",
          domainName: this.domain
        })
        .then((res) => {
          const data = res.data.domainConfigs.domainConfig;
          if (data.length > 0) {
            this.form = {
              enable: data[0].functionName === "http_force" ? 2 : 3
            };
          } else {
            this.form = {
              enable: 1
            };
          }
        });
    },
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
              https_hsts_max_age:
                getForm(data[0], newForm).getForm(data[0], newForm) / 86400
            };
          } else {
            this.form = { ...this.modalMap[this.type].form };
          }
        });
    },
    // 关闭弹窗
    handleCancel() {
      this.$emit("changeVisible", false);
    },
    // 强制跳转提交
    forceConfigSubmit() {
      const req = this.modalMap[this.type].isBeforeDel;
      let delFunctionName = "http_force,https_force";
      if (this.form.enable === 2) {
        delFunctionName = "https_force";
      }
      if (this.form.enable === 3) {
        delFunctionName = "http_force";
      }
      const newForm = {
        functionNames: delFunctionName,
        domainName: this.domain
      };
      this.loading = true;
      this.$store
        .dispatch(req, newForm)
        .then((res) => {
          if (this.form.enable !== 1) {
            let tempForm = { enable: true };
            let newFunctionName = "";
            if (this.form.enable === 2) {
              newFunctionName = "http_force";
            }
            if (this.form.enable === 3) {
              newFunctionName = "https_force";
            }
            const result = {
              ...getParameter(tempForm, newFunctionName, this.domain)
            };
            this.$store
              .dispatch("cdn/saveConfig", result)
              .then((res) => {
                this.$message.success(`设置成功`);
                this.$emit("success", this.type);
                this.$emit("changeVisible", false);
              })
              .finally(() => {
                this.loading = false;
              });
            return;
          }
          this.$message.success(`设置成功`);
          this.$emit("success", this.type);
          this.$emit("changeVisible", false);
        })
        .finally(() => {
          if (this.form.enable !== 3) {
            this.loading = false;
          }
        });
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.type === 1) {
            this.forceConfigSubmit();
            return;
          }
          const tempForm = {
            ...this.form,
            https_hsts_max_age: this.form.https_hsts_max_age * 86400
          };
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
