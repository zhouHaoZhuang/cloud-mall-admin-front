<template>
  <div class="pay-select-container">
    <!-- <div
      class="item-select"
      :style="`border-bottom:${pannelOpen ? '' : 'none'}`"
      @click="handlePanelChange"
    >
      <div class="left">
        <a-checkbox />
        <span class="txt">使用代金券/折扣券/云票/优惠码</span>
      </div>
      <div class="right">
        已抵扣
        <span class="strong">0</span>
        元
      </div>
    </div> -->
    <!-- 选择优惠 -->
    <div :class="pannelOpen ? 'tabs' : 'tabs-height'"></div>
    <!-- 账户余额 -->
    <div class="item-select">
      <div class="left">
        <a-checkbox />
        <span class="txt">账户余额</span>
        <div class="price">
          <span class="price-txt"> 可用余额：7.30元 </span>
          <div class="btn" @click="handleJump">充值</div>
        </div>
      </div>
      <div class="right">
        余额支付
        <span class="strong">7.3</span>
        元
      </div>
    </div>
    <!-- 其他方式支付 -->
    <div class="others">
      <div class="title">其他方式支付</div>
      <a-radio-group v-model="payType" style="margin-left: 24px">
        <a-radio value="ali">
          <div class="box">
            支付宝
            <a-icon class="alipay-icon" type="alipay-circle" />
          </div>
        </a-radio>
      </a-radio-group>
    </div>
    <!-- 服务协议 -->
    <div class="agreement">
      <a-checkbox v-model="agreeFlag" />
      <div class="txt">本人已同意</div>
      <a-button type="link" size="small">《浙江云盾产品服务协议》</a-button>
    </div>
    <!-- 支付按钮 -->
    <div class="pay-btn">
      <div class="txt">
        余额不足，无法支付该订单，请先
        <a-button type="link" size="small" @click="handleJump">充值</a-button>
      </div>
      <a-button class="btn" type="primary" :disabled="!agreeFlag">
        确定支付
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pannelOpen: false,
      agreeFlag: false,
      payType: "ali"
    };
  },
  methods: {
    // 折叠面板点击
    handlePanelChange() {
      this.pannelOpen = !this.pannelOpen;
    },
    // 跳转充值
    handleJump() {
      this.$router.push("/user/finance/recharge");
    }
  }
};
</script>

<style lang="less" scoped>
.pay-select-container {
  font-size: 12px;
  color: #262829;
  padding-bottom: 60px;
  .item-select {
    height: 55px;
    line-height: 55px;
    overflow: hidden;
    padding: 0 20px;
    background-color: #f7f9fa;
    border: 1px solid #ebeced;
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      .txt {
        margin-left: 20px;
      }
      .price {
        margin-left: 70px;
        display: flex;
        align-items: center;
        .btn {
          margin-left: 24px;
          height: 32px;
          line-height: 31px;
          background-color: #fff;
          border: 1px solid #d9d9d9;
          padding: 0 16px;
          font-size: 12px;
          color: #262829;
          cursor: pointer;
          text-align: center;
        }
      }
    }
    .right {
      .strong {
        font-size: 16px;
        font-weight: bold;
        color: #ff6600;
      }
    }
  }
  .tabs {
    height: 100px;
    border-left: 1px solid #ebeced;
    border-right: 1px solid #ebeced;
    padding: 8px 25px 25px;
  }
  .tabs-height {
    height: 0;
  }
  .others {
    border: 1px solid #ebeced;
    padding: 24px 0;
    .title {
      margin-bottom: 20px;
      border-bottom: 1px solid #ebeced;
      padding: 0 24px 20px;
    }
    .box {
      display: inline-block;
      margin-left: 10px;
      width: 240px;
      height: 68px;
      line-height: 68px;
      border: 1px solid #ebeced;
      border-radius: 5px;
      position: relative;
      padding: 0 24px;
      font-size: 14px;
      .alipay-icon {
        font-size: 40px;
        color: #00aaff;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 20px;
      }
    }
  }
  .agreement {
    margin-top: 25px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .txt {
      margin-left: 15px;
    }
  }
  .pay-btn {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 15px;
    .btn {
      margin-left: 10px;
      width: 130px;
    }
  }
}
</style>
