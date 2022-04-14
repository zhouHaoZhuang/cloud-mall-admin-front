<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    destroyOnClose
    title="过滤参数"
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
      <a-form-model-item label="过滤参数" prop="type">
        <a-switch v-model="form.disable" @change="checkParams">
          <a-icon slot="checkedChildren" type="check" />
          <a-icon slot="unCheckedChildren" type="close" />
        </a-switch>
        <div class="info-txt">
          回源时会去除 URL
          中？之后的参数，有效提高文件缓存命中率，提升分发效率。
        </div>
      </a-form-model-item>
      <a-form-model-item
        v-if="this.type === 1"
        label="保留参数"
        prop="hashkey_args"
      >
        <a-input v-model="form.hashkey_args" :disabled="!form.disable" />
        <div class="info-txt">最多10个, 使用英文逗号做分隔符。</div>
      </a-form-model-item>
      <a-form-model-item
        v-if="this.type !== 1 && form.disable !== true"
        label="忽略参数"
      >
        <a-input v-model="form.ali_remove_args" :disabled="!form.disable" />
        <div class="info-txt">请使用空格分隔。</div>
      </a-form-model-item>
      <a-form-model-item
        v-if="this.type !== 1 && form.disable === true"
        label="忽略参数"
        prop="ali_remove_args"
      >
        <a-input v-model="form.ali_remove_args" :disabled="!form.disable" />
        <div class="info-txt">请使用空格分隔。</div>
      </a-form-model-item>
      <a-form-model-item label="保留回源参数" prop="type">
        <a-switch v-model="form.keep_oss_args" :disabled="!form.disable">
          <a-icon slot="checkedChildren" type="check" />
          <a-icon slot="unCheckedChildren" type="close" />
        </a-switch>
        <div class="info-txt">
          开启后回源保留所有参数，未开启时缓存hashkey的参数一致。
        </div>
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
    prop: "value",
  },
  props: {
    // 组件传递的值
    value: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 1,
    },
    modalMap: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    functionName() {
      return this.modalMap[this.type].functionName;
    },
    domain() {
      return this.$route.query.domain;
    },
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal) {
          this.getConfig();
        }
      },
    },
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      loading: false,
      form: {},
      rules: {
        hashkey_args: [
          {
            required: true,
            message: "请输入参数",
            trigger: "change",
          },
        ],
        ali_remove_args: [
          {
            required: true,
            message: "请输入参数",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    checkParams() {
      if (this.form.disable === false) {
        this.form.ali_remove_args = "";
      }
    },
    // 获取配置详情
    getConfig() {
      this.$store
        .dispatch("cdn/getDomainConfig", {
          functionNames: this.functionName,
          domainName: this.domain,
        })
        .then((res) => {
          const data = res.data.domainConfigs.domainConfig;
          if (data.length > 0) {
            const newForm = { ...this.modalMap[this.type].form };
            this.form = {
              ...getForm(data[0], newForm),
            };
            if (this.type === 2) {
              this.form.disable = true;
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
    // 过滤参数按钮关闭提交方法
    removeSubmit() {
      this.loading = true;
      const newFunctionName =
        this.type === 1 ? "ali_remove_args" : "set_hashkey_args";
      this.$store
        .dispatch("cdn/delAloneConfig", {
          functionNames: newFunctionName,
          domainName: this.domain,
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          // await this.removeSubmit();
          let tempForm = { ...this.form };
          if (this.type === 2) {
            delete tempForm.disable;
          }
          let newForm = {
            ...getParameter(tempForm, this.functionName, this.domain),
          };
          //保留参数时候的判断
          if (this.type === 1) {
            let splice = newForm.functions[0].functionArgs.filter(
              (ele, index) => {
                return ele.argName !== "ali_remove_args";
              }
            );
            newForm.functions[0].functionArgs = splice;
          }

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
    },
  },
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
