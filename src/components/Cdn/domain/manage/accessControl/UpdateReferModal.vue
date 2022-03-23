<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
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
      <a-form-model-item label="Refer类型" prop="type">
        <a-radio-group v-model="form.type">
          <a-radio :value="1"> 黑名单 </a-radio>
          <a-radio :value="2"> 白名单 </a-radio>
        </a-radio-group>
        <div class="info-txt">
          黑、白名单互斥，同一时间只支持其中一种方式生效。请您选择需要生效的方式。
        </div>
      </a-form-model-item>
      <a-form-model-item label="规则" prop="type">
        <a-textarea v-model="form.type" :rows="5" />
        <div class="info-txt">
          使用回车符分隔多个Refer名单，支持通配符，如a.*b.com可以匹配到a.yisu.b.com或a.img.b.com等。
        </div>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 15, offset: 6 }">
        <a-checkbox v-model="form.type">
          允许通过浏览器地址栏直接访问资源URL
        </a-checkbox>
        <div class="info-txt">允许空 Referer字段访问CDN资源。</div>
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
