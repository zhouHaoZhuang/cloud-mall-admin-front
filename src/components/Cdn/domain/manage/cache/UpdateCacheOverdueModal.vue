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
      <a-form-model-item label="过期时间" prop="ttl">
        <a-input
          v-model="form.ttl"
          v-number-evolution="{ value: 0, min: 1, max: 999999 }"
          style="width: 150px"
          placeholder="请输入过期时间"
        />
        <a-select
          v-model="timeType"
          style="width: 80px; margin-left: 10px"
          placeholder="请选择"
        >
          <a-select-option
            v-for="(val, key) in overdueTimeEnum"
            :key="key"
            :value="key"
          >
            {{ val }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="权重" prop="weight">
        <a-input
          v-model="form.weight"
          v-number-evolution="{ value: 0, min: 1, max: 99 }"
          style="width: 100px"
          placeholder="请输入权重"
        />
        <div class="info-txt">最大99，最小1</div>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { overdueTimeEnum } from "@/utils/enum";
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
      return this.type === "add" ? "添加缓存过期时间" : "修改缓存过期时间";
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
          const newArr = Object.keys(this.overdueTimeEnum).reverse();
          const timeType = newArr.find((ele) => newVal.ttl % ele === 0);
          this.timeType = timeType.toString();
          this.form = {
            ...newVal,
            ttl: newVal.ttl / timeType,
            type: newVal.file_type ? 2 : 1
          };
        } else {
          this.type = "add";
          this.timeType = "1";
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      overdueTimeEnum,
      type: "add",
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      loading: false,
      timeType: "1",
      form: {
        type: 1,
        file_type: "",
        path: "",
        ttl: "",
        weight: ""
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
        ttl: [
          {
            validator: (rule, value, callback) => {
              if (!this.form.ttl) {
                callback(new Error("请输入过期时间"));
              } else if (this.form.ttl * this.timeType > 93312000) {
                callback(new Error("过期时间最多为3年"));
              } else {
                callback();
              }
            },
            trigger: ["change", "blur"]
          }
        ],
        weight: [
          {
            required: true,
            message: "请输入权重",
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
        ttl: "",
        weight: ""
      };
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let newFunctionName = "";
          let tempForm = {
            ttl: this.form.ttl * this.timeType,
            weight: this.form.weight
          };
          if (this.form.type === 1) {
            tempForm.path = this.form.path;
            newFunctionName = "path_based_ttl_set";
          }
          if (this.form.type === 2) {
            tempForm.file_type = this.form.file_type;
            newFunctionName = "filetype_based_ttl_set";
          }
          const newForm = {
            ...getParameter(tempForm, newFunctionName, this.domain)
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
