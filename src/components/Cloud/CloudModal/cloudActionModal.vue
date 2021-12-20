<template>
  <a-modal
    :visible="value"
    width="630px"
    centered
    title="云服务器续费"
    wrapClassName="renew-modal-container"
    okText="确认续费"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
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
      loading: false
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
.renew-modal-container {
  background: #fff;
}
</style>
