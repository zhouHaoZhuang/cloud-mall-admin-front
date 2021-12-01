<script>
export default {
  name: "RouteView",
  props: {
    keepAlive: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  render() {
    const {
      $route: { meta },
      $store: { getters }
    } = this;
    const inKeep = (
      <keep-alive>
        <router-view />
      </keep-alive>
    );
    const notKeep = <router-view />;
    // 动态返回是否需要缓存的页面
    return meta.keepAlive ? inKeep : notKeep;
  }
};
</script>
