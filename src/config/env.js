let VUE_APP_BASE_URL = "";

if (process.env.VUE_APP_ENV === "dev") {
  VUE_APP_BASE_URL = "http://ims.dev.ydidc.com";
  // VUE_APP_BASE_URL = "http://192.168.0.40:8083";
} else if (process.env.VUE_APP_ENV === "test") {
  VUE_APP_BASE_URL = "http://ims.dev.ydidc.com";
} else if (process.env.VUE_APP_ENV === "prod") {
  VUE_APP_BASE_URL = "http://ims.dev.ydidc.com";
}
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
  VUE_APP_BASE_URL,
  MALL_URL: cloudMallUrl[process.env.VUE_APP_ENV],
  DOMAIN_URL: domains[process.env.VUE_APP_ENV]
};
