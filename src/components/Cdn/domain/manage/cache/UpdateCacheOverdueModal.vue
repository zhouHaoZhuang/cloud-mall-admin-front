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
      <a-form-model-item label="类型" prop="type">
        <a-radio-group v-model="form.type">
          <a-radio :value="1"> 目录 </a-radio>
          <a-radio :value="2"> 文件后缀名 </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="地址" prop="type">
        <a-input v-model="form.type" placeholder="请输入单个规则" />
        <div class="info-txt">
          添加单条目录（支持完整路径）须以/开头，如/directory/aaa
        </div>
      </a-form-model-item>
      <a-form-model-item label="过期时间" prop="type">
        <a-row>
          <a-space>
            <a-input
              v-model="form.type"
              style="width: 100px"
              placeholder="请输入单个规则"
            />
            <a-select
              v-model="form.type"
              style="width: 80px"
              placeholder="请选择"
            >
              <a-select-option :value="1"> 小秒 </a-select-option>
              <!-- <a-select-option
            v-for="item in roleList"
            :key="item.id"
            :value="item.code"
          >
            {{ item.code }}
          </a-select-option> -->
            </a-select>
          </a-space>
        </a-row>
      </a-form-model-item>
      <a-form-model-item label="权重" prop="type">
        <a-input
          v-model="form.type"
          v-number-evolution="{ value: 0, min: 1, max: 99 }"
          style="width: 100px"
          placeholder="请输入权重"
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
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
        } else {
          this.type = "add";
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      type: "add",
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      loading: false,
      form: {
        type: 1
      },
      rules: {
        type: [
          {
            required: true,
            message: "请选择加速区域",
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
          this.loading = true;
          this.$store
            .dispatch("domain/add", this.form)
            .then((res) => {
              this.$message.success(`修改${this.modalTitle}成功`);
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
