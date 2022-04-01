<template>
  <div class="header-container" :style="`left:${menuOpen ? '168' : '64'}px`">
    <!-- 头部左侧 -->
    <div class="left">
      <!-- 折叠左侧菜单 -->
      <OpenMenu />
      <!-- 跳转总览 -->
      <div v-permissionRoute="'dashboard'" class="dashboard" @click="goTo('/dashboard')">总览</div>
      <!-- 产品与服务 -->
      <!-- <Product /> -->
    </div>
    <!-- 头部右侧 -->
    <Right />
  </div>
</template>

<script>
import { mapState } from "vuex";
import OpenMenu from "@/components/layoutMenu/openMenu";
import Product from "@/components/Header/left/product";
import Right from "@/components/Header/right/index";
export default {
  components: {
    OpenMenu,
    // Product,
    Right
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      menuOpen: (state) => state.setting.menuOpen
    })
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    // 路由跳转
    goTo(path) {
      if (path !== this.$route.path) {
        this.$router.push(path);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.header-container {
  width: 100%;
  min-width: 900px;
  height: 56px;
  color: #3B77E3;
  background-color: #fff;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  transition: left 0.3s;
  display: flex;
  justify-content: space-between;
  padding-right: 168px;
  z-index: 3;
  box-shadow: 0px 2px 6px 0px rgba(59, 119, 227, 0.1);
  .left {
    display: flex;
    .dashboard {
      width: 96px;
      line-height: 55px;
      padding-left: 34px;
      text-indent: 17px;
      background: url("../assets/img/menu/tuanduizonglan.png") no-repeat;
      background-position: 20px center;
      font-size: 16px;
      // padding-right: 24px;
      // border-left: 1px solid #039ce9;
      // border-right: 1px solid #039ce9;
      cursor: pointer;
      &:hover {
        
      background: url("../assets/img/menu/tuanduizonglan-a.png") no-repeat 20px center;
background-color: #0099e5;
        color: #fff;
      }
    }
  }
}
</style>
