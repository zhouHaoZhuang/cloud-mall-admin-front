<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    title="HTTPS设置"
    wrapClassName="domain-https-container"
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
      <a-form-model-item label="是否启用">
        <a-switch v-model="form.enable">
          <a-icon slot="checkedChildren" type="check" />
          <a-icon slot="unCheckedChildren" type="close" />
        </a-switch>
      </a-form-model-item>
      <a-form-model-item label="证书公钥" prop="sslPub">
        <a-textarea
          v-model="form.sslPub"
          :rows="4"
          @focus="handleInputFocus('sslPub')"
        />
        <a-button type="link" @click="handleExamples('sslPub')">
          pem编码参考样例
        </a-button>
      </a-form-model-item>
      <a-form-model-item label="证书私钥" prop="sslPri">
        <a-textarea
          v-model="form.sslPri"
          :rows="4"
          @focus="handleInputFocus('sslPri')"
        />
        <a-button type="link" @click="handleExamples('sslPri')">
          pem编码参考样例
        </a-button>
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
    // domain
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
        } else {
          this.getDomainHttps();
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
        enable: true,
        sslPub: "",
        sslPri: ""
      },
      rules: {
        sslPub: [
          {
            required: true,
            message: "请输入证书公钥",
            tigger: ["blur", "change"]
          }
        ],
        sslPri: [
          {
            required: true,
            message: "请输入证书私钥",
            tigger: ["blur", "change"]
          }
        ]
      },
      // 示例编码
      sslPub:
        "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMYfnvWtC8Id5bPKae5yXSxQTt\n+Zpul6AnnZWfI2TtIarvjHBFUtXRo96y7hoL4VWOPKGCsRqMFDkrbeUj\nyQjtQ8mbDOsiLLvh7wIDAQAB\n-----END PUBLIC KEY-----",
      sslPri:
        "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMYfnvWtC8Id5bPKae5yXSxQTt\n+Zpul6AnnZWfI2TtIarvjHBFUtXRo96y7hoL4VWOPKGCsRqMFDkrbeUj\nyQjtQ8mbDOsiLLvh7wIDAQAB\n-----END PUBLIC KEY-----",
      sslPubStatus: false,
      sslPriStatus: false
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
        enable: true,
        sslPub: "",
        sslPri: ""
      };
    },
    // 获取https配置
    getDomainHttps() {
      this.$store
        .dispatch("domain/getDomainHttps", { domain: this.domain })
        .then(res => {
          this.form = {
            ...res.data,
            enable: res.data.enable === "on" ? true : false
          };
        });
    },
    // 填充示例代码
    handleExamples(type) {
      if (type === "sslPub") {
        this.sslPubStatus = true;
      }
      if (type === "sslPri") {
        this.sslPriStatus = true;
      }
      this.form[type] = this[type];
    },
    // 输入框聚焦事件
    handleInputFocus(type) {
      if (type === "sslPub" && this.sslPubStatus) {
        this.sslPubStatus = false;
        this.form.sslPub = "";
      }
      if (type === "sslPri" && this.sslPriStatus) {
        this.sslPriStatus = false;
        this.form.sslPri = "";
      }
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("domain/saveDomainHttps", {
              ...this.form,
              domainName: this.domain,
              enable: this.form.enable ? "on" : "off"
            })
            .then(res => {
              this.$message.success(
                `${this.form.enable ? "启用" : "禁用"}https证书成功`
              );
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
<style lang="less" scoped></style>
