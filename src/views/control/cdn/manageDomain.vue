<template>
  <div class="cdn-manage-container">
    <div class="header">
      <DetailHeader :title="topTitle" />
    </div>
    <div class="container">
      <a-tabs v-model="tabsKey">
        <a-tab-pane :key="1" tab="基本配置">
          <Basic :tabsKey="tabsKey" :domain="domain" />
        </a-tab-pane>
        <a-tab-pane :key="2" tab="回源配置">
          <BackSource :tabsKey="tabsKey" :domain="domain" />
        </a-tab-pane>
        <a-tab-pane :key="3" tab="缓存配置">
          <Cache :tabsKey="tabsKey" :domain="domain" />
        </a-tab-pane>
        <a-tab-pane :key="4" tab="HTTPS配置">
          <Https :tabsKey="tabsKey" :domain="domain" />
        </a-tab-pane>
        <a-tab-pane :key="5" tab="访问控制">
          <AccessControl :tabsKey="tabsKey" :domain="domain" />
        </a-tab-pane>
        <a-tab-pane :key="6" tab="性能优化">
          <Performance :tabsKey="tabsKey" :domain="domain" />
        </a-tab-pane>
        <a-tab-pane :key="7" tab="视频相关">
          <VideoRelevant :tabsKey="tabsKey" :domain="domain" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import DetailHeader from "@/components/Common/detailHeader";
import Basic from "@/components/Cdn/domain/manage/basic/index";
import BackSource from "@/components/Cdn/domain/manage/backSource/index";
import Cache from "@/components/Cdn/domain/manage/cache/index";
import Https from "@/components/Cdn/domain/manage/https/index";
import AccessControl from "@/components/Cdn/domain/manage/accessControl/index";
import Performance from "@/components/Cdn/domain/manage/performance/index";
import VideoRelevant from "@/components/Cdn/domain/manage/videoRelevant/index";
export default {
  components: {
    DetailHeader,
    Basic,
    BackSource,
    Cache,
    Https,
    AccessControl,
    Performance,
    VideoRelevant
  },
  computed: {
    topTitle() {
      return this.$route.query.domain;
    },
    domain() {
      return this.$route.query.domain;
    }
  },
  data() {
    return {
      tabsKey: 1
    };
  },
  created() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.cdn-manage-container {
  .header {
    display: flex;
    font-weight: 500;
    font-size: 22px;
    color: #272829;
  }
  .container {
    padding-top: 20px;
  }
}
</style>
