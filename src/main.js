import Vue from "vue";
import App from "@/App.vue";
import store from "@/store";
import { initRouter } from "@/router";
import bootstrap from "@/bootstrap";
// ui组件
import Antd, { Icon } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
// 自定义指令+过滤器
import * as Directives from "@/utils/directives/index";
import * as Filters from "@/utils/filters/index";

Vue.config.productionTip = false;

// ui组件按需导入
Vue.use(Antd);
Vue.prototype.$message = Antd.message;
// 全局字体图标组件---使用iconfont图标
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_2199915_uvio19pa0qq.js"
});
Vue.component("icon-font", IconFont);

// 初始化router
const router = initRouter();

// 导入全局自定义指令+过滤器
Vue.use(Directives);
Vue.use(Filters);

// 启动设置 --- 放在最后
bootstrap({ router, store, message: Vue.prototype.$message });

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount("#app");
