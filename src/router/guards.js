import { hasPermissionMenu, setAsyncRouteMenu } from "@/utils/permission";
import { loginIgnore } from "@/router/index";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false });

/**
 * 进度条开始
 * @param to
 * @param form
 * @param next
 */
const progressStart = (to, from, next) => {
  // 开始进度条
  if (!NProgress.isStarted()) {
    NProgress.start();
  }
  next();
};

/**
 * 登录守卫
 * @param to
 * @param form
 * @param next
 * @param options
 */
const loginGuard = (to, from, next, options) => {
  const { store, message } = options;
  // console.log("登录守卫", to, to.query.token, "----", store.state.user.token);
  const token = to.query.token || store.state.user.token;
  if (token) {
    store.commit("user/SET_TOKEN", token);
  }
  // 每次进入登录页面清除缓存
  if (to.path === "/login") {
    localStorage.clear();
  }
  if (!loginIgnore.includes(to) && !token) {
    // 执行退出
    store.dispatch("user/logout");
    message.warning("登录已失效，请重新登录");
    next("/exception/not");
  } else {
    next();
  }
};

/**
 * 权限守卫--只负责检测本地是否有权限数据
 * 同时获取下用户信息更新本地数据
 * @param to
 * @param form
 * @param next
 * @param options
 */
const permsGuard = async (to, from, next, options) => {
  const { store, message, router } = options;
  // const perms = store.state.user.perms;
  // 如果没有用户信息，需要查询用户信息
  const perms = store.state.user.perms;
  if (!loginIgnore.includes(to) && perms.length === 0) {
    // 获取用户信息
    store.dispatch("user/getUserInfo");
    // 获取用户实名相关信息
    store.dispatch("user/getUserActualName");
    // 获取网站信息
    store.dispatch("dashboard/getWebInfo");
    // 获取公司信息
    store.dispatch("dashboard/getCompanyInfo");
    // 获取其他全局配置
    store.dispatch("user/getAllConfig");
    // 获取产品列表
    store.dispatch("user/getProductList");
    // 获取权限数据
    await store.dispatch("user/getUserPerms");
    // 设置动态路由
    const perms = store.state.user.perms;
    setAsyncRouteMenu(perms, router, store);
    // 获取生成的默认跳转路由
    const firstPath = store.state.setting.firstPath;
    if (!firstPath) {
      message.warning("当前登录用户没有任何权限，将退出登录");
      store.dispatch("user/logout");
      next("/exception/not");
    }
  }
  if (to.path === "/") {
    const firstPath = store.state.setting.firstPath;
    next({ path: firstPath });
  }
  next();
};

/**
 * 权限守卫
 * @param to
 * @param form
 * @param next
 * @param options
 */
const authorityGuard = (to, from, next, options) => {
  const { store, message, router } = options;
  const perms = store.state.user.perms;
  // console.log(
  //   "查看权限",
  //   to,
  //   from,
  //   !loginIgnore.includes(to),
  //   !hasPermissionMenu(to, perms, router),
  //   !loginIgnore.includes(to) && !hasPermissionMenu(to, perms, router)
  // );
  if (!loginIgnore.includes(to) && !hasPermissionMenu(to, perms, router)) {
    message.warning(`对不起，您无权访问页面，请联系管理员`);
    const firstPath = store.state.setting.firstPath;
    next({ path: firstPath });
    NProgress.done();
  } else {
    next();
  }
  // 存储一下当前路由的$route的meta信息
  store.commit("setting/setRouteMeta", to.meta.perm);
};

/**
 * 总览页守卫(也包括其他所有不需要展开左侧二级菜单的页面)
 * @param to
 * @param form
 * @param next
 * @param options
 */
const dashboardGuard = (to, from, next, options) => {
  const { store, message } = options;
  // 设置主体左侧菜单展开还是关闭
  if (
    store.state.setting.filterList.indexOf(to.path) !== -1 &&
    store.state.setting.leftOpen
  ) {
    store.dispatch("setting/changeLeftOpenMenu", false);
  }
  if (
    store.state.setting.filterList.indexOf(to.path) === -1 &&
    !store.state.setting.leftOpen
  ) {
    store.dispatch("setting/changeLeftOpenMenu", true);
  }
  // 设置主体左侧菜单显示还是隐藏
  if (store.state.setting.filterList.indexOf(to.path) !== -1) {
    store.dispatch("setting/changeLeftMenuShow", false);
    store.dispatch("setting/changeSelectPath", "");
  } else {
    store.dispatch("setting/changeLeftMenuShow", true);
  }
  next();
};

/**
 * 进度条结束
 * @param to
 * @param form
 * @param options
 */
const progressDone = () => {
  // 结束进度条
  NProgress.done();
  // 重置浏览器滚动条位置
  // document.body.scrollTop = 0;
  // document.documentElement.scrollTop = 0;
};

export default {
  beforeEach: [
    progressStart,
    loginGuard,
    permsGuard,
    authorityGuard,
    dashboardGuard
  ],
  afterEach: [progressDone]
};
