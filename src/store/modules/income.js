import request from "@/utils/request";

const income = {
  namespaced: true,
  actions: {
    // 获取充值记录
    getList({ commit, state }, params) {
      return request({
        url: "/tcOrder/user",
        method: "get",
        params
      });
    },
    getOne({ commit, state }, id) {
      console.log(state);
      return request({
        url: `/tcOrder/${id}`,
        method: "get"
      });
    },
    // 取消订单
    cancelOrder({ commit, state }, params) {
      return request({
        url: `/tcOrder/tradeClose/${params.id}`,
        method: "get"
      });
    }
  }
};

export default income;
