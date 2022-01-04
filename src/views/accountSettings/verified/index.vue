<template>
  <div>
    <h2 class="verified-title">实名认证</h2>
    <div class="verified-info">
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
          如果您的认证信息发生变更，可 <a href="/#/user/setting/changerealname">修改认证资料 ></a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.verified-title {
  margin-bottom: 20px;
  height: 40px;
  line-height: 40px;
  font-size: 22px;
  color: #272829;
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
