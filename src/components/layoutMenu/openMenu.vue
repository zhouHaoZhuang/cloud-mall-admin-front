<template>
  <div class="open-menu-container">
    <img  v-if="menuOpen"  @click="changeMenuOpen"  src="@/assets/img/dashboard/shape.png">
    <img  v-else  @click="changeMenuOpen"  src="@/assets/img/dashboard/shape-a.jpg">
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
