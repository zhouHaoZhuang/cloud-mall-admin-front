<template>
  <div class="cdn-consumption-container">
    <a-tabs v-model="tabsKey">
      <a-tab-pane :key="1" tab="用量查询">
        <UsageQuery :tabsKey="tabsKey" />
      </a-tab-pane>
      <a-tab-pane :key="2" tab="用量汇总">
        <Summary :tabsKey="tabsKey" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import UsageQuery from "@/components/Cdn/consumption/usageQuery";
import Summary from "@/components/Cdn/consumption/summary";
export default {
  components: { UsageQuery, Summary },
  computed: {},
  data() {
    return {
      tabsKey: 1
    };
  },
  created() {
    if(this.$route?.params?.tabsKey){
      this.tabsKey = this.$route.params.tabsKey;
    }
  },
  methods: {

  }
};
</script>

<style lang="less" scoped>
.cdn-consumption-container {
  width: 100%;
}
</style>
