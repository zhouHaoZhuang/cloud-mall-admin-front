<template>
  <div class="security-settings-container">
    <h2>安全设置</h2>
    <div class="security-settings-user">
      <div>
        <img src="@/assets/img/user.png" alt="" />
      </div>
      <div>
        <p>
          <span class="user-key">会员ID：</span>
          <span>{{ corporationCode }}</span>
        </p>
        <p>
          <span class="user-key">注册日期：</span>
          <span>{{ createTime | formatDate }}</span>
        </p>
        <p>
          <span class="user-key">安全级别：</span>
          <a-rate v-model="reatNum" allow-half disabled :count="4" />
          <span class="Security-level">
            {{ reatList[reatNum] }}
          </span>
        </p>
      </div>
    </div>
    <div class="settings-info">
      <img src="@/assets/img/iconpassword.png" alt="" />
      <span class="settings-info-type">修改密码</span>
      <span class="settings-info-desc">
        安全性高的密码可以使账户更安全；互联网账号存在被盗风险，建议您定期更换密码
      </span>
      <a-button
        type="link"
        @click="$router.push('/user/setting/changePassword')"
        class="settings-change"
      >
        修改
      </a-button>
    </div>
    <div class="settings-info">
      <img src="@/assets/img/iconphone.png" alt="" />
      <span class="settings-info-type">手机绑定</span>
      <span class="settings-info-desc">
        您的手机：{{
          phoneNumber
        }}。绑定认证后可用于手机找回密码、接收手机动态验证码等，保障您的账户安全。
      </span>
      <a-button class="settings-change" type="link"> 修改 </a-button>
    </div>
    <div class="settings-info">
      <img v-if="email.length > 1" src="@/assets/img/iconemailatv.png" alt="" />
      <img v-else src="@/assets/img/iconemail.png" alt="" />
      <span class="settings-info-type">邮箱绑定</span>
      <span class="settings-info-desc">
        绑定认证后可用于邮箱找回密码、接收订单提醒等，保障您的账户安全。
      </span>
      <a-button
        type="link"
        class="settings-change settings-start"
        v-if="email.length > 1"
      >
        已绑定
      </a-button>
      <a-button
        class="settings-change settings-start"
        @click="emailBinding"
        v-else
      >
        立即启用
      </a-button>
    </div>
    <div class="settings-info" v-show="false">
      <img src="@/assets/img/icon-security-undone.png" alt="" />
      <span class="settings-info-type">密保问题</span>
      <span class="settings-info-desc">
        设置密保问题可以进一步提升您的账户安全性。是您找回登录密码的方式之一。
      </span>
      <a-button class="settings-change settings-start"> 立即启用 </a-button>
    </div>
    <div class="settings-info">
      <img
        v-if="realName.length > 1"
        src="@/assets/img/icon-identity-success.png"
        alt=""
      />
      <img v-else src="@/assets/img/icon-identity.png" alt="" />
      <span class="settings-info-type">实名认证</span>
      <span class="settings-info-desc"> 您的实名认证信息：{{ realName }} </span>
      <a-button class="settings-change" type="link" @click="realNameClick">
        查看
      </a-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      reatList: {
        1: "低，由于您的安全级别目前为低，建议您开启安全防护",
        2: "较低，由于您的安全级别目前为较低，建议您开启安全防护",
        3: "中，由于您的安全级别目前为中，建议您开启剩余安全防护",
        4: "较高，您的安全级别目前较高",
        5: "高，您的安全级别目前为高，暂无其他风险"
      }
    };
  },
  created() {
    this.$store.dispatch("user/getUserInfo");
  },
  computed: {
    ...mapState({
      userRealInfo: (state) => state.user.userRealInfo
    }),
    realName() {
      if (this.userRealInfo && this.userRealInfo.realName) {
        return "*" + this.userRealInfo.realName.slice(1);
      } else {
        return "";
      }
    },
    phoneNumber() {
      if (this.userRealInfo && this.userRealInfo.phoneNumber) {
        return (
          this.userRealInfo.phoneNumber?.slice(0, 3) +
          "****" +
          this.userRealInfo.phoneNumber?.slice(8, 11)
        );
      } else {
        return "未绑定";
      }
    },
    email() {
      if (this.userRealInfo && this.userRealInfo.email) {
        return this.userRealInfo.email;
      } else {
        return "";
      }
    },
    createTime() {
      if (this.userRealInfo && this.userRealInfo.createTime) {
        return this.userRealInfo.createTime;
      } else {
        return "";
      }
    },
    corporationCode() {
      if (this.userRealInfo && this.userRealInfo.corporationCode) {
        return this.userRealInfo.corporationCode;
      } else {
        return "";
      }
    },
    reatNum() {
      let rest = 1;
      if (this.phoneNumber.length == 10) {
        rest++;
      }
      if (this.email.length > 1) {
        rest++;
      }
      if (this.realName.length > 1) {
        rest++;
      }
      return rest;
    }
  },
  methods: {
    realNameClick() {
      // console.log('实名认证');
      this.$router.push("/user/setting/realName");
    },
    emailBinding() {
      // console.log('邮箱绑定');
      this.$router.push({
        path: "/user/setting/emailBinding",
        query: {
          corporationCode: this.corporationCode
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.security-settings-container {
  // padding: 24px 40px;
  h2 {
    color: #272829;
    font-size: 22px;
    height: 40px;
    line-height: 40px;
  }
  .security-settings-user {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;
    background-color: #f7f9fa;
    border: #eee solid 1px;
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin: 20px;
    }
    p {
      margin-left: 20px;
      margin-bottom: 0;
      span {
        color: #272829;
        font-size: 12px;
      }
    }
    .user-key {
      display: inline-block;
      color: #a0a2a3;
      font-size: 12px;
      width: 68px;
    }
    .Security-level {
      margin-left: 20px;
      color: #ff5a00;
      font-size: 12px;
    }
  }
  .settings-info {
    height: 80px;
    width: 100%;
    line-height: 80px;
    border-bottom: 1px dashed #e6e6e6;
    font-size: 12px;
    img {
      width: 24px;
      margin-right: 20px;
    }
    .settings-info-type {
      margin-right: 36px;
    }
    .settings-info-desc {
      color: #999;
    }
    .settings-change {
      float: right;
      width: 80px;
      height: 80px;
      line-height: 80px;
      text-align: center;
      font-size: 12px;
    }
    .settings-start {
      width: 82px;
      height: 32px;
      line-height: 32px;
      margin-top: 20px;
    }
  }
}
</style>
