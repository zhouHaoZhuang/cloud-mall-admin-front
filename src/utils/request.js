import axios from "axios";
import env from "@/config/env";
import message from "ant-design-vue/es/message";
import store from "@/store";
import { getDomainUrl } from "@/utils/index";
const axiosSource = axios.CancelToken.source();
const { AuthenticationClient } = require("authing-js-sdk");
const authenticationClient = new AuthenticationClient({
  appId: env.appId,
  appHost: env.appHost
});
// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: env.BASE_URL,
  timeout: 10000 // 请求超时时间
});
// 下载的请求地址
const downloadUrl = [];

// 异常拦截处理器
const errorHandler = (error) => {
  console.log("error", error.response);
  return Promise.reject(error);
};

// request interceptor 请求拦截
request.interceptors.request.use(async (config) => {
  // 携带system区分不同项目
  config.headers.system = "idc";
  // 多个请求地址兼容
  // 支付请求地址
  if (config.pay) {
    config.baseURL = env.PAY_BASE_URL;
  }
  // form，新的服务接口请求地址
  if (config.formService) {
    config.baseURL = env.FORM_BASE_URL;
    config.headers.system = "fs";
    config.headers["authing-id"] = store.state.user.userInfo.id;
  }
  config.cancelToken = axiosSource.token;
  // token
  const token = store.state.user.token;
  // 租户id
  const tenantId = store.state.user.userInfo.tenantId;
  // 每次请求时需要判断登录状态，未登录直接跳转登录页，并且取消本次请求
  if (config.url !== "/user/loginByUsername") {
    const data = await authenticationClient.checkLoginStatus(token);
    if (data.code !== 200) {
      axiosSource.cancel("取消请求");
      store.dispatch("user/logout");
      window.location.replace("/");
    }
  }
  // 携带token
  if (token) {
    // 让每个请求携带token-- ['token']为自定义key 请根据实际情况自行修改
    config.headers["token"] = token;
  }
  // 携带租户id
  if (tenantId) {
    config.headers["tenantId"] = tenantId;
  }
  // 携带domain
  config.headers.domain = getDomainUrl();
  // config.headers.domain = 'ydidc.com'
  // 头部携带ip
  const ip = localStorage.getItem("Ip");
  config.headers["ip"] = ip;
  return config;
}, errorHandler);

// response interceptor  响应拦截
request.interceptors.response.use((response) => {
  if (
    response.config.url &&
    downloadUrl.some((item) => response.config.url.indexOf(item) > -1)
  ) {
    console.log("export", response.config.url);
    return response;
  }
  const data = response.data;
  const errno = data.code;
  const errmsg = data.msg;
  if (errno !== "000000") {
    message.warning(errmsg);
    // if (errno === 10001 || errno === 10006 || errno === 3) {
    //   store.dispatch("user/logout").then(() => {
    //     location.reload();
    //   });
    // }
    return Promise.reject(data);
  }
  return data;
}, errorHandler);

export default request;
