<template>
  <div class="cdn-source-container">
    <Configure :tabsKey="tabsKey" />
  </div>
</template>

<script>
import Configure from "@/components/Cdn/domain/manage/accessControl/configure";
export default {
  props: {
    tabsKey: {
      type: Number,
      default: 1
    }
  },
  components: { Configure },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
// .cdn-source-container {
// }
</style>
