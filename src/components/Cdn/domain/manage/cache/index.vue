<template>
  <div class="cdn-source-container">
    <a-tabs v-model="tabCurrent" type="card">
      <a-tab-pane :key="1" tab="缓存过期时间">
        <CacheOverdue />
      </a-tab-pane>
      <a-tab-pane :key="2" tab="状态码过期时间">
        <StatusOverdue />
      </a-tab-pane>
      <a-tab-pane :key="3" tab="HTTP头">
        <HttpHead />
      </a-tab-pane>
      <a-tab-pane :key="4" tab="自定义页面">
        <Custom />
      </a-tab-pane>
      <a-tab-pane :key="5" tab="重写">
        <Rewrite />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import CacheOverdue from "@/components/Cdn/domain/manage/cache/cacheOverdue";
import StatusOverdue from "@/components/Cdn/domain/manage/cache/statusOverdue";
import HttpHead from "@/components/Cdn/domain/manage/cache/httpHead";
import Custom from "@/components/Cdn/domain/manage/cache/custom";
import Rewrite from "@/components/Cdn/domain/manage/cache/rewrite";
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
  components: { CacheOverdue, StatusOverdue, HttpHead, Custom, Rewrite },
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
