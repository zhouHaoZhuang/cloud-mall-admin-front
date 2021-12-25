import request from "@/utils/request";

const income = {
  namespaced: true,
  actions: {
    // 获取充值记录
    getList({
      commit,
      state
    }, params) {
      return request({
        url: "/customer/rechargeUserRecord",
        method: "get",
        params,
      })
    },
    // 获取余额接口
    getBalance({ commit, state }, id) {
      console.log(state);
      return request({
        url: `/tcOrder`,
        method: "get"
      });
    }
  },
};

export default income;