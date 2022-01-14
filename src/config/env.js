let appId = "619c93dc69a93fbb8a1faf8c";
let appHost = "https://resource-poor.authing.cn";
// 默认请求地址
const baseUrl = {
  dev: "http://216d7872i4.qicp.vip",
  // dev: "http://ims.dev.ydidc.com",
  test: "http://ims.test.ydidc.com",
  prod: "http://ims.prod.ydidc.com"
};
// 支付相关请求地址
const payBaseUrl = {
  dev: "http://pay.dev.ydidc.com",
  test: "http://pay.test.ydidc.com",
  prod: "http://pay.prod.ydidc.com"
};
// 跳转云商城地址
const cloudMallUrl = {
  dev: "http://192.168.0.7:3000",
  test: "http://www.test.ydidc.com",
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
