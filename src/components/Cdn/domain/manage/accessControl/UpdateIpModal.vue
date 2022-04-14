<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    destroyOnClose
    title="IP黑/白名单规则"
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
      <a-form-model-item label="名单类型">
        <a-radio-group v-model="ipType" @change="handleChangeRadio">
          <a-radio :value="1"> 黑名单 </a-radio>
          <a-radio :value="2"> 白名单 </a-radio>
        </a-radio-group>
        <div class="info-txt">
          黑、白名单互斥，同一时间只支持其中一种方式生效。请您选择需要生效的方式。
        </div>
      </a-form-model-item>
      <a-form-model-item label="规则" prop="ip_list">
        <a-textarea v-model="form.ip_list" :rows="5" />
        <div class="info-txt">
          最多100个使用回车符分隔不可重复支持网段添加，如127.0.0.1/24。
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
      ipType: 1,
      getParameter,
      form: {
        ip_list: ""
      },
      rules: {
        ip_list: [
          {
            required: true,
            message: "请输入规则",
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
          functionNames: "ip_black_list_set,ip_allow_list_set",
          domainName: this.domain
        })
        .then((res) => {
          const data = res.data.domainConfigs.domainConfig;
          if (data.length > 0) {
            this.ipType = data[0].functionName === "ip_black_list_set" ? 1 : 2;
            const newForm = { ...this.form };
            this.form = {
              ...getForm(data[0], newForm)
            };
          } else {
            this.form = {
              ip_list: ""
            };
          }
        });
    },
    // 关闭弹窗
    handleCancel() {
      this.$emit("changeVisible", false);
    },
    // change类型
    handleChangeRadio() {
      if (!this.form.ip_list) return;
      this.$confirm({
        title: `配置规则删除`,
        content:
          "当黑白名单类型切换时，之前配置的规则将会被删除，此操作不可逆。",
        centered: true,
        onOk: () => {
          const newFunctionName =
            this.ipType === 1 ? "ip_allow_list_set" : "ip_black_list_set";
          this.$store
            .dispatch("cdn/delAloneConfig", {
              functionNames: newFunctionName,
              domainName: this.domain
            })
            .then((res) => {
              this.getConfig();
            });
        },
        onCancel: () => {
          const temp = this.ipType;
          this.ipType = temp === 1 ? 2 : 1;
        }
      });
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const newFunctionName =
            this.ipType === 1 ? "ip_black_list_set" : "ip_allow_list_set";
          if(this.form.ip_list.includes("\n")){
            this.form.ip_list = this.form.ip_list.replace(/\n/g, ",");
          }
          let tempForm = { ...this.form };
          const newForm = {
            ...this.getParameter(tempForm, newFunctionName, this.domain)
          };
          this.loading = true;
          console.log(newForm, 'newFunctionName----------');
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
