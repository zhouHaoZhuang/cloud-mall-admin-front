<template>
  <div class="cdn-source-container">
    <Configure />
  </div>
</template>

<script>
import Configure from "@/components/Cdn/domain/manage/performance/configure";
export default {
  props: {
    tabsKey: {
      type: Number,
      default: 1
    },
    domain: {
      type: String,
      default: ""
    }
  },
  components: { Configure },
  watch: {
    tabsKey: {
      handler(newVal) {
        if (newVal === "1") {
          //   this.getData();
        }
      }
    }
  },
  computed: {},
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
