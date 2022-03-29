<template>
  <div class="work-container" @click="$router.push('/user/workOrder/submit')">
  
    <img src="@/assets/img/menu/bill.png" class="img" width="18" height="20">
   工单
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      menuOpen: (state) => state.setting.menuOpen
    })
  },
  data() {
    return {};
  },
  created() {},
  methods: {

  }
};
</script>

<style lang="less" scoped>
.work-container {
  padding: 0 20px;
  cursor: pointer;
}
.img{
  margin-right: 6px;
}
</style>
