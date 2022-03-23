<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    title="如何设置解析"
    wrapClassName="course-modal-container"
    @cancel="handleCancel"
  >
    <div slot="footer">
      <a-button type="primary" @click="handleCancel">知道了</a-button>
    </div>
    <div class="content-box">
      <div class="title">如何设置解析？</div>
      <div class="info mb20">
        请先进入域名解析控制台，以下以阿里云为例！
      </div>
      <div class="title">操作流程：</div>
      <div class="info">
        进入阿里云域名控制台，点击域名列表，找到需要解析的域名，点击解析，
        点击添加记录，选择记录类型，记录类型选择CNAME，输入主机记录，记
        录值以及TTL后，点击确认即可
      </div>
    </div>
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
  methods: {
    // 关闭弹窗
    handleCancel() {
      this.$emit("changeVisible", false);
    }
  }
};
</script>
<style lang="less" scoped>
.course-modal-container {
  .content-box {
    color: #000;
    .title {
      font-size: 22px;
      font-weight: 500;
      margin-bottom: 10px;
    }
    .info {
      font-size: 16px;
      color: #000;
    }
    .mb20 {
      margin-bottom: 20px;
    }
  }
}
</style>
