<template>
  <div class="order-container">
    <div class="content">
      <div>
        <div class="ny-panel-title">账单管理</div>
      </div>
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="账单流水">
          <billwater />
        </a-tab-pane>
        <a-tab-pane key="2" tab="月账单" force-render>
          <mouthbill />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import billwater from "./components/billwater.vue";
import mouthbill from "./components/mouthbill.vue";
export default {
  components: { billwater, mouthbill },
  data() {
    return {};
  },
  created() {},
  methods: {
    callback(key) {
      console.log(key);
    }
  }
};
</script>
