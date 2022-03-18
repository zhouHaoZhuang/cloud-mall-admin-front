<template>
  <div>
    <a-button type="primary" :loading="loading" @click="handleRecharge">
      充值
    </a-button>
    <a-modal
      title="请扫描下方二维码完成支付"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      forceRender
    >
      <div class="qrcodeDom">
        <div id="qrcodeDom"></div>
        <p>请使用<span>微信</span>扫码完成支付</p>
      </div>
    </a-modal>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
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
      loading: false,
      textUrl: "",
      visible: false,
      confirmLoading: false
    };
  },
  methods: {
    //链接生成二维码 Api
    transQrcode() {
      const qrcode = new QRCode("qrcodeDom", {
        width: 160,
        height: 160,
        text: `${this.textUrl}`
      });
    },
    //点击开始进行转化
    getQrcode() {
      document.getElementById("qrcodeDom").innerHTML = ""; //先清空之前生成的二维码
      this.$nextTick(() => {
        this.transQrcode();
      });
    },
    handleOk(e) {
      this.visible = false;
      this.confirmLoading = false;
    },
    handleCancel(e) {
      console.log("Clicked cancel button");
      this.visible = false;
    },
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
          if (form.payType[0] === "ali") {
            openAlipayPay(res.data.aliPayResult);
          }
          if (form.payType[0] === "wechat") {
            this.visible = true;
            this.textUrl = res.data.wechatCode.code_url;
            this.getQrcode();
          }
          this.$emit("success");
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.qrcodeDom {
  width: 100%;
  text-align: center;
  #qrcodeDom {
    width: 160px;
    margin: 20px auto;
  }
  p {
    font-size: 16px;
    span {
      color: #ff0000;
      font-weight: 500;
    }
  }
}
</style>
