<template>
  <div class="cdn-source-container">
    <a-tabs v-model="tabCurrent" type="card">
      <a-tab-pane :key="1" tab="缓存过期时间">
        <CacheOverdue :tabsKey="tabCurrent" />
      </a-tab-pane>
      <a-tab-pane :key="2" tab="状态码过期时间">
        <StatusOverdue :tabsKey="tabCurrent" />
      </a-tab-pane>
      <a-tab-pane :key="3" tab="HTTP头">
        <HttpHead :tabsKey="tabCurrent" />
      </a-tab-pane>
      <a-tab-pane :key="4" tab="自定义页面">
        <Custom :tabsKey="tabCurrent" />
      </a-tab-pane>
      <a-tab-pane :key="5" tab="重写">
        <Rewrite :tabsKey="tabCurrent" />
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
    }
  },
  components: { CacheOverdue, StatusOverdue, HttpHead, Custom, Rewrite },
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
