<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    destroyOnClose
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
      <a-form-model-item label="证书配置">
        <a-radio-group v-model="form.type" @change="handleRadioChange">
          <a-radio style="margin-top: 10px" :value="1">
            方式一： 导入zip文件(当前仅支持阿里云证书的zip包。）
          </a-radio>
          <a-radio style="margin-top: 5px" :value="2">
            方式二： 录入key、crt或pem文件。
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item
        class="form-label-before"
        v-if="form.type === 1"
        label="证书文件"
        prop="upload"
      >
        <a-upload
          name="file"
          accept=".zip"
          :action="uploadUrl"
          :headers="headers"
          :remove="handleUploadRemove"
          @change="handleUpload"
        >
          <a-button v-if="!form.sslPub && !form.sslPri">
            <a-icon type="upload" />
            点击上传
          </a-button>
        </a-upload>
      </a-form-model-item>
      <a-form-model-item v-if="form.type === 2" label="证书公钥" prop="sslPub">
        <a-textarea
          v-model="form.sslPub"
          :rows="4"
          @focus="handleInputFocus('sslPub')"
        />
        <a-button type="link" @click="handleExamples('sslPub')">
          pem编码参考样例
        </a-button>
      </a-form-model-item>
      <a-form-model-item v-if="form.type === 2" label="证书私钥" prop="sslPri">
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
import env from "@/config/env";
import { getDomainUrl } from "@/utils/index";
import { mapState } from "vuex";
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
  computed: {
    ...mapState({
      token: (state) => state.user.token
    }),
    uploadUrl() {
      return (
        env.BASE_URL + "/aliyun/dcdn/handleDcdnDomainCertificate/uploadFile"
      );
    },
    headers() {
      return {
        authorization: "authorization-text",
        domain: getDomainUrl(),
        system: "idc",
        token: this.token
      };
    }
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      loading: false,
      form: {
        enable: false,
        type: 1,
        sslPub: "",
        sslPri: ""
      },
      rules: {
        upload: [
          {
            validator: (rule, value, callback) => {
              if (this.form.sslPub === "" || this.form.sslPri === "") {
                callback(new Error("请上传证书文件"));
              } else {
                callback();
              }
            },
            tigger: "change"
          }
        ],
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
        enable: false,
        type: 1,
        sslPub: "",
        sslPri: ""
      };
      this.fileList = [];
    },
    // 获取https配置
    getDomainHttps() {
      this.$store
        .dispatch("cdn/getDomainHttps", { domainName: this.domain })
        .then((res) => {
          const newData = res.data.certInfos.certInfo[0];
          this.form = {
            ...newData,
            type: 2,
            enable: newData.enable === "on" ? true : false
          };
        });
    },
    // 单选change事件
    handleRadioChange(e) {
      const val = e.target.value;
      this.form.sslPub = "";
      this.form.sslPri = "";
      if (val === 2) {
        // this.getDomainHttps();
      }
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
    // 上传zip
    handleUpload(info) {
      if (info.file.status === "done") {
        const data = info.file.response.data;
        this.form.sslPub = data.sslPub;
        this.form.sslPri = data.sslPri;
        this.$message.success(`${info.file.name} 文件上传成功`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} 文件上传失败`);
      }
    },
    // 删除上传文件
    handleUploadRemove(file) {
      this.form.sslPub = "";
      this.form.sslPri = "";
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (
            this.form.sslPub === this.sslPub ||
            this.form.sslPri === this.sslPri
          ) {
            this.$message.error("示例证书不能提交");
            return
          }
          this.loading = true;
          this.$store
            .dispatch("cdn/saveDomainHttps", {
              ...this.form,
              domainName: this.domain,
              enable: this.form.enable ? "on" : "off"
            })
            .then((res) => {
              this.$message.success(
                `${this.form.enable ? "启用" : "禁用"}https证书成功`
              );
              this.$emit("success", -1);
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
