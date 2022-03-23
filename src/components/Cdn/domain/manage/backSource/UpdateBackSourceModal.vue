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
      <div v-if="this.type === 1">
        <a-form-model-item label="回源HOST" prop="type">
          <a-switch v-model="form.type">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
          <div class="info-txt">
            自定义在CDN节点回源过程中所需访问的WEB服务器域名
          </div>
        </a-form-model-item>
        <a-form-model-item label="域名类型" prop="type">
          <a-radio-group v-model="form.type">
            <a-radio :value="1"> 加速域名 </a-radio>
            <a-radio :value="2"> 源站域名 </a-radio>
            <a-radio :value="3"> 自定义域名 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="域名" prop="type">
          <a-input v-model="form.type" placeholder="请输入自定义域名" />
        </a-form-model-item>
      </div>
      <a-form-model-item v-if="this.type === 2" label="跳转类型" prop="type">
        <a-radio-group v-model="form.type">
          <a-radio :value="1"> 跟随 </a-radio>
          <a-radio :value="2"> HTTP </a-radio>
          <a-radio :value="3"> HTTPS </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <div v-if="this.type === 3">
        <a-form-model-item label="回源SNI开关" prop="type">
          <a-switch v-model="form.type">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
        </a-form-model-item>
        <a-form-model-item label="SNI" prop="type">
          <a-input v-model="form.type" placeholder="请输入SNI" />
        </a-form-model-item>
      </div>
      <a-form-model-item v-if="this.type === 4" label="超时时间" prop="type">
        <a-input
          v-model="form.type"
          v-number-evolution="{ value: 0, min: 0, max: 900 }"
          suffix="秒"
          style="width: 100px"
        />
        <div class="info-txt">
          默认为30s，回源正常时不应超过100，最大值不超过900。
        </div>
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
        1: "回源HOST",
        2: "静态协议跟随回源",
        3: "回源SNI",
        4: "回源请求超时时间"
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
