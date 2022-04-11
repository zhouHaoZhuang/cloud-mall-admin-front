<template>
  <div class="message-container">
    <img src="@/assets/img/menu/customer-phone.png" class="img" width="22" />
    专属客服

    <div class="outbox">
      <h1 style="font-weight: 600; font-size: 18px">专属客服</h1>
      <img width="140px" class="imgclass" :src="customerInfo.wechatUrl" />
      <ul class="right-box">
        <li><a-icon type="user" class="left-icon" />客服姓名:</li>
        <li><a-icon type="phone" :rotate="90" class="left-icon" />联系方式:</li>
        <li><a-icon type="qq" class="left-icon" />qq号:</li>
        <li><a-icon type="wechat" class="left-icon" />微信号:</li>
      </ul>
      <ul class="right-box">
        <li>{{ customerInfo.name }}</li>
        <li>{{ customerInfo.phone }}</li>
        <li>{{ customerInfo.qq }}</li>
        <li>{{ customerInfo.wechat }}</li>
      </ul>
      <span class="bottom-title">客服微信二维码</span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      menuOpen: (state) => state.setting.menuOpen,
      customerInfo: (state) => state.dashboard.customerInfo,
    }),
  },

  data() {
    return {};
  },
  created() {},
  methods: {
    //获取专属客服二维码信息
    getCustomerInfo() {
      this.$store.dispatch("dashboard/getCustomerInfo").then((res) => {
        console.log(res, "客服信息");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.message-container {
  margin-top: 6px;
  position: relative;
  .outbox {
    width: 440px;
    height: 260px;
    background-color: #ffffff;
    position: absolute;
    left: -340px;
    top: 38px;
    padding: 20px 0 0 30px;
    display: none;
    box-shadow: 0px 0px 12px 4px rgba(59, 119, 227, 0.1);
    .imgclass {
      display: inline-block;
      float: left;
      width: 140px;
      height: 140px;
    }
    .right-box {
      margin-top: -10px;
      float: left;
      list-style: none;
      line-height: 40px;
      font-size: 12px;
      color: #000000;
      .left-icon {
        margin-right: 6px;
      }
    }
    .bottom-title {
      position: absolute;
      bottom: 30px;
      left: 60px;
      font-size: 12px;
      color: #000000;
    }
  }
  .img {
    cursor: pointer;
  }
  .img:hover + .outbox {
    display: block !important;
  }
}
</style>
