<template>
  <div class="right-container">
    <icon-font type="iconwuliuguanli" style="font-size: 30px"></icon-font>
    <!-- 帮助文档 -->
    <Help />
    <!-- 站内信 -->
    <Message />
    <!-- 费用 -->
    <Price />
    <!-- 工单 -->
    <WorkOrder />
    <!-- 用户 -->
    <User />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Help from "./help";
import Message from "./message";
import Price from "./price";
import WorkOrder from "./workOrder";
import User from "./user";
export default {
  components: {
    Help,
    Message,
    Price,
    WorkOrder,
    User
  },
  computed: {
    ...mapState({
      menuOpen: (state) => state.setting.menuOpen
    })
  },
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.right-container {
  display: flex;
}
</style>
