let VUE_APP_BASE_URL = "";

if (process.env.VUE_APP_ENV === "dev") {
  VUE_APP_BASE_URL = "http://8.136.205.83:8080";
  // VUE_APP_BASE_URL = "http://127.0.0.1:8080";
} else if (process.env.VUE_APP_ENV === "test") {
  VUE_APP_BASE_URL = "http://api-test.com";
} else if (process.env.VUE_APP_ENV === "prod") {
  VUE_APP_BASE_URL = "https://api.chadian.com";
}
// 跳转控制台地址
const cloudMallUrl = {
  dev: "http://192.168.0.7:3000"
  // test: 'http://test.com',
  // preprod: 'http://preprod.com',
  // prod: 'http://prod.com'
};

export default {
  VUE_APP_BASE_URL,
  MALL_URL: cloudMallUrl[process.env.VUE_APP_ENV]
};
