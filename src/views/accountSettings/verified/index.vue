<template>
  <div>
    <h2 class="verified-title">实名认证</h2>
    <div class="verified-top-nav">
      <span :class="{ chooseClick: choose == 1 }">①填写认证资料</span>
      <span :class="{ chooseClick: choose == 2 }">②确认认证信息</span>
      <span :class="{ chooseClick: choose == 3 }">③实名认证信息</span>
    </div>
    <div v-if="choose == 1">
      <p class="phone-hint">
        您选择了“手机号码认证方式”进行实名认证，请填写一下信息：
      </p>
      <a-form-model
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="手机号码">
          <a-input v-model="form.name" />
          请确认该手机号码是您本人所有，否则无法验证通过
        </a-form-model-item>
        <a-form-model-item label="真实姓名">
          <a-input v-model="form.name" />
          请填写您本人的真实姓名，否则无法验证通过
        </a-form-model-item>
        <a-form-model-item label="身份证号码">
          <a-input v-model="form.name" />
          请填写您本人的真实身份证号码，否则无法验证通过
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
          <a-button type="primary" @click="choose = 2"> 下一步 </a-button>
          <a-button style="margin-left: 10px"> 返回上一步 </a-button>
        </a-form-model-item>
      </a-form-model>
      <div class="Warm-Tips">
        <h3>温馨提示：</h3>
        <p class="Warm-Tips-first-p">
          1，每一个账号最多有5次认证机会（手机号通过按每次5.00元认证手续费，认证费用用于支付三大运营商以银联实名认证接口费用），次数用尽则该账号无法继续认证
        </p>
        <p>
          2，请确保姓名、身份证号码完全正确，请勿使用他人身份信息进行认证，否则会认证失败
        </p>
        <p>3，请勿使用虚假信息认证，否则浙江云盾有权注销您的实名认证申请</p>
        <p>4，浙江云盾会加密保存您的认证资料，绝不会泄露用户隐私，请放心认证</p>
        <p>
          5，所填写资料仅用于实名认证，不会开通其他任何附加服务，浙江云盾工作人员不会向您索要短信验证码，谨防上当
        </p>
        <p>
          6，注册手机号必须属本人所有，请勿使用他人手机进行注册，否则认证会失败，如果非本人手机号码，请先修改手机号再进行实名认证
        </p>
      </div>
    </div>
    <div v-if="choose == 2">
      <div class="alert-warn">
        <span
          >如果手机号码不为182******12，或者身份证号码错误，浙江云盾将取消您的实名认证，请仔细核对后提交！</span
        >
      </div>
      <a-form-model
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="手机号码">
          <span></span>
        </a-form-model-item>
        <a-form-model-item label="真实姓名">
          <span></span>
        </a-form-model-item>
        <a-form-model-item label="身份证号码">
          <span></span>
        </a-form-model-item>
        <a-form-model-item label="" :wrapper-col="{ span: 14, offset: 4 }">
          <a-checkbox-group v-model="form.type">
            <a-checkbox value="1" name="type">确认如上信息属实</a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="choose = 1" :disabled="Review">
            提交审核
          </a-button>
          <a-button style="margin-left: 10px" @click="choose = 1">
            上一步
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div v-if="choose == 3" class="verified-info">
      <img class="user-img" src="@/assets/img/auth_icon_success.png" alt="" />
      <div class="verified-info-word">
        <h3>恭喜您已通过浙江云盾实名认证！</h3>
        <p>
          <span class="verified-info-key">认证途径：</span>
          <span>浙江云盾认证</span>
        </p>
        <p>
          <span class="verified-info-key">真实姓名：</span>
          <span>*勇</span>
        </p>
        <p>
          <span class="verified-info-key">认证时间：</span>
          <span>2021-06-12 15:55:51</span>
        </p>
        <p>
          <span class="verified-info-key">证件号码：</span>
          <span>610431*******3016</span>
        </p>
        <p>
          <span class="verified-info-key">认证版本：</span>
          <span><img src="@/assets/img/auth_level_2.png" alt="" /></span>
        </p>
        <p class="verified-info-key">
          如果您的认证信息发生变更，可
          <a href="/#/user/setting/changerealname">修改认证资料 ></a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      choose: 1,
      Review: true,
      labelCol: { span: 4 },
      wrapperCol: { span: 8 },
      form: {
        name: "",
        phone: "",
        newPassword: "",
        newTwoPassword: "",
        code: "",
      },
    };
  },
};
</script>

<style lang="less" scoped>
.verified-title {
  margin-bottom: 20px;
  height: 40px;
  line-height: 40px;
  font-size: 22px;
  color: #272829;
}
.alert-warn {
  padding: 7px 22px 5px 37px;
  background: #fff3eb url(../../../assets/img/pay/ExclamationMark.png) no-repeat
    10px 8px;
  min-height: 32px;
  border: 1px solid #ffdac2;
  border-radius: 2px;
  color: #f60;
  font-size: 12px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.verified-top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  span {
    display: block;
    width: 33%;
    text-align: center;
    height: 50px;
    line-height: 50px;
    background-color: #f2f2f2;
    color: #000;
  }
  .chooseClick {
    background-color: #00aaff;
    color: #fff;
  }
}
.phone-hint {
  color: #a8adbd;
  margin-bottom: 20px;
}
.Warm-Tips{
  margin-top: 70px;
  h3{
    font-weight: 600;
    color: #FF6600;
    margin-bottom: 0;
    width: 100px;
    text-align: center;
    padding-bottom: 10px;
    border-bottom: 2px solid #FF6600;
    position: relative;
    z-index: 1;
  }
  .Warm-Tips-first-p{
    position: relative;
    z-index: 0;
    margin-top: -1px;
    padding-top: 20px;
    border-top: 1px solid #EFEFEF;
  }
  p{
    color: #788084;
  }
}
.verified-info {
  display: flex;
  width: 100%;
  border: 1px solid #eee;
  padding-bottom: 50px;
  align-items: center;
  justify-content: center;
  .user-img {
    width: 129px;
    height: 120px;
  }
  .verified-info-word {
    padding: 40px 330px 0 60px;
    font-size: 12px;
    color: #666;
    h3 {
      margin-bottom: 30px;
      font-weight: bold;
      font-size: 22px;
      color: #262829;
    }
    .verified-info-key {
      color: #a0a2a3;
    }
    p:last-child {
      margin-top: 35px;
    }
  }
}
</style>
