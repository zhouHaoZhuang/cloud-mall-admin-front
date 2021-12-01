<template>
  <div
    class="left-menu-container"
    :style="`width:${leftOpen ? '160' : '0'}px;left:${
      menuOpen ? '168' : '64'
    }px`"
  >
    <div v-if="leftOpen" class="wrap">
      <div class="top-title">
        {{ leftMenuData.name }}
      </div>
    </div>
    <!-- 修改主题左侧菜单的折叠/打开 -->
    <OpenLeftMenu />
  </div>
</template>

<script>
import { mapState } from "vuex";
import OpenLeftMenu from "@/components/layoutMenu/openLeftMenu";
export default {
  components: {
    OpenLeftMenu
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      menuOpen: (state) => state.setting.menuOpen,
      leftOpen: (state) => state.setting.leftOpen,
      leftMenuData: (state) => state.setting.leftMenuData
    })
  },
  data() {
    return {};
  },
  created() {
    console.log(this.leftMenuData);
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.left-menu-container {
  height: 100%;
  position: fixed;
  top: 56px;
  background: #f0f3f5;
  border-right: 1px solid #e1e4e6;
  transition: all 0.3s;
  .top-title {
    border-bottom: 1px solid #e1e4e6;
    height: 40px;
    width: 160px;
    line-height: 40px;
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    color: #a0a2a3;
  }
}
</style>
