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
        <a-form-model-item label="回源HOST" prop="type">
          <a-switch v-model="form.type">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
          <div class="info-txt">
            自定义在CDN节点回源过程中所需访问的WEB服务器域名
          </div>
        </a-form-model-item>
        <a-form-model-item label="域名类型" prop="type">
          <a-radio-group v-model="form.type">
            <a-radio
              v-for="(val, key) in scopeAreaEnum"
              :key="key"
              :value="key"
            >
              加速域名
            </a-radio>
            <a-radio :value="2"> 源站域名 </a-radio>
            <a-radio :value="3"> 自定义域名 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="域名" prop="type">
          <a-input v-model="form.type" placeholder="请输入自定义域名" />
        </a-form-model-item>
      </div>
      <a-form-model-item v-if="this.type === 2" label="跳转类型" prop="type">
        <a-radio-group v-model="form.type">
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
        <a-form-model-item label="SNI" prop="https_origin_sni">
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
    detail: {
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
    form() {
      return this.modalMap[this.type].form;
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
      modalMap: {
        1: {
          title: "回源HOST",
          functionName: "set_req_host_header",
          aloneCloseReq: 'cdn/',
          form: { domain_name: "" }
        },
        2: {
          title: "静态协议跟随回源",
          functionName: "forward_scheme",
          form: { type: 2 }
        },
        3: {
          title: "回源SNI",
          functionName: "https_origin_sni",
          form: { enabled: "on", https_origin_sni: "" }
        },
        4: {
          title: "回源请求超时时间",
          functionName: "forward_timeout",
          form: { forward_timeout: 30 }
        }
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
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
          console.log(getForm(res));
        });
    },
    // 弹窗提交
    handleOk() {
      console.log(
        this.form,
        getParameter(this.form, this.functionName, this.domain)
      );
      // this.$refs.ruleForm.validate((valid) => {
      //   if (valid) {
      //     this.loading = true;
      //     this.$store
      //       .dispatch("domain/add", this.form)
      //       .then((res) => {
      //         this.$message.success(`修改${this.modalTitle}成功`);
      //         this.$emit("success");
      //         this.$emit("changeVisible", false);
      //       })
      //       .finally(() => {
      //         this.loading = false;
      //       });
      //   }
      // });
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
