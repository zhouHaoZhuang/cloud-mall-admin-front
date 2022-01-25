<template>
  <div class="help-container"><a-icon type="question-circle" /> 帮助文档</div>
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
.help-container {
  padding: 0 20px;
}
</style>
