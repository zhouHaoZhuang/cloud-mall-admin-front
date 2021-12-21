<template>
  <a-modal
    :visible="value"
    width="500px"
    centered
    title="实例名称"
    wrapClassName="updateName-modal-container"
    okText="确定"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="info-box">
      <a-icon class="icon" type="exclamation-circle" />
      注：修改后方便于管理，不会影响服务器配置，请您放心操作。
    </div>
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="IP地址">
        43.226.39.91:3389 (公)
      </a-form-model-item>
      <a-form-model-item label="自定义名称">
        <a-input />
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
    }
  },
  data() {
    return {
      labelCol: { span: 9 },
      wrapperCol: { span: 10 },
      loading: false,
      form: {}
    };
  },
  created() {},
  methods: {
    // 关闭弹窗
    handleCancel() {
      this.$emit("changeVisible", false);
    },
    // 弹窗提交
    handleOk() {}
  }
};
</script>

<style lang="less" scoped>
.updateName-modal-container {
  background: #fff;
  .info-box {
    display: flex;
    align-items: center;
    padding: 7px 22px 5px 37px;
    min-height: 32px;
    border: 1px solid #ffdac2;
    border-radius: 2px;
    color: #ff6600;
    font-size: 12px;
    margin-bottom: 20px;
    background: #fff3eb;
    .icon {
      font-size: 16px;
      margin-right: 6px;
    }
  }
}
</style>
