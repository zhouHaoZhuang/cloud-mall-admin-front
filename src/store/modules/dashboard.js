import request from "@/utils/request";

const cloud = {
  namespaced: true,
  state: {
    // 网站信息
    webInfo: {},
    // 公司信息
    companyInfo: {}
  },

  mutations: {
    // 保存网站设置信息
    saveWebInfo(state, payload) {
      state.webInfo = { ...payload };
    },
    // 保存公司信息
    saveCompanyInfo(state, payload) {
      state.companyInfo = { ...payload };
    }
  },

  actions: {
    isAccountSetup({ commit, state }, data) {
      return request({
        url: "/tcOrder/checkOpenCdnProductServer",
        method: "post",
        data
      });
    },
    //获取首页消费趋势数据最新接口
    newTrendData({ commit, state }) {
      return request({
        url: "/customerAccountLog/query/monthLine",
        method: "get"
      });
    },
    // 获取首页消费趋势数据
    trendData({ commit, state }) {
      return request({
        url: "/customerAccountLog/query/monthLog",
        method: "get"
      });
    },
    // 获取用户余额+代金券
    getBalanceAndCoupon({ commit, state }, params) {
      return request({
        url: `/ccCorporation/getCurrentUserAccountBalance`,
        method: "get"
      });
    },
    // 获取云服务器数量
    getCloudCount({ commit, state }) {
      return request({
        url: "/scEcsStock/getEcsCount",
        method: "get"
      });
    },
    // 获取未完成订单和待续费数量
    getOrderAndRenewCount({ commit, state }) {
      return request({
        url: "/index/getCount",
        method: "get"
      });
    },
    // 获取网站信息
    getWebInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        request({
          url: "/ccWebsiteInfo",
          method: "get"
        })
          .then((res) => {
            const newData = res.data.list[0];
            commit("saveWebInfo", newData);
            let fav = document.querySelector("link[rel*='icon']");
            fav.setAttribute("rel", "icon");
            fav.href = newData.websitieIcon;
            document.head.appendChild(fav);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 获取公司信息
    getCompanyInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        request({
          url: "/ccCompanyInfo",
          method: "get"
        })
          .then((res) => {
            commit("saveCompanyInfo", res.data.list[0]);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  }
};

export default cloud;
