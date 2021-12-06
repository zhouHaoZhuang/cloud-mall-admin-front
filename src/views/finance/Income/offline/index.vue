<template>
  <div class="offline">
    <div>
      <p>
        温馨提示：建议您首先采用微信、支付宝、银行卡
        <a @click="change('online')">在线充值</a>
        ，金额可实时到账；线下汇款受银行系统影响，到账时间可能会存在延迟。
      </p>
    </div>
    <div>
      <a-steps v-model="current" direction="vertical">
        <a-step>
          <div slot="title" class="stepInfo">
            <p>汇款至浙江云盾银行账户</p>
            <p>线下汇款直接向浙江云盾的账户汇款，汇款账号如下：</p>
          </div>
          <div slot="description">
            <div>表格</div>
          </div>
        </a-step>

        <a-step>
          <div slot="title" class="stepInfo">
            <p>充值结果反馈</p>
            <p>
              汇款成功后请详细填写与您汇款账号关联的汇款凭据，我司将会核实您的汇款信息；到账时间取决于您的银行系统，请您耐心等待。
            </p>
          </div>
          <div slot="description">
            <div>表单</div>
            <button>提交汇款记录</button>
          </div>
        </a-step>
        <a-step>
          <p slot="title">充值成功</p>
        </a-step>
      </a-steps>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: 0
    };
  },
  props: ["change"],
  methods: {
    onChange(current) {
      console.log("onChange:", current);
      this.current = current;
    }
  }
};
</script>

<style lang="less" scoped>
.offline {
  > div:nth-child(1) {
    > p {
      color: rgb(255 102 0);
      font-size: 12px;
      height: 32px;
      background: rgb(255 243 235)
        url(https://www.ydidc.com/template/User/Zkeys/PC/Static/css/common/common/img/uc/tip_icon_warn_16.png)
        no-repeat 10px 8px;
      line-height: 32px;
      padding: 0px 22px 5px 37px;
      margin: 0;
      border: 1px solid rgb(255 218 194);
      border-radius: 2px;
    }
  }
  > div:nth-child(2) {
    margin-top: 30px;
    margin-left: 20px;
    .stepInfo {
      > p:nth-child(1) {
        height: 32px;
        line-height: 32px;
        font-size: 16px;
        color: rgb(38 40 41);
      }
      > p:nth-child(2) {
        margin-top: 10px;
        font-size: 12px;
      }
    }
  }
}
</style>
