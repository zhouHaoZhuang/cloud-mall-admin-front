//应用配置
let appOptions = {
  router: undefined,
  store: undefined
};

/**
 * 设置应用配置
 * @param options
 */
function setAppOptions(options) {
  const { router, store } = options;
  appOptions.router = router;
  appOptions.store = store;
}

/**
 * 加载路由
 */
function loadRoutes() {
  // 应用配置
  const { router, store } = appOptions;
  // 初始化Admin后台菜单数据
  const rootRoute = router.options.routes.find((item) => item.path === "/");
  const menuRoutes = rootRoute.children.filter(
    (item) => store.state.setting.filterList.indexOf(item.path) === -1
  );
  if (menuRoutes) {
    store.commit("setting/setMenuData", menuRoutes);
  }
}

/**
 * 加载导航守卫
 * @param guards
 * @param options
 */
function loadGuards(guards, options) {
  const { beforeEach, afterEach } = guards;
  const { router } = options;
  beforeEach.forEach((guard) => {
    if (guard && typeof guard === "function") {
      router.beforeEach((to, from, next) => guard(to, from, next, options));
    }
  });
  afterEach.forEach((guard) => {
    if (guard && typeof guard === "function") {
      router.afterEach((to, from) => guard(to, from, options));
    }
  });
}

export { loadRoutes, loadGuards, setAppOptions };
