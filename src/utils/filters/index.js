import Vue from "vue";
import moment from "moment";

// 默认格式化为 年-月-日 时:分:秒
Vue.filter("formatDate", function (date, formatStr) {
  return moment(date).format(formatStr ? formatStr : "YYYY-MM-DD hh:mm:ss");
});
