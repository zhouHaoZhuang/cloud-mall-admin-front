<template>
  <div class="online">
    <div class="warn">
      <p>1、充值最小金额1.00元，充值金额必须为整数</p>
      <p>
        2、支付过程中浏览器会有几次跳转，支付完成之前请勿关闭浏览器，否则可能造成支付失败
      </p>
      <p>3、如充值后款项没有到账，请联系在线客服帮助处理，或提交工单</p>
    </div>
    <h1><span>账户余额：</span><span>184.00 元</span></h1>
    <p>暂未开启充值</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //
    };
  }
};
</script>

<style lang="less" scoped>
.online {
  margin-top: 20px;
  > .warn {
    padding: 7px 22px 5px 37px;
    background: rgb(255 243 235)
      url(https://www.ydidc.com/template/User/Zkeys/PC/Static/css/common/common/img/uc/tip_icon_warn_16.png)
      no-repeat 10px 8px;
    border: 1px solid rgb(255 218 194);
    border-radius: 2px;
    color: rgb(255 102 0);
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
      color: rgb(255 102 0);
    }
  }
  >p{
    font-size: 12px;
  }
}
</style>
