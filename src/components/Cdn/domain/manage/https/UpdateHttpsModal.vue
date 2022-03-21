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
      <a-form-model-item v-if="this.type === 1" label="跳转类型" prop="type">
        <a-radio-group v-model="form.type">
          <a-radio :value="1"> 默认 </a-radio>
          <a-radio :value="2"> HTTPS > HTTP </a-radio>
          <a-radio :value="3"> HTTP > HTTPS </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <div v-if="this.type === 2">
        <a-form-model-item label="HSTS开关" prop="type">
          <a-switch v-model="form.type">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
        </a-form-model-item>
        <a-form-model-item label="过期时间" prop="type">
          <a-input
            v-model="form.type"
            v-number-evolution="{ value: 0, min: 0, max: 730 }"
            suffix="天"
            style="width: 100px"
          />
          <div class="info-txt">
            该时间表示HSTS
            响应头在浏览器的缓存时间，建议填入60天，可填时间范围为0-730天。
          </div>
        </a-form-model-item>
        <a-form-model-item label="包含子域名" prop="type">
          <a-switch v-model="form.type">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
          <div class="info-txt">
            请谨慎开启，开启前，请确保该加速所有子域名都已开启HTTPS，否则会导致子域名自动跳转到HTTPS后无法访问
          </div>
        </a-form-model-item>
      </div>
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
    type: {
      type: Number,
      default: 1
    },
    detail: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    modalTitle() {
      return this.modalMap[this.type];
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
    }
  },
  data() {
    return {
      modalMap: {
        1: "强制跳转",
        2: "HSTS 设置"
      },
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
