let appId = "619c93dc69a93fbb8a1faf8c";
let appHost = "https://resource-poor.authing.cn";
// 默认请求地址
const baseUrl = {
  // dev: "http://192.168.0.13:8082",
  dev: "http://ims.dev.ydidc.com",
  test: "http://ims.dev.ydidc.com",
  preprod: "http://ims.dev.ydidc.com",
  prod: "http://ims.dev.ydidc.com"
};
// 支付相关请求地址
const payBaseUrl = {
  dev: "http://pay.dev.ydidc.com",
  test: "http://pay.dev.ydidc.com",
  preprod: "http://pay.dev.ydidc.com",
  prod: "http://pay.dev.ydidc.com"
};
// 跳转云商城地址
const cloudMallUrl = {
  dev: "http://192.168.0.7:3000",
  test: "http://www.test.ydidc.com",
  preprod: "http://www.preprod.ydidc.com",
  prod: "http://www.ydidc.com"
};

// 请求头携带domain参数
const domains = {
  dev: "localhost"
  // test: 'http://test.com',
  // preprod: 'http://preprod.com',
  // prod: 'http://prod.com'
};

export default {
  appId,
  appHost,
  BASE_URL: baseUrl[process.env.VUE_APP_ENV],
  PAY_BASE_URL: payBaseUrl[process.env.VUE_APP_ENV],
  MALL_URL: cloudMallUrl[process.env.VUE_APP_ENV],
  DOMAIN_URL: domains[process.env.VUE_APP_ENV]
};
