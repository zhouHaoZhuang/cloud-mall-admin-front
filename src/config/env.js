// 默认请求地址
const baseUrl = {
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
// 跳转控制台地址
const cloudMallUrl = {
  dev: "http://localhost:3000"
  // test: 'http://test.com',
  // preprod: 'http://preprod.com',
  // prod: 'http://prod.com'
};

// 请求头携带domain参数
const domains = {
  dev: "localhost"
  // test: 'http://test.com',
  // preprod: 'http://preprod.com',
  // prod: 'http://prod.com'
};

export default {
  BASE_URL: baseUrl[process.env.VUE_APP_ENV],
  PAY_BASE_URL: payBaseUrl[process.env.VUE_APP_ENV],
  MALL_URL: cloudMallUrl[process.env.VUE_APP_ENV],
  DOMAIN_URL: domains[process.env.VUE_APP_ENV]
};
