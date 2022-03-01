<template>
  <div class="user-container">
    <a-dropdown>
      <span class="ant-dropdown-link" @click="(e) => e.preventDefault()">
        <img width="30px" src="@/assets/img/user.png" alt="" />
        <span class="user-name">{{ realName }}</span>
        <a-icon type="down" />
      </span>
      <a-menu slot="overlay">
        <a-menu-item>
          <span @click="$router.push('/user/setting/security')">
            安全设置
          </span>
        </a-menu-item>
        <a-menu-item>
          <span @click="$router.push('/user/setting/info')"> 基本信息 </span>
        </a-menu-item>
        <a-menu-item>
          <span @click="$router.push('/user/setting/realname')">
            实名认证
          </span>
        </a-menu-item>
        <!-- <a-menu-item>
          <a href="javascript:;">常用地址管理</a>
        </a-menu-item> -->
        <a-menu-divider />
        <a-menu-item @click="handleLoginOut">
          <a href="javascript:;">安全退出</a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { jumpCloudMall } from "@/utils/index";
export default {
  computed: {
    ...mapState({
      menuOpen: (state) => state.setting.menuOpen,
      userRealInfo: (state) => state.user.userRealInfo
    }),
    realName() {
      if (this.userRealInfo && this.userRealInfo.realName) {
        return "*" + this.userRealInfo.realName.slice(1);
      } else {
        return "未实名认证";
      }
    }
  },
  methods: {
    // 退出
    handleLoginOut() {
      this.$store.dispatch("user/logout").then((res) => {
        jumpCloudMall("/login?out=1");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.user-container {
  padding: 0 20px;
  .user-name {
    margin: 0 10px;
  }
}
</style>
