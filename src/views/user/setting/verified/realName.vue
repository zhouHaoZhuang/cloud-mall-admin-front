<template>
  <div class="real-name">
    <h2>实名认证</h2>
    <p>请选择认证方式</p>
    <div class="real-name-img">
      <div @click="$router.push('/user/setting/personalRealname')">
        <img
          width="150px"
          src="@/assets/img/realName/personalRealName.png"
          alt=""
        />
        <p>个人认证</p>
        <a-button
          @click="$router.push('/user/setting/enterprise')"
          class="look-info"
          type="link"
          v-show="userRealInfo.realName"
        >
          查看详情
        </a-button>
      </div>
      <div @click="$router.push('/user/setting/enterprise')">
        <img width="150px" src="@/assets/img/realName/enterprise.png" alt="" />
        <p>企业认证</p>
        <a-button
          @click="$router.push('/user/setting/enterprise')"
          class="look-info"
          type="link"
        >
          查看详情
        </a-button>
      </div>
    </div>
    <div class="bottom-hint">
      <h3>温馨提示</h3>
      <p>1. 用户可以选择进行个人认证和企业认证</p>
      <p>2. 完成个人认证后，可以选择进行企业认证</p>
      <p>3. 完成企业认证后，无需进行个人认证</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      userRealInfo: (state) => state.user.userRealInfo
    })
  }
};
</script>

<style lang="less" scoped>
.real-name {
  h2 {
    font-size: 18px;
    font-weight: 550;
    color: #333;
    margin-bottom: 20px;
  }
  .real-name-img {
    width: 100%;
    div {
      width: 363px;
      height: 184px;
      text-align: center;
      border: #dbdbdb dashed 1px;
      margin: 0 auto 20px;
      border-radius: 5px;
      position: relative;
      .look-info {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
  .bottom-hint {
    h3 {
      text-decoration: underline;
      color: #f59a23;
      margin-bottom: 20px;
    }
    p {
      padding-left: 20px;
    }
  }
}
</style>
