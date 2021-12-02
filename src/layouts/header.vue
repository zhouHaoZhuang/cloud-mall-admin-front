<template>
  <div class="header-container" :style="`left:${menuOpen ? '168' : '64'}px`">
    <!-- 折叠左侧菜单 -->
    <OpenMenu />
    <!-- 跳转总览 -->
    <div class="dashboard" @click="goTo('/dashboard')">总览</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import OpenMenu from "@/components/layoutMenu/openMenu";
export default {
  components: {
    OpenMenu
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
  height: 56px;
  background-color: @primary-color;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  transition: left 0.3s;
  display: flex;
  .dashboard {
    width: 96px;
    line-height: 55px;
    padding-left: 20px;
    text-indent: 17px;
    background: url("../assets/img/menu/header_icon_overview.png") no-repeat;
    background-position: 17px center;
    font-size: 16px;
    padding-right: 24px;
    border-left: 1px solid #039ce9;
    border-right: 1px solid #039ce9;
    cursor: pointer;
    &:hover {
      background-color: #0099e5;
    }
  }
}
</style>
