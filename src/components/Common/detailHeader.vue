<template>
  <div class="detail-header-container" @click="handleBack">
    <div class="box">
      <a-icon type="left" />
    </div>
    <span>{{ title }}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    back: {
      type: String,
      default: ""
    }
  },
  methods: {
    // 点击返回
    handleBack() {
      if (this.back) {
        this.$router.replace(this.back);
      } else {
        this.$router.back();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.detail-header-container {
  display: flex;
  font-weight: 500;
  font-size: 22px;
  color: #272829;
  .box {
    width: 40px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ddd;
    font-size: 18px;
    margin-right: 15px;
    font-weight: 400;
    color: #ccc;
    cursor: pointer;
  }
}
</style>
