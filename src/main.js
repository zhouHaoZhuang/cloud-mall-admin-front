import Vue from "vue";
import App from "@/App.vue";
import store from "@/store";
import clonedeep from "lodash.clonedeep";
import { initRouter } from "@/router";
import bootstrap from "@/bootstrap";
import * as utilsFun from "@/utils/index";
// ui组件
import Antd, { Icon, message } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
// 复制文本插件
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);
// 图片预览组件
import preview from "vue-photo-preview";
import "vue-photo-preview/dist/skin.css";
// 全局样式
import "./global.less"; // global style
// 自定义指令+过滤器
import * as Directives from "@/utils/directives/index";
import * as Filters from "@/utils/filters/index";

Vue.config.productionTip = false;

// ui组件
Vue.use(Antd);
Vue.prototype.$message = message;
// 全局字体图标组件---使用iconfont图标
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_3142322_h73l9et5ya.js"
});
Vue.component("Iconfont", IconFont);
// 图片预览组件
Vue.use(preview);

// 全局挂载请求列表兼容方法---请求列表通过此方法走筛选
Vue.prototype.$getList = utilsFun.getList;
Vue.prototype.$getListQp = utilsFun.getListQp;

// 深拷贝插件
Vue.prototype.$clonedeep = clonedeep;

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
