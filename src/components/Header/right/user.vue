<template>
  <div class="user-container">
    <a-dropdown>
      <span class="ant-dropdown-link" @click="(e) => e.preventDefault()">
        
         <img src="@/assets/img/menu/userinfo.png" class="img" width="18" height="20">
        <!-- <img width="30px" src="@/assets/img/user.png" alt="" /> -->
        <span class="user-name">{{ realName }}</span>
        <a-icon type="down" />
      </span>
      <a-menu slot="overlay">
        <a-menu-item v-permissionRoute="'user-setting-security'">
          <span @click="$router.push('/user/setting/security')">
            安全设置
          </span>
        </a-menu-item>
        <a-menu-item v-permissionRoute="'user-setting-data'">
          <span @click="$router.push('/user/setting/info')"> 基本信息 </span>
        </a-menu-item>
        <a-menu-item v-permissionRoute="'user-setting-auth'">
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
      if (!this.userRealInfo) {
        return "";
      }
      if (this.userRealInfo.typeCode === "common") {
        return this.userRealInfo.realName;
      }
      if (this.userRealInfo.typeCode === "common_admin") {
        return this.userRealInfo.nickName;
      }
      return '未实名认证';
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
  cursor: pointer;
  .user-name {
    margin: 0 10px;
  }
}
</style>
