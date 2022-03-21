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
        <a-tab-pane :key="3" tab="缓存配置"> </a-tab-pane>
        <a-tab-pane :key="4" tab="HTTPS配置"> </a-tab-pane>
        <a-tab-pane :key="5" tab="访问控制"> </a-tab-pane>
        <a-tab-pane :key="6" tab="性能优化"> </a-tab-pane>
        <a-tab-pane :key="7" tab="视频相关"> </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import DetailHeader from "@/components/Common/detailHeader";
import Basic from "@/components/Cdn/domain/manage/basic/index";
import BackSource from "@/components/Cdn/domain/manage/backSource/index";
export default {
  components: { DetailHeader, Basic, BackSource },
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
