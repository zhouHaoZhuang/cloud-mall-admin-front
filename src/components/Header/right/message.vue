<template>
  <div class="message-container">
    <a-popover>
      <template slot="content">
        <div>
          <span>您暂时没有站内消息</span>
          <a-button type="link" @click="$router.push('/message')">
            查看更多&gt;
          </a-button>
        </div>
      </template>
      
      <span>  <img src="@/assets/img/menu/envelope.png" class="img" width="22" height="16"> 站内信 </span>
    </a-popover>
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
  methods: {}
};
</script>

<style lang="less" scoped>
.message-container {
  padding: 0 20px;
}
.img{
  margin-right: 6px;
}
</style>
