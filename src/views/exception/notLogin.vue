<template>
  <div class="container">{{ timeNum }}{{ notTxt }}</div>
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
    // 跳转云商城
    autoJumpCloudMall() {
      jumpCloudMall("/login-pc?out=1");
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  color: red;
}
</style>
