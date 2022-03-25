<template>
  <div class="cdn-source-container">
    <a-tabs v-model="tabCurrent" type="card">
      <a-tab-pane :key="1" tab="回源配置">
        <Configure :tabsKey="tabsKey" />
      </a-tab-pane>
      <a-tab-pane :key="2" tab="自定义回源HTTP头">
        <Custom :tabsKey="tabCurrent" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Configure from "@/components/Cdn/domain/manage/backSource/configure";
import Custom from "@/components/Cdn/domain/manage/backSource/custom";
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
  components: { Configure, Custom },
  computed: {},
  data() {
    return {
      tabCurrent: 1
    };
  },
  methods: {}
};
</script>

<style lang="less" scoped>
// .cdn-source-container {
// }
</style>
