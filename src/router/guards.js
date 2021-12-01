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
  // console.log("登录守卫", to, loginIgnore.includes(to), store.state.user.token);
  // if (!loginIgnore.includes(to) && !store.state.user.token) {
  //   message.warning("登录已失效，请重新登录");
  //   next({ path: "/login" });
  // } else {
  //   next();
  // }
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
 * 进度条结束
 * @param to
 * @param form
 * @param options
 */
const progressDone = () => {
  // 结束进度条
  NProgress.done();
  // 重置浏览器滚动条位置
  // document.body.scrollTop = 0
  // document.documentElement.scrollTop = 0
};

export default {
  beforeEach: [progressStart, loginGuard, authorityGuard],
  afterEach: [progressDone],
};
