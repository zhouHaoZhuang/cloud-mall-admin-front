<template>
  <a-button type="primary">充值</a-button>
</template>

<script>
import { openAlipayPay } from "@/utils/index";
export default {
  props: {},
  data() {
    return {
      loading: false
    };
  },
  methods: {
    // 充值按钮点击
    handleRecharge() {
      this.$store.dispatch("finance/recharge").then((res) => {
        // 打开支付宝支付
        openAlipayPay(res);
      });
    }
    // 查询支付状态
  }
};
</script>

<style lang="less" scoped></style>
