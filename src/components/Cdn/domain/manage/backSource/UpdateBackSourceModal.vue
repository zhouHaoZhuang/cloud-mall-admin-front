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
      <div v-if="this.type === 1">
        <a-form-model-item label="回源HOST">
          <a-switch v-model="form.enable">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
          <div class="info-txt">
            自定义在CDN节点回源过程中所需访问的WEB服务器域名
          </div>
        </a-form-model-item>
        <a-form-model-item label="域名类型">
          <a-radio-group
            v-model="form.type"
            :disabled="!form.enable"
            @change="handleRadioChange"
          >
            <a-radio :value="1"> 加速域名 </a-radio>
            <!-- <a-radio :value="2"> 源站域名 </a-radio> -->
            <a-radio :value="3"> 自定义域名 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="域名">
          <a-input
            v-if="form.type === 3"
            :disabled="!form.enable"
            v-model="form.domain_name"
            placeholder="请输入自定义域名"
          />
          <span v-else>
            {{ form.domain_name }}
          </span>
        </a-form-model-item>
      </div>
      <a-form-model-item v-if="this.type === 2" label="跳转类型" prop="type">
        <a-radio-group v-model="form.scheme_origin">
          <a-radio
            v-for="(val, key) in sourceProtocolEnum"
            :key="key"
            :value="key"
          >
            {{ val }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <div v-if="this.type === 3">
        <a-form-model-item label="回源SNI开关">
          <a-switch v-model="form.enabled">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
        </a-form-model-item>
        <a-form-model-item
          v-if="form.enabled"
          label="SNI"
          prop="https_origin_sni"
        >
          <a-input v-model="form.https_origin_sni" placeholder="请输入SNI" />
        </a-form-model-item>
      </div>
      <a-form-model-item
        v-if="this.type === 4"
        label="超时时间"
        prop="forward_timeout"
      >
        <a-input
          v-model="form.forward_timeout"
          v-number-evolution="{ value: 0, min: 0, max: 900 }"
          suffix="秒"
          style="width: 100px"
        />
        <div class="info-txt">
          默认为30s，回源正常时不应超过100，最大值不超过900。
        </div>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { getParameter, getForm } from "@/utils/index";
import { sourceProtocolEnum } from "@/utils/enum";
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
  watch: {
    value: {
      handler(newVal) {
        if (newVal) {
          this.getConfig();
        }
      }
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
  data() {
    return {
      sourceProtocolEnum,
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      form: {},
      loading: false,
      rules: {
        https_origin_sni: [
          {
            required: true,
            message: "请输入SNI",
            trigger: ["blur", "change"]
          }
        ],
        forward_timeout: [
          {
            required: true,
            message: "请输入超时时间",
            trigger: ["blur", "change"]
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
    // 获取配置详情
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
              ...getForm(data[0], newForm)
            };
            if (this.type === 1) {
              this.form.type = this.form.domain_name === this.domain ? 1 : 3;
              this.form.enable = true;
            }
          } else {
            this.form = { ...this.modalMap[this.type].form };
            if (this.type === 1) {
              this.form.domain_name = this.domain;
            }
          }
        });
    },
    // 域名类型change
    handleRadioChange(e) {
      if (e.target.value !== 3) {
        this.form.domain_name = this.domain;
      }
    },
    // 弹窗提交
    handleOk() {
      console.log(
        this.form,
        getParameter(this.form, this.functionName, this.domain)
      );
      let req = "";
      let newForm = {};
      if (this.type === 1 && !this.form.enable) {
        req = this.modalMap[this.type].aloneCloseReq;
        newForm = {
          functionNames: this.functionName,
          domainName: this.domain
        };
      } else {
        let tempForm = { ...this.form };
        if (this.type === 1) {
          tempForm = {
            domain_name: this.form.domain_name
          };
        }
        if (this.type === 3 && !this.form.enabled) {
          tempForm = {
            enabled: this.form.enabled
          };
        }
        newForm = {
          ...getParameter(tempForm, this.functionName, this.domain)
        };
        console.log(tempForm, newForm);
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch(req ? req : "cdn/saveConfig", newForm)
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
