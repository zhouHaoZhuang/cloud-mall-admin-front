import request from "@/utils/request";

const income = {
  namespaced: true,
  actions: {
    // 获取充值记录
    getVal({
      commit,
      state
    }, data) {
      return request({
        url: "/pay/onlineTopUp",
        method: "post",
        data,
      })
    },
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