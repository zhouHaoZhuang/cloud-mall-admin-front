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
      <a-form-model-item v-if="this.type === 1" label="Range回源">
        <a-radio-group v-model="form.enable">
          <a-radio value="off"> 关闭 </a-radio>
          <a-radio value="on"> 开启 </a-radio>
          <a-radio value="force"> 强制 </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item
        v-if="this.type === 2"
        label="自定义试看参数名"
        prop="ali_video_preview_argument"
      >
        <a-input v-model="form.ali_video_preview_argument" />
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
        ali_video_preview_argument: [
          {
            required: true,
            message: "请输入自定义参数名",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
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
              this.form = {
                ...getForm(data[0], newForm, ["enable"])
              };
            }
          } else {
            this.form = { ...this.modalMap[this.type].form };
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
          let newForm = {
            ...getParameter(tempForm, this.functionName, this.domain)
          };
          if (this.type === 1) {
            newForm = {
              ...getParameter(tempForm, this.functionName, this.domain, [
                "enable"
              ])
            };
          }
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
