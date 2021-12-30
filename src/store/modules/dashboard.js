import request from "@/utils/request";

const cloud = {
  namespaced: true,
  state: {},

  mutations: {},

  actions: {
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
        url: `/ccCorporation`,
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
    //
    cloudRenewPrice({ commit, state }, data) {
      return request({
        url: "/scEcsStock/renew/selectInstance",
        method: "post",
        data
      });
    }
  }
};

export default cloud;
