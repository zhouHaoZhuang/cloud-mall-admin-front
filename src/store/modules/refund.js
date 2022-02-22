import request from "@/utils/request";

const refund = {
  namespaced: true,
  actions: {
    // 获取退款列表
    getRefundList({ commit, state }, params) {
      return request({
        url: "/customer/rechargeUserRecord",
        method: "get",
        params,
      });
    },
    // 获取退订记录
    getRecord({ commit, state }, data) {
      return request({
        url: `/tcOrder/unSubscrube/list`,
        method: "post",
        data,
      });
    },
  },
};

export default refund;
