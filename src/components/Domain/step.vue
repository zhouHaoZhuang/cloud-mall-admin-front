<template>
  <div class="work-step-container">
    <div
      class="step-cont margin"
      :class="{ chooseClick: step === 1, choosedClick: step === 4 }"
    >
      {{ text1 }}
      <span class="step-arrow-right"></span>
    </div>
    <div
      class="step-cont margin"
      :class="{ chooseClick: step === 2, choosedClick: step === 4 }"
    >
      <span class="step-arrow-left"></span>

      {{ text2 }}
      <span class="step-arrow-right"></span>
    </div>
    <div
      class="step-cont margin"
      :class="{ chooseClick: step === 3, choosedClick: step === 4 }"
    >
      <span class="step-arrow-left"></span>

      {{ text3 }}
      <span class="step-arrow-right"></span>
    </div>
    <div class="step-cont" :class="{ chooseClick: step === 4 }">
      <span class="step-arrow-left"></span>

      {{ text4 }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 类型
    type: {
      type: String,
      default: "submit"
    },
    // 进度
    step: {
      type: Number,
      default: 1
    }
  },
  computed: {
    text1() {
      if (this.type === "submit") {
        return "①选择问题所属产品 ";
      }
      if (this.type === "myDetail") {
        return "①工单受理 ";
      }
      return "";
    },
    text2() {
      if (this.type === "submit") {
        return "②选择问题类别";
      }
      if (this.type === "myDetail") {
        return "②工单处理中";
      }
      return "";
    },
    text3() {
      if (this.type === "submit") {
        return "③选择解决方案";
      }
      if (this.type === "myDetail") {
        return "③工单完成确认";
      }
      return "";
    },
    text4() {
      if (this.type === "submit") {
        return "④创建工单";
      }
      if (this.type === "myDetail") {
        return "④用户评价";
      }
      return "";
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
