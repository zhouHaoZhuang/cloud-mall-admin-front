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
  if (to.query.token) {
    store.commit("user/SET_TOKEN", to.query.token);
  }
  if (!loginIgnore.includes(to) && !token) {
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
const permsGuard = (to, from, next, options) => {
  const { store, message } = options;
  // const perms = store.state.user.perms;
  // 如果没有用户信息，需要查询用户信息
  const userInfo = store.state.user.userInfo;
  if (!loginIgnore.includes(to) && JSON.stringify(userInfo) === "{}") {
    // 获取用户信息
    store.dispatch("user/getUserInfo");
    // 获取权限数据
    // store.dispatch("user/getUserPerms");
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
  next();
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
