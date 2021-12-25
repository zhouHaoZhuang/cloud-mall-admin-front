<template>
  <div class="online">
    <div class="warn">
      <p>1、充值最小金额1.00元，充值金额必须为整数</p>
      <p>
        2、支付过程中浏览器会有几次跳转，支付完成之前请勿关闭浏览器，否则可能造成支付失败
      </p>
      <p>3、如充值后款项没有到账，请联系在线客服帮助处理，或提交工单</p>
    </div>
    <h1><span>账户余额：</span><span>{{Amount}} 元</span></h1>
    <!-- <p>暂未开启充值</p> -->
    <div>
      <span>
        充值金额：
      </span>
      <a-input style="width:180px"
               v-model="totalAmount"
               placeholder="请输入充值金额" />
    </div>
    <div class="paymentMethod">
      <span class="paymentMethod-type">支付方式：</span>
      <div class="WeChatply "><img width="30px"
             src="@/assets/img/pay/WeChat.png" />
        <span>微信支付</span>
      </div>
      <div class="WeChatply Alipay"><img width="40px"
             src="@/assets/img/pay/Alipay.png"
             alt=""><span>支付宝支付</span></div>
    </div>
    <a-button type="primary"
              style="margin-top: 20px;"
              @click="pay">
      充值</a-button>
  </div>
</template>
<script>
export default {
  data () {
    return {
      //
      payType: ['ali'],
      totalAmount: '',
      Amount: '',
    };
  },
  created () {
    this.getBalance();
  },
  methods: {
    pay () {
      this.$store.dispatch('pay/getVal', {
        payType: this.payType,
        totalAmount: this.totalAmount,
      }).then(res => {
        console.log(res);
        this.$message.success('充值成功');
      });
    },
    getBalance () {
      this.$getList("pay/getList").then(res => {
        console.log(res, 'gshasgah');
        this.Amount = res.data.balance;
      });
    },
  }

};
</script>

<style lang="less" scoped>
.online {
  margin-top: 20px;
  .warn {
    padding: 7px 22px 5px 37px;
    background: #fff3eb url(../../../../assets/img/pay/ExclamationMark.png)
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
  > h1 {
    margin: 20px 0 30px 0;
    > span {
      display: inline-block;
    }
    > span:first-child {
      width: 135px;
      height: 30px;
      text-align: right;
      font-size: 12px;
      padding-right: 10px;
    }
    > span:last-child {
      width: 100px;
      height: 30px;
      line-height: 30px;
      text-align: left;
      font-weight: bold;
      font-size: 16px;
      color: #ff6600;
    }
  }
  > p {
    font-size: 12px;
  }
  .paymentMethod {
    display: flex;
    margin-top: 10px;
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
</style>
