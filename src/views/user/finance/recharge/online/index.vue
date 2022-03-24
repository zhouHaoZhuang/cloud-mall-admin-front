<template>
  <div class="online">
    <div v-if="allConfig.online_pay == '1'">
      <div class="warn">
        <p>1、充值最小金额{{ allConfig.min_recharge }}元</p>
        <p>
          2、支付过程中浏览器会有几次跳转，支付完成之前请勿关闭浏览器，否则可能造成支付失败
        </p>
        <p>3、如充值后款项没有到账，请联系在线客服帮助处理，或提交工单</p>
      </div>
      <h1>
        <span>账户余额：</span><span>{{ balanceData.userAmount }} 元</span>
      </h1>
      <!-- <p>暂未开启充值</p> -->
      <div>
        <span> 充值金额： </span>
        <a-input-number
          style="width: 180px"
          v-number-evolution="{
            min: allConfig.min_recharge,
            max: 9999999,
            value: 2
          }"
          v-model="rechargeBtnForm.totalAmount"
        />
      </div>
      <div class="paymentMethod">
        <span class="paymentMethod-type">支付方式：</span>
        <!-- <div :class="{WeChatply:true,Alipay:}">
          <img width="30px" src="@/assets/img/pay/WeChat.png" />
          <span>微信支付</span>
        </div>
        <div class="WeChatply Alipay">
          <img width="40px" src="@/assets/img/pay/Alipay.png" />
          <span>支付宝支付</span>
        </div> -->
        <a-radio-group v-model="payType" @change="onChange">
          <a-radio value="ali" v-show="allConfig.alipay_switch === '1'">
            <span>支付宝</span>
            <img
              style="margin-left: 5px"
              width="30px"
              src="@/assets/img/pay/Alipay.png"
            />
          </a-radio>
          <a-radio value="wechat" v-show="allConfig.wxpay_switch === '1'">
            <span>微信</span>
            <img
              style="margin-left: 5px"
              width="20px"
              src="@/assets/img/pay/WeChat.png"
            />
          </a-radio>
        </a-radio-group>
      </div>
      <RechargeBtn
        v-show="
          allConfig.alipay_switch === '1' || allConfig.wxpay_switch === '1'
        "
        class="rechargeBtn"
        :form="rechargeBtnForm"
        :userAmount="balanceData.userAmount"
        @success="startTime"
      />
    </div>
    <div v-else>
      <p>暂未开启订单在线充值，无法使用在线支付功能</p>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import RechargeBtn from "@/components/Finance/rechargeBtn";
export default {
  components: {
    RechargeBtn
  },
  data() {
    return {
      // 查询余额相关所需参数
      balanceForm: {
        payType: "none",
        totalAmount: 0,
        useAliPay: false,
        useBalance: true,
        useVoucher: false,
        useWechatPay: false
      },
      balanceData: {},
      rechargeBtnForm: {
        totalAmount: "",
        balanceAmount: "",
        payType: ["ali", "balance"]
      },
      time: null,
      payType: "ali"
    };
  },
  created() {
    this.getUserBalance();
  },
  beforeDestroy() {
    this.time && clearInterval(this.time);
  },
  computed: {
    ...mapState({
      allConfig: (state) => state.user.allConfig
    })
  },
  mounted() {
    if (this.allConfig.first_payment === "alipay") {
      this.payType = "ali";
    }
    if (this.allConfig.first_payment === "wxpay") {
      this.payType = "wechat";
    }
    this.rechargeBtnForm.payType = [this.payType, "balance"];
  },
  methods: {
    onChange(e) {
      console.log("radio checked", e.target.value);
      this.rechargeBtnForm.payType = [e.target.value, "balance"];
    },
    // 查询余额
    getUserBalance() {
      this.$store
        .dispatch("finance/getUserBalance", this.balanceForm)
        .then((res) => {
          this.balanceData = { ...res.data };
        });
    },
    // 轮询查询余额
    startTime() {
      this.time && clearInterval(this.time);
      this.getUserBalance();
      this.time = setInterval(() => {
        this.getUserBalance();
      }, 3000);
    }
  }
};
</script>

<style lang="less" scoped>
.online {
  margin-top: 20px;
  .warn {
    padding: 7px 22px 5px 37px;
    background: #fff3eb url(../../../../../assets/img/pay/ExclamationMark.png)
      no-repeat 10px 8px;
    border: 1px solid #ffdac2;
    border-radius: 2px;
    color: #ff660a;
    font-size: 12px;
    > p {
      margin-bottom: 10px;
    }
    > p:last-child {
      margin-bottom: 0;
    }
  }
  > p {
    font-size: 12px;
  }
  .paymentMethod {
    display: flex;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;
  }
  .paymentMethod-type {
    display: inline-block;
    margin-right: 5px;
    line-height: 36px;
  }
  .WeChatply {
    border: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    border-radius: 3px;
    margin-right: 10px;
    padding: 2px;
  }
  .Alipay {
    border-color: #0af;
  }
}
h1 {
  margin: 20px 0 30px 0;
  > span {
    display: inline-block;
  }
  > span:first-child {
    width: 135px;
    height: 30px;
    text-align: right;
    font-size: 18px;
    padding-right: 10px;
  }
  > span:last-child {
    width: 500px;
    height: 30px;
    line-height: 30px;
    text-align: left;
    font-weight: bold;
    font-size: 25px;
    color: #ff6600;
  }
}
.rechargeBtn {
  margin-left: 75px;
}
</style>
