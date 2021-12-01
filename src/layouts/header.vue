<template>
  <div class="header-container" :style="`left:${menuOpen ? '168' : '64'}px`">
    <!-- 折叠左侧菜单 -->
    <OpenMenu />
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
  methods: {}
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
}
</style>
