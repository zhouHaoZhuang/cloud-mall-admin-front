<template>
  <a-modal
    :visible="value"
    width="780px"
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
      <a-form-model-item label="源站信息" prop="type">
        <a-radio-group v-model="form.type">
          <a-radio v-for="(val, key) in cdnTypeEnum" :key="key" :value="key">
            {{ val }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item :label="cdnTypeEnum[form.type]" prop="content">
        <a-input v-model="form.content" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="优先级" prop="priority">
        <a-radio-group v-model="form.priority">
          <a-radio
            v-for="(val, key) in cdnPriorityEnum"
            :key="key"
            :value="key"
          >
            {{ val }}
          </a-radio>
        </a-radio-group>
        <div class="info-txt">
          优先级为主源站＞备源站，主源站出现故障的情况下，将会回源到备源站
        </div>
      </a-form-model-item>
      <a-form-model-item label="权重" prop="weight">
        <a-input
          v-model="form.weight"
          v-number-evolution="{ value: 0, min: 1, max: 100 }"
          style="width: 120px"
        />
        <div class="info-txt">
          权重允许范围为1~100，CDN按照源站的权重分配用户回源到不同源站的比例
        </div>
      </a-form-model-item>
      <a-form-model-item label="端口" prop="port">
        <a-input
          v-model="form.port"
          v-number-evolution="{ value: 0, min: 1, max: 65535 }"
          style="width: 120px"
        />
        <div class="info-txt">
          HTTP支持端口1-65535，HTTPS支持443端口，如果需要HTTPS支持自定义端口，请提交工单
        </div>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { cdnTypeEnum, cdnPriorityEnum } from "@/utils/enum";
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
    // 是否是本地增删改查
    isLocal: {
      type: Boolean,
      default: true
    },
    detail: {
      type: Object,
      default: () => {}
    },
    // 获取本地的添加数据列表
    sourceList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    modalTitle() {
      return this.type === "add" ? "新增源站信息" : "编辑源站信息";
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
        if (JSON.stringify(newVal) === "{}") {
          this.type = "add";
        } else {
          this.type = "edit";
          this.form = { ...newVal };
        }
      }
    }
  },
  data() {
    return {
      cdnTypeEnum,
      cdnPriorityEnum,
      type: "add",
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      loading: false,
      form: {
        type: "oss",
        content: "",
        priority: "20",
        weight: "",
        port: ""
      },
      rules: {
        type: [
          {
            required: true,
            message: "请选择源站信息",
            trigger: "change"
          }
        ],
        content: [
          {
            required: true,
            message: "请输入",
            trigger: ["blur", "change"]
          },
          {
            validator: (rule, value, callback) => {
              if (this.type === "add") {
                if (this.sourceList.some(item => item.content === value)) {
                  callback(new Error("不能为空或重复"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: ["blur", "change"]
          }
        ],
        priority: [
          {
            required: true,
            message: "请选择优先级",
            trigger: "change"
          }
        ],
        weight: [
          {
            required: true,
            message: "请输入权重",
            trigger: ["blur", "change"]
          }
        ],
        port: [
          {
            required: true,
            message: "请输入端口",
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
    // 重置表单数据
    resetForm() {
      this.$refs.ruleForm.clearValidate();
      this.form = {
        type: "oss",
        content: "",
        priority: "20",
        weight: "",
        port: ""
      };
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isLocal) {
            this.$message.success(this.modalTitle + "成功");
            this.$emit("success", this.type, this.form);
            this.$emit("changeVisible", false);
            return;
          }
          this.loading = true;
          this.$store
            .dispatch("domain/add", this.form)
            .then((res) => {
              this.$message.success(this.modalTitle + "成功");
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
