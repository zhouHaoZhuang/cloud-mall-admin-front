<template>
  <div class="number-input-wrap">
    <a-button
      :disabled="minusDisabled"
      class="left-btn"
      type="link"
      @click="handleReduce"
      icon="minus-circle"
    />
    <div class="center">
      <a-input
        v-number-evolution="{ value: 0, min, max }"
        :disabled="disabled"
        :value="inputValue"
        class="input"
        @blur="handleInput"
      />
      <div :class="disabled ? 'company company-bg' : 'company'">
        {{ company }}
      </div>
    </div>
    <a-button
      :disabled="plusDisabled"
      class="right-btn"
      type="link"
      @click="handleAdd"
      icon="plus-circle"
    />
  </div>
</template>

<script>
export default {
  // 双向绑定
  model: {
    event: "changeValue",
    prop: "value"
  },
  props: {
    // 组件传递的值
    value: {
      type: Number,
      default: 0
    },
    // 单位  带宽-M 数据盘-G
    company: {
      type: String,
      default: "G"
    },
    // 步长
    step: {
      type: Number,
      default: 10
    },
    // 最小值
    min: {
      type: Number,
      default: 40
    },
    // 最大值
    max: {
      type: Number,
      default: 500
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 值修改后的回调，参数是修改后的值
    onChange: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      inputValue: 0
    };
  },
  computed: {
    // 减
    minusDisabled() {
      if (this.disabled) return true;
      if (this.value === this.min) {
        return true;
      } else {
        return false;
      }
    },
    // 加
    plusDisabled() {
      if (this.disabled) return true;
      if (this.value === this.max) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    value: {
      handler() {
        this.inputValue = this.value;
      },
      immediate: true
    }
  },
  methods: {
    // 输入
    handleInput(e) {
      if (e.target.value > this.max) {
        this.inputValue = this.max;
      } else if (e.target.value < this.min) {
        this.inputValue = this.min;
      } else {
        this.inputValue = e.target.value * 1;
      }
      this.$emit("changeValue", this.inputValue);
      this.onChange();
    },
    // 点击增加
    handleAdd() {
      if (this.inputValue + this.step > this.max) {
        this.inputValue = this.max;
      } else {
        this.inputValue += this.step;
      }
      this.$emit("changeValue", this.inputValue);
      this.onChange();
    },
    // 点击减少
    handleReduce() {
      if (this.inputValue - this.step < this.min) {
        this.inputValue = this.min;
      } else {
        this.inputValue -= this.step;
      }
      this.$emit("changeValue", this.inputValue);
      this.onChange();
    }
  }
};
</script>

<style lang="less" scoped>
.number-input-wrap {
  display: flex;
  // margin-left: 20px;
  .left-btn,
  .right-btn {
    font-size: 22px;
  }
  .center {
    width: 70px;
    display: flex;
    align-items: center;
    height: 36px;
    overflow: hidden;
    color: #000;
    position: relative;
    padding-right: 5px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    margin-top: 1px;
    .input {
      width: 70px;
      border: none;
      &:hover,
      &:focus {
        border: none;
        box-shadow: none;
      }
    }
    .company {
      padding-left: 3px;
      padding-right: 3px;
      position: absolute;
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
      background: #fff;
      margin-top: 1px;
    }
    .company-bg {
      background: #f5f5f5;
    }
  }
}
</style>
