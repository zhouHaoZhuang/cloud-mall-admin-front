<template>
  <div class="container">回收站</div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.container {
  background: transparent;
  color: red;
}
</style>
