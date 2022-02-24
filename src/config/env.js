import { getIdcMallUrl } from "../utils/index";
// 默认请求地址
const baseUrl = {
  local: "/server",
  dev: "/server",
  test: "/server",
  prod: "/server"
};
// form服务接口请求地址
const formBaseUrl = {
  local: "/form",
  dev: "/server/form",
  test: "/server/form",
  prod: "/server/form"
};
// 跳转云商城地址
const cloudMallUrl = {
  local: "http://192.168.12.30:3000"
};
// 获取云商城地址
function getCloudMallUrl() {
  return process.env.VUE_APP_ENV === "local"
    ? cloudMallUrl[process.env.VUE_APP_ENV]
    : getIdcMallUrl();
}
// 请求头携带domain参数
const domains = {
  local: "t946464351140401152.site.ydidc.com"
};

export default {
  BASE_URL: baseUrl[process.env.VUE_APP_ENV],
  FORM_BASE_URL: formBaseUrl[process.env.VUE_APP_ENV],
  MALL_URL: getCloudMallUrl(),
  DOMAIN_URL: domains[process.env.VUE_APP_ENV]
};
