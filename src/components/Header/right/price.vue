<template>
  <div class="price-container"><a-icon type="pay-circle" /> 费用</div>
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
.price-container {
  padding: 0 20px;
}
</style>
