<template>
  <a-button type="primary" :loading="loading">充值</a-button>
</template>

<script>
import { openAlipayPay } from "@/utils/index";
export default {
  props: {
    // 充值参数
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    // 充值按钮点击
    handleRecharge() {
      this.loading = true;
      this.$store
        .dispatch("finance/recharge", this.form)
        .then((res) => {
          // 打开支付宝支付
          openAlipayPay(res);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped></style>
