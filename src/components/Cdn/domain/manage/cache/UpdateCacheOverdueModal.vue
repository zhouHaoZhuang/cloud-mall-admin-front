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
        <a-row>
          <a-space>
            <a-input
              v-model="form.ttl"
              v-number-evolution="{ value: 0, min: 1, max: 999999 }"
              style="width: 150px"
              placeholder="请输入过期时间"
            />
            <a-select
              v-model="timeType"
              style="width: 80px"
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
          </a-space>
        </a-row>
      </a-form-model-item>
      <a-form-model-item label="权重" prop="weight">
        <a-input
          v-model="form.weight"
          v-number-evolution="{ value: 0, min: 1, max: 99 }"
          style="width: 100px"
          placeholder="请输入权重"
        />
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
          this.timeType = "1";
          this.form = {
            ...newVal,
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
        type: 1
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
            required: true,
            message: "请输入过期时间",
            trigger: "change"
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
        type: 1
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
