<template>
  <div class="message-container">
    <a-popover >
      <template slot="content">
        <div>
          <span>您暂时没有站内消息</span>
          <a href="#/user/setting/message">查看更多&gt;</a>
        </div>
      </template>
      <span><a-icon type="mail" /> 站内信</span>
    </a-popover>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      menuOpen: (state) => state.setting.menuOpen,
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
.message-container {
  padding: 0 20px;
}
</style>
