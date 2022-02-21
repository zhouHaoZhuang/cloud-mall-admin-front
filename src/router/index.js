import Vue from "vue";
import Router from "vue-router";
import options from "./config";

Vue.use(Router);

// 不需要登录拦截的路由配置
const loginIgnore = {
  names: ["404"], //根据路由名称匹配
  paths: ["/exception/not"], //根据路由fullPath匹配
  /**
   * 判断路由是否包含在该配置中
   * @param route vue-router 的 route 对象
   * @returns {boolean}
   */
  includes(route) {
    return this.names.includes(route.name) || this.paths.includes(route.path);
  }
};

// 初始化路由实例
function initRouter() {
  return new Router({ mode: "history", base: "console", routes: options });
}
export { loginIgnore, initRouter };
