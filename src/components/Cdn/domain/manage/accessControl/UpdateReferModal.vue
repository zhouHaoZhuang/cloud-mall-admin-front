<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    destroyOnClose
    title="Refer防盗链"
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
      <a-form-model-item label="Refer类型">
        <a-radio-group v-model="referType" @change="handleChangeRadio">
          <a-radio :value="1"> 黑名单 </a-radio>
          <a-radio :value="2"> 白名单 </a-radio>
        </a-radio-group>
        <div class="info-txt">
          黑、白名单互斥，同一时间只支持其中一种方式生效。请您选择需要生效的方式。
        </div>
      </a-form-model-item>
      <a-form-model-item label="规则" prop="list">
        <a-textarea v-model="form.list" :rows="5" />
        <div class="info-txt">
          使用回车符分隔多个Refer名单，支持通配符，如a.*b.com可以匹配到a.slayun.b.com或a.img.b.com等。
        </div>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 15, offset: 6 }">
        <a-checkbox v-model="form.allow_empty">
          允许通过浏览器地址栏直接访问资源URL
        </a-checkbox>
        <div class="info-txt">允许空 Referer字段访问CDN资源。</div>
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
      referType: 1,
      form: {
        allow_empty: false,
        list: ""
      },
      rules: {
        list: [
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
          functionNames: "referer_black_list_set,referer_white_list_set",
          domainName: this.domain
        })
        .then((res) => {
          const data = res.data.domainConfigs.domainConfig;
          if (data.length > 0) {
            this.referType =
              data[0].functionName === "referer_black_list_set" ? 1 : 2;
            let newForm = { allow_empty: this.form.allow_empty };
            const key =
              this.referType === 1
                ? "refer_domain_deny_list"
                : "refer_domain_allow_list";
            if (this.referType === 1) {
              newForm.refer_domain_deny_list = "";
            } else {
              newForm.refer_domain_allow_list = "";
            }
            this.form = {
              allow_empty: getForm(data[0], newForm).allow_empty,
              list: getForm(data[0], newForm)[key]
            };
          } else {
            this.form = {
              allow_empty: false,
              list: ""
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
      if (!this.form.list) return;
      this.$confirm({
        title: `配置规则删除`,
        content:
          "当黑白名单类型切换时，之前配置的规则将会被删除，此操作不可逆。",
        centered: true,
        onOk: () => {
          const newFunctionName =
            this.referType === 1
              ? "referer_white_list_set"
              : "referer_black_list_set";
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
          const temp = this.referType;
          this.referType = temp === 1 ? 2 : 1;
        }
      });
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const newFunctionName =
            this.referType === 1
              ? "referer_black_list_set"
              : "referer_white_list_set";
          let tempForm = { allow_empty: this.form.allow_empty };
          if (this.referType === 1) {
            tempForm.refer_domain_deny_list = this.form.list;
          } else {
            tempForm.refer_domain_allow_list = this.form.list;
          }
          console.log(tempForm,'newFunctionName');
          const newForm = {
            ...getParameter(tempForm, newFunctionName, this.domain)
          };
          this.loading = true;
          // newForm.functions.forEach(element => {
             
          //     element.functionArgs.forEach(ele => {
          //        console.log( typeof ele.argValue,'e');
          //          let a = ele.argValue
          //          var reg = /[\n]/g;
                
          //            a=a.replace(reg,',')
          //            console.log(a,'aaaaaa');
                   
          //     });
          // });
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
