<template>
  <div class="work-container"><a-icon type="profile" /> 工单</div>
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
  methods: {}
};
</script>

<style lang="less" scoped>
.work-container {
  padding: 0 20px;
}
</style>
