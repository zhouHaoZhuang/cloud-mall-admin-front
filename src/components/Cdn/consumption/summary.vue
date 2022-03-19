<template>
  <div class="cdn-summary-container">
    <div class="top-search">
      <div class="left">
        <a-space>
          <a-select
            style="width: 150px"
            allowClear
            v-model="listQuery.a"
            placeholder="请选择"
          >
            <a-select-option value="1"> 中国内地 </a-select-option>
            <a-select-option value="2"> 境外 </a-select-option>
          </a-select>
          <a-select
            style="width: 150px"
            allowClear
            v-model="listQuery.a"
            placeholder="请选择"
          >
            <a-select-option value="1"> 流量 </a-select-option>
            <a-select-option value="2"> HTTPS请求数 </a-select-option>
          </a-select>
          <a-select
            style="width: 150px"
            allowClear
            v-model="listQuery.a"
            placeholder="请选择"
          >
            <a-select-option value="1"> 全部域名 </a-select-option>
          </a-select>
        </a-space>
      </div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listQuery: {
        a: "1",
        b: "1",
        c: "1"
      }
    };
  },
  created() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.cdn-summary-container {
}
</style>
