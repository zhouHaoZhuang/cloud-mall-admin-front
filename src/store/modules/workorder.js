import request from "@/utils/request";

const workorder = {
  namespaced: true,
  state: {},

  mutations: {},

  actions: {
    // 提交工单-----start
    // 问题类别列表
    problemTypeList({ commit, state }, params) {
      return request({
        url: `/workOrderReply`,
        method: "get",
        params,
        formService: true
      });
    },
    // 产品类别类型列表
    productTypeList({ commit, state }, params) {
      return request({
        url: `/workOrderReply`,
        method: "get",
        params,
        formService: true
      });
    },
    // 根据产品类别类型单个，获取对应用户所拥有的ip
    productTypeIp({ commit, state }, params) {
      return request({
        url: `/workOrderReply`,
        method: "get",
        params,
        formService: true
      });
    },
    // 提交工单
    submitWorkOrder({ commit, state }, data) {
      return request({
        url: "/workOrder",
        method: "post",
        data,
        formService: true
      });
    },
    // 提交工单-----end
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
    },
    // 关闭工单
    closeWorkOrder({ commit, state }, params) {
      return request({
        url: `/workOrder/close/${params.wordOrderNo}`,
        method: "get",
        formService: true
      });
    },
    // 消息记录列表
    messageList({ commit, state }, params) {
      return request({
        url: `/workOrderReply`,
        method: "get",
        params,
        formService: true
      });
    },
    // 用户发送一条消息
    sendMessage({ commit, state }, data) {
      return request({
        url: "/workOrderReply",
        method: "post",
        data,
        formService: true
      });
    },
    // 评价工单
    commentWorkOrder({ commit, state }, data) {
      return request({
        url: "/workOrderReply",
        method: "post",
        data,
        formService: true
      });
    }
    // 我的工单-----end
  }
};

export default workorder;
