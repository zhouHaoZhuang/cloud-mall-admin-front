import { getIdcMallUrl } from "../utils/index";
// 默认请求地址
const baseUrl = {
  dev: "http://site.ydidc.com/server",
  test: "http://www.zjyundun.com/server",
  prod: "http://www.zjyundun.com/server"
};
// 支付相关请求地址
const payBaseUrl = {
  dev: "http://www.ydidc.com/server/pay",
  test: "http://www.zjyundun.com/server/pay",
  prod: "http://www.zjyundun.com/server/pay"
};
// form服务接口请求地址
const formBaseUrl = {
  dev: "http://www.ydidc.com/server/form",
  test: "http://www.zjyundun.com/server/form",
  prod: "http://www.zjyundun.com/server/form"
};
// 跳转云商城地址
const cloudMallUrl = {
  dev: "http://192.168.12.30:3000"
};
// 获取云商城地址
function getCloudMallUrl() {
  return process.env.VUE_APP_ENV === "dev"
    ? cloudMallUrl[process.env.VUE_APP_ENV]
    : getIdcMallUrl();
}
// 请求头携带domain参数
const domains = {
  dev: "localhost"
};
// authing接口参数
const authingReq = {
  dev: {
    appId: "619c93dc69a93fbb8a1faf8c",
    appHost: "https://resource-poor.authing.cn"
  },
  test: {
    appId: "61cc1320c33bcb838eafe6cb",
    appHost: "https://idc.authing.cn"
  },
  prod: {
    appId: "",
    appHost: ""
  }
};

export default {
  BASE_URL: baseUrl[process.env.VUE_APP_ENV],
  PAY_BASE_URL: payBaseUrl[process.env.VUE_APP_ENV],
  FORM_BASE_URL: formBaseUrl[process.env.VUE_APP_ENV],
  MALL_URL: getCloudMallUrl(),
  DOMAIN_URL: domains[process.env.VUE_APP_ENV],
  ...authingReq[process.env.VUE_APP_ENV]
};
