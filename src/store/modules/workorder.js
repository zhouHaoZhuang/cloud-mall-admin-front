import request from "@/utils/request";

const workorder = {
  namespaced: true,
  state: {},

  mutations: {},

  actions: {
    // 我的工单-----start
    // 工单列表
    workOrderList({ commit, state }, data) {
      return request({
        url: "/workOrder/queryCustomerOrder",
        method: "post",
        data,
        formService: true
      });
    },
    // 工单详情
    workOrderDetail({ commit, state }, params) {
      return request({
        url: `/workOrder/${params.wordOrderNo}`,
        method: "get",
        params,
        formService: true
      });
    }
    // 我的工单-----end
  }
};

export default workorder;
