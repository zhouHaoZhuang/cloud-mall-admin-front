<template>
  <div
    class="open-left-menu-container"
    :style="`right:${leftOpen ? '-5' : '-28'}px`"
  >
    <div v-if="!leftOpen" class="open" @click="changeLeftMenuOpen"></div>
    <div v-else class="off" @click="changeLeftMenuOpen"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      leftOpen: (state) => state.setting.leftOpen
    })
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    changeLeftMenuOpen() {
      this.$store.dispatch(
        "setting/changeLeftOpenMenu",
        this.leftOpen ? false : true
      );
    }
  }
};
</script>

<style lang="less" scoped>
.open-left-menu-container {
  position: absolute;
  top: 50%;
  z-index: 10;
  width: 28px;
  height: 56px;
  margin-top: -28px;
  cursor: pointer;
  transition: left 0.3s;
  .off,
  .open {
    width: 100%;
    height: 100%;
  }
  .open {
    background: url("../../assets/img/menu/menu_handle_expand.png") no-repeat
      left center;
  }
  .open:hover {
    transform: scale(1.1);
    background: url("../../assets/img/menu/menu_handle_expand_hover.png")
      no-repeat left center;
  }
  .off {
    background: url("../../assets/img/menu/menu_handle.png") no-repeat left
      center;
  }
  .off:hover {
    transform: scale(1.1);
    background: url("../../assets/img/menu/menu_handle_hover.png") no-repeat
      left center;
  }
}
</style>
