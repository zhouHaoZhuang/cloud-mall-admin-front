<template>
  <div class="security-settings-container">
    <h2>安全设置</h2>
    <div class="security-settings-user">
      <div>
        <img src="@/assets/img/user.png" alt="" />
      </div>
      <div>
        <p><span class="user-key">会员ID：</span><span>{{corporationCode}}</span></p>
        <p>
          <span class="user-key">注册日期：</span>
          <span>{{createTime | formatDate}}</span>
        </p>
        <p>
          <span class="user-key">安全级别：</span>
          <a-rate :default-value="2.5" allow-half disabled />
          <span class="Security-level">
            中 建议您启动全部安全设置，以保障账户及资金安全。
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
      <a class="settings-change" href="#/user/setting/changePassword" >修改</a>
    </div>
		<div class="settings-info">
      <img src="@/assets/img/iconphone.png" alt="" />
      <span class="settings-info-type">手机绑定</span>
      <span class="settings-info-desc">
        您的手机：{{phoneNumber}}。绑定认证后可用于手机找回密码、接收手机动态验证码等，保障您的账户安全。
      </span>
      <a-button class="settings-change" type="link">修改</a-button>
    </div>
		<div class="settings-info">
      <img src="@/assets/img/iconemail.png" alt="" />
      <span class="settings-info-type">邮箱绑定</span>
      <span class="settings-info-desc">
        绑定认证后可用于邮箱找回密码、接收订单提醒等，保障您的账户安全。
      </span>
      <a-button class="settings-change settings-start">立即启用</a-button>
    </div>
		<div class="settings-info">
      <img src="@/assets/img/icon-security-undone.png" alt="" />
      <span class="settings-info-type">密保问题</span>
      <span class="settings-info-desc">
        设置密保问题可以进一步提升您的账户安全性。是您找回登录密码的方式之一。
      </span>
      <a-button class="settings-change settings-start" >立即启用</a-button>
    </div>
		<div class="settings-info">
      <img src="@/assets/img/icon-identity-success.png" alt="" />
      <span class="settings-info-type">实名认证</span>
      <span class="settings-info-desc">
       您的实名认证信息：{{realName}}
      </span>
      <a-button class="settings-change" type="link">查看</a-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      corporationCode:'',
      realName:'',
      createTime:'',
      phoneNumber:'',
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.$store.dispatch('user/getUserActualName').then((res) => {
        if(!res.data){
          return
        }
        console.log(res.data)
        this.corporationCode = res.data.corporationCode;
        this.createTime = res.data.createTime;
        this.phoneNumber = res.data.phoneNumber?.slice(0,3)+'****'+res.data.phoneNumber?.slice(8,11);
        if (res.data.realName) {
          this.realName = '*' + res.data.realName.slice(1);
        } else {
          this.realName = '-----';
        }
      });
    },
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
		.settings-change{
			float: right;
			width: 80px;
			height: 80px;
			line-height: 80px;
			text-align: center;
			font-size: 12px;
		}
		.settings-start{
			width: 82px;
			height: 32px;
			line-height: 32px;
			margin-top: 20px;
		}
  }
}
</style>
