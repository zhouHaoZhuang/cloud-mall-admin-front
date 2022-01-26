<template>
  <a-button type="primary" :loading="loading" @click="handleRecharge">
    充值
  </a-button>
</template>

<script>
import { openAlipayPay, getRechargeAliPayCallBack } from "@/utils/index";
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
      if (this.form.totalAmount === "") {
        this.$message.warning("请输入充值金额");
        return;
      }
      this.loading = true;
      this.$store
        .dispatch("finance/recharge", {
          ...this.form,
          totalAmount: this.form.totalAmount * 1,
          balanceAmount: this.form.totalAmount * 1,
          returnUrl: getRechargeAliPayCallBack(), // 页面重定向地址
          requestFromUrl: getRechargeAliPayCallBack() // 用户取消支付会回退改地址
        })
        .then((res) => {
          // 打开支付宝支付
          openAlipayPay(res.data.aliPayResult);
          this.$emit("success");
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped></style>
