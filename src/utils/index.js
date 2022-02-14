import store from "@/store";
import env from "@/config/env";
// 根据id返回数组中对应id的对象---挂载全局 $getArrOnceData
export const getArrOnceData = (id, arr, key) => {
  return arr.find((ele) => ele[key ? key : id] === id);
};
// 压缩图片
export function base64ToFile(base64, filename) {
  var arr = base64.split(",");
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const file = new File([u8arr], filename, { type: mime });
  Object.assign(file, { uid: file.lastModified });
  return file;
}
// 请求列表时前端要替后端做适配，并且有点多，封装请求列表时带有搜索的接口
// request: 调用vuex的actions名   listQuery: 传递给后端的参数
// 设置需要处理为精确查询的名单
const filterList = ["id"];
export const getListQp = (request, listQuery) => {
  return new Promise((resolve, reject) => {
    store
      .dispatch(
        request,
        listQuery.key
          ? {
              ...listQuery,
              [`qp-${listQuery.key}-${
                filterList.indexOf(listQuery.key) !== -1 ? "eq" : "like"
              }`]: listQuery.search
            }
          : listQuery
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getList = (request, listQuery) => {
  return new Promise((resolve, reject) => {
    store
      .dispatch(
        request,
        listQuery.key && listQuery.search
          ? {
              ...listQuery,
              [`${listQuery.key}`]: listQuery.search
            }
          : listQuery
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// 处理浏览器地址栏地址，截取地址中段,不需要http:// or https://和com后地址
export const getWindowUrl = (url) => {
  const newUrl = url.includes("http://")
    ? url.replace("http://", "")
    : url.replace("https://", "");
  const str = newUrl.substring(0, newUrl.indexOf("/"));
  const index1 = str.lastIndexOf(".");
  const index2 = str.lastIndexOf(".", index1 - 1);
  const result = str.substring(index2 + 1);
  return result;
};

// 根据环境返回domain地址--后端需要请求头携带浏览器地址，字段：domain
export const getDomainUrl = () => {
  return process.env.VUE_APP_ENV === "dev"
    ? env.DOMAIN_URL
    : getWindowUrl(window.location.href);
};

// 处理服务器询价或者其他操作时，时长+单位的字段
export const setBuyTimeData = (time) => {
  if (time <= 9) {
    return {
      period: time,
      priceUnit: "Month"
    };
  } else {
    return {
      period: time / 12,
      priceUnit: "Year"
    };
  }
};

export const fixNumber = (number) => {
  if (number < 10) {
    return "0" + number;
  }
  return "" + number;
};

// 处理倒计时时间
export const useLeftTime = (diff) => {
  const HH = fixNumber(Math.floor(diff / (1000 * 60 * 60)));
  const mm = fixNumber(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
  const ss = fixNumber(Math.floor((diff / 1000) % 60));
  return [HH, mm, ss];
};

// 打开新页面跳转支付宝支付
export const openAlipayPay = (form) => {
  // 支付宝支付
  // 添加之前先删除一下，如果单页面，页面不刷新，添加进去的内容会一直保留在页面中，二次调用form表单会出错
  const divForm = document.getElementsByTagName("divform");
  if (divForm.length) {
    document.body.removeChild(divForm[0]);
  }
  const div = document.createElement("divform");
  // data就是接口返回的form 表单字符串
  div.innerHTML = form;
  document.body.appendChild(div);
  // 新开窗口跳转
  document.forms[0].setAttribute("target", "_blank");
  document.forms[0].submit();
  // 当前页直接跳转
  //跳转支付页面
  // document.querySelector("body").innerHTML = res.data;
  // document.forms[0].submit();
};

// 跳转云商城
export const jumpCloudMall = (url, type) => {
  window.open(env.MALL_URL + url, type ? "_blank" : "_self");
};

// 处理cpu+内存数据  data:默认数组  company:单位
export const setCpuOrDiskData = (data, company) => {
  if (data && Array.isArray(data) && data.length > 0) {
    const newData = data.sort((a, b) => a - b);
    return newData.map((item) => {
      return {
        title: String(item).replace(".0", "") + company,
        value: item * 1
      };
    });
  } else {
    return [];
  }
};

// 跳转云商城的url地址生成
export const getIdcMallUrl = () => {
  const url = window.location.href;
  const newUrl = url.includes("http://")
    ? url.replace("http://", "")
    : url.replace("https://", "");
  const result = newUrl
    .substring(0, newUrl.indexOf("/"))
    .replace("console.", "");
  const newResult = `${
    url.includes("http://") ? "http://" : "https://"
  }www.${result}`;
  return newResult;
};

// 订单详情支付生成支付宝回调地址
export const getAliPayCallBack = (id) => {
  if (process.env.VUE_APP_ENV === "dev") {
    return "";
  }
  const url = window.location.href;
  const index = url.indexOf(".com") !== -1 ? url.indexOf(".com") + 4 : -1;
  const result =
    index !== -1
      ? `${url.substring(0, index)}/#/user/finance/orderDetail?id=${id}`
      : "";
  return result;
};

// 充值页面支付生成支付宝回调地址
export const getRechargeAliPayCallBack = () => {
  if (process.env.VUE_APP_ENV === "dev") {
    return "";
  }
  const url = window.location.href;
  const index = url.indexOf(".com") !== -1 ? url.indexOf(".com") + 4 : -1;
  const result =
    index !== -1 ? `${url.substring(0, index)}/#/user/finance/recharge` : "";
  return result;
};
