<template>
  <div class="right-container">
    <!-- 专属客服 -->
    <!-- <icon-font type="iconwuliuguanli" style="font-size: 30px"></icon-font> -->
    <Customer v-if="customerInfo.name != undefined" />
    <!-- 帮助文档 -->
    <!-- <Help /> -->
    <!-- 站内信-->
    <Message v-permissionRoute="'message'" />
    <!-- 费用 -->
    <!-- <Price /> -->
    <!-- 工单 -->
    <WorkOrder v-permissionRoute="'user-workOrder'" />
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
import Customer from "./customer";
export default {
  components: {
    // Help,
    Message,
    // Price,
    WorkOrder,
    User,
    Customer
  },
  computed: {
    ...mapState({
      menuOpen: (state) => state.setting.menuOpen,
      customerInfo: (state) => state.dashboard.customerInfo,
    }),
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.right-container {
  margin-right: 20px;
  display: flex;
  align-items: center;
}
</style>
