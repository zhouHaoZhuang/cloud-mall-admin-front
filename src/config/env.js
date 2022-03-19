import { getIdcMallUrl } from "../utils/index";
// 默认请求地址
const baseUrl = {
  local: "/ims",
  dev: "/ims",
  test: "/ims",
  prod: "/ims"
};
// form服务接口请求地址
const formBaseUrl = {
  local: "http://site.sailayun.com/fs",
  dev: "/fs",
  test: "/fs",
  prod: "/fs"
};
// 跳转云商城地址
const cloudMallUrl = {
  local: "http://192.168.12.47:3000"
};
// 获取云商城地址
function getCloudMallUrl() {
  return process.env.VUE_APP_ENV === "local"
    ? cloudMallUrl[process.env.VUE_APP_ENV]
    : getIdcMallUrl();
}
// 请求头携带domain参数
const domains = {
  local: "t940857.site.sailayun.com"
};

export default {
  BASE_URL: baseUrl[process.env.VUE_APP_ENV],
  FORM_BASE_URL: formBaseUrl[process.env.VUE_APP_ENV],
  MALL_URL: getCloudMallUrl(),
  DOMAIN_URL: domains[process.env.VUE_APP_ENV]
};
