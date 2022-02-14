<template>
  <div class="work-step-container">
    <div
      class="step-cont margin"
      :class="{ chooseClick: step === 1, choosedClick: step === 4 }"
    >
      ①工单受理
      <span class="step-arrow-right"></span>
    </div>
    <div
      class="step-cont margin"
      :class="{ chooseClick: step === 2, choosedClick: step === 4 }"
    >
      <span class="step-arrow-left"></span>
      ②工单处理中
      <span class="step-arrow-right"></span>
    </div>
    <div
      class="step-cont margin"
      :class="{ chooseClick: step === 3, choosedClick: step === 4 }"
    >
      <span class="step-arrow-left"></span>
      ③工单完成确认
      <span class="step-arrow-right"></span>
    </div>
    <div class="step-cont" :class="{ chooseClick: step === 4 }">
      <span class="step-arrow-left"></span>
      ④用户评价
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 进度
    step: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.work-step-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 12px;
  .margin {
    margin-right: 45px;
  }
  .step-cont {
    position: relative;
    width: 22.8%;
    height: 36px;
    text-align: center;
    line-height: 36px;
    background-color: #f2f2f2;
    color: #000;
    .step-arrow-left {
      position: absolute;
      top: 0px;
      left: -36px;
      display: inline-block;
      border: 18px solid #f2f2f2;
      border-left-color: transparent;
    }
    .step-arrow-right {
      position: absolute;
      top: 0px;
      right: -36px;
      display: inline-block;
      border: 18px solid transparent;
      border-left-color: #f2f2f2;
    }
  }
  .chooseClick {
    background-color: #00aaff;
    color: #fff;
    .step-arrow-left {
      border-color: #00aaff;
      border-left-color: transparent;
    }
    .step-arrow-right {
      border-left-color: #00aaff;
    }
  }
  .choosedClick {
    background-color: #7fddff;
    color: #fff;
    .step-arrow-left {
      border-color: #7fddff;
      border-left-color: transparent;
    }
    .step-arrow-right {
      border-left-color: #7fddff;
    }
  }
}
</style>
