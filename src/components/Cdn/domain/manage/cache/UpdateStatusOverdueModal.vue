<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
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
      <a-form-model-item label="类型">
        <a-radio-group v-model="form.type" :disabled="type === 'edit'">
          <a-radio :value="1"> 目录 </a-radio>
          <a-radio :value="2"> 文件后缀名 </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item v-if="form.type === 1" label="地址" prop="path">
        <a-input v-model="form.path" placeholder="请输入地址" />
        <div class="info-txt">
          添加单条目录（支持完整路径）须以/开头，如/directory/aaa
        </div>
      </a-form-model-item>
      <a-form-model-item v-if="form.type === 2" label="后缀名" prop="file_type">
        <a-input v-model="form.file_type" placeholder="请输入后缀名" />
        <div class="info-txt">文件后缀如输入多个须以半角逗号分隔如jpg,txt</div>
      </a-form-model-item>
      <a-form-model-item label="状态码过期时间设置" prop="code_string">
        <a-textarea
          v-model="form.code_string"
          placeholder="请输入状态码及时间"
          :rows="4"
        />
        <div class="info-txt">
          可设置4XX,5XX的状态码过期时间，多个以西文逗号隔开，设置时间支持秒.
          <br />
          例如：403=10,404=15
        </div>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { getParameter } from "@/utils/index";
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
    detail: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    modalTitle() {
      return this.type === "add" ? "添加状态码过期时间" : "修改状态码过期时间";
    },
    domain() {
      return this.$route.query.domain;
    }
  },
  watch: {
    value: {
      handler(newVal) {
        if (!newVal) {
          this.$nextTick(() => {
            this.resetForm();
          });
        }
      }
    },
    detail: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== "{}") {
          this.type = "edit";
          this.configId = newVal.configId;
          this.form = {
            ...newVal,
            type: newVal.file_type ? 2 : 1
          };
        } else {
          this.type = "add";
          this.configId = undefined;
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      type: "add",
      configId: undefined,
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      loading: false,
      form: {
        type: 1,
        file_type: "",
        path: "",
        code_string: ""
      },
      rules: {
        path: [
          {
            required: true,
            message: "请输入地址",
            trigger: "change"
          }
        ],
        file_type: [
          {
            required: true,
            message: "请输入后缀名",
            trigger: "change"
          }
        ],
        code_string: [
          {
            required: true,
            message: "请输入状态码过期时间",
            trigger: "change"
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
    // 重置表单数据
    resetForm() {
      this.$refs.ruleForm.clearValidate();
      this.form = {
        type: 1,
        file_type: "",
        path: "",
        code_string: ""
      };
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let newFunctionName = "";
          let tempForm = {
            code_string: this.form.code_string
          };
          if (this.form.type === 1) {
            tempForm.path = this.form.path;
            newFunctionName = "path_force_ttl_code";
          }
          if (this.form.type === 2) {
            tempForm.file_type = this.form.file_type;
            newFunctionName = "filetype_force_ttl_code";
          }
          const newForm = {
            ...getParameter(
              tempForm,
              newFunctionName,
              this.domain,
              [],
              this.configId
            )
          };
          this.loading = true;
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
