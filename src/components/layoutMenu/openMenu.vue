<template>
  <div class="open-menu-container">
    <a-icon v-if="menuOpen" type="menu-fold" @click="changeMenuOpen" />
    <a-icon v-else type="menu-unfold" @click="changeMenuOpen" />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      menuOpen: (state) => state.setting.menuOpen
    })
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    changeMenuOpen() {
      console.log(!this.menuOpen);
      this.$store.dispatch("setting/changeOpenMenu", this.menuOpen ? false : true);
    }
  }
};
</script>

<style lang="less" scoped>
.open-menu-container {
  border-left: 1px solid #039ce9;
  width: 63px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  cursor: pointer;
}
</style>
