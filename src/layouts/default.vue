<template>
  <div class="layout-container">
    <!-- 左侧菜单 -->
    <div class="side-menu" :style="`width:${menuOpen ? '168' : '64'}px`">
      <div class="logo-wrap" @click="handleJumpCloud">
        <img v-if="menuOpen" :src="userCenterLogo" alt="" class="img img1" />
        <img v-else :src="userCenterMiniLogo" alt="" class="img img2" />
        {{ companyInfo.companyName }}
      </div>
      <SideMenu />
    </div>
    <!-- 右侧主体 -->
    <div class="layout-wrap" :style="`padding-left:${getLayoutPadding}px`">
      <!-- 头部 -->
      <Header />
      <!-- 右侧主体部分 -->
      <div class="layout-content">
        <!-- 主体左侧菜单 -->
        <LeftMenu />
        <!-- 具体内容展示区域 -->
        <div class="layout-box">
          <Content />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SideMenu from "@/components/layoutMenu/sideMenu";
import LeftMenu from "@/components/layoutMenu/leftMenu";
import Header from "@/layouts/header";
import Content from "@/layouts/content";
import { jumpCloudMall } from "@/utils/index";
import route from "@/router/config";
export default {
  components: {
    SideMenu,
    LeftMenu,
    Header,
    Content
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      menuOpen: (state) => state.setting.menuOpen,
      leftOpen: (state) => state.setting.leftOpen,
      webInfo: (state) => state.dashboard.webInfo,
      companyInfo: (state) => state.dashboard.companyInfo,
      userCenterLogo: (state) => state.dashboard.webInfo.userCenterLogo,
      userCenterMiniLogo: (state) => state.dashboard.webInfo.userCenterMiniLogo
    }),
    getLayoutPadding() {
      if (!this.menuOpen && !this.leftOpen) {
        // 两个都关闭
        return 64;
      } else if (this.menuOpen && !this.leftOpen) {
        // 最左打开，左关闭
        return 168;
      } else if (!this.menuOpen && this.leftOpen) {
        // 最左关闭，左打开
        return 224;
      } else {
        // 两个都打开
        return 328;
      }
    }
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    // 跳转云商城首页
    handleJumpCloud() {
      jumpCloudMall("/", true);
    }
  }
};
</script>

<style lang="less" scoped>
.layout-container {
  width: 100%;
  min-width: 1200px;
  height: 100%;
  display: flex;
  .side-menu {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    transition: width 0.3s;
    z-index: 999;
    .logo-wrap {
      width: 100%;
      height: 56px;
      // background-color: @primary-color;
      // background: url("../assets/img/menu/new_logo.png") no-repeat center;
      background-color: #3B77E3;
      text-indent: -99999px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      .img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .layout-wrap {
    flex: 1;
    height: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    padding-top: 56px;
    transition: all 0.3s;
    .layout-content {
      display: flex;
      height: 100%;
      position: relative;
      .layout-box {
        flex: 1;
        height: 100%;
        background: #F5F7FD;
        padding: 20px;
      }
    }
  }
  .layout-padding1 {
    padding-left: 224px !important;
  }
  .layout-padding2 {
    padding-left: 64px !important;
  }
}
</style>
