<template>
  <div class="container">
    <a-result status="404" title="登录失效">
      <span slot="subTitle"> {{ timeNum }}{{ notTxt }} </span>
      <template #extra>
        <a-button type="primary" @click="handleNowJump"> 立即跳转 </a-button>
      </template>
    </a-result>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { jumpCloudMall } from "@/utils/index";
export default {
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  data() {
    return {
      notTxt: "秒后自动跳转",
      time: null,
      timeNum: 5
    };
  },
  created() {
    this.startTime();
  },
  beforeDestroy() {
    clearInterval(this.time);
  },
  methods: {
    // 开始倒计时
    startTime() {
      this.time = setInterval(() => {
        if (this.timeNum - 1 === 0) {
          clearInterval(this.time);
          this.timeNum = 5;
          this.autoJumpCloudMall();
          return;
        }
        this.timeNum -= 1;
      }, 1000);
    },
    handleNowJump() {
      clearInterval(this.time);
      this.autoJumpCloudMall();
    },
    // 跳转云商城
    autoJumpCloudMall() {
      jumpCloudMall("/login-pc?out=1");
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
