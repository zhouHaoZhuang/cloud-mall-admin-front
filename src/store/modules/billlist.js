import request from "@/utils/request";
// 发票列表相关接口
const billlist = {
  namespaced: true,
  actions: {
    // 获取发票列表
    getList({ commit, state }, params) {
      return request({
        url: "/ccInvoiceEvaluate",
        method: "get",
        params,
      });
    },
    // 获取明细列表
    getDetails({ commit, state }, params) {
      return request({
        url: `/ccInvoiceEvaluate`,
        method: "get",
        params
      });
    },
    // 获取发票详情 金额数据
    getAmount({ commit, state }, params) {
      return request({
        url: `/ccInvoiceEvaluate/amount`,
        method: "get",
        params
      });
    },
    // 获取发票详情 发票信息
    getInvoiceInfo({ commit, state }, params) {
      return request({
        url: `/ccInvoiceEvaluate/invoiceInfo`,
        method: "get",
        params
      });
    },
    // 获取发票详情 发票信息
    getAddressInfo({ commit, state }, params) {
      return request({
        url: `/ccInvoiceEvaluate/addressInfo`,
        method: "get",
        params
      });
    },
    // 获取
    getOne({ commit, state }, id) {
      console.log(state);
      return request({
        url: `/ccInvoiceRecord/${id}`,
        method: "get",
      });
    },
    // 添加
    add({ commit, state }, params) {
      return request({
        url: "/pcOfflineRecharge/user",
        method: "post",
        data: params,
      });
    },
    // 修改
    edit({ commit, state }, params) {
      return request({
        url: `/pcOfflineRecharge/user/${params.id}`,
        method: "put",
        data: params,
      });
    },
    // 删除
    del({ commit, state }, id) {
      return request({
        url: `/pcOfflineRecharge/user/${id}`,
        method: "delete",
      });
    },
  },
};

export default billlist;
