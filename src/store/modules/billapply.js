import request from "@/utils/request";
// 发票信息相关接口
const billapply = {
  namespaced: true,
  actions: {
    // 获取发票信息列表
    getList({ commit, state }, params) {
      return request({
        url: "/ccInvoiceInfo",
        method: "get",
        params
      });
    },
    // 获取明细列表
    getDetails({ commit, state }, params) {
      return request({
        url: `/ccInvoiceInfo`,
        method: "get",
        params
      });
    },
    // 获取发票抬头
    getInvoiceTitle({ commit, state }, params) {
      return request({
        url: `/ccInvoiceEvaluate/invoiceTitle`,
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
    // 申请发票data
    applyInvoice({ commit, state }, data) {
      return request({
        url: `/invoiceRecord/issue`,
        method: "post",
        data
      });
    },
    // 获取发票详情 发票信息
    getInvoiceInfo({ commit, state }, params) {
      return request({
        url: `/invoiceRecord/${params.id}`,
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
    // 退票申请
    refundApply({ commit, state }, data) {
      return request({
        url: `/invoiceRecord/refund/${data.id}`,
        method: "patch",
        data
      });
    },
    // 修改地址
    updateAddress({ commit, state }, params) {
      return request({
        url: `/invoiceRecord/updateAddress/${params.id}`,
        method: "patch",
        params: {
          addressInfoId: params.addressInfoId
        }
      });
    },
    // 获取
    getOne({ commit, state }, id) {
      console.log(state);
      return request({
        url: `/ccInvoiceRecord/${id}`,
        method: "get"
      });
    },
    // 添加
    add({ commit, state }, params) {
      return request({
        url: "/pcOfflineRecharge/user",
        method: "post",
        data: params
      });
    },
    // 修改
    edit({ commit, state }, params) {
      return request({
        url: `/pcOfflineRecharge/user/${params.id}`,
        method: "put",
        data: params
      });
    },
    // 删除
    del({ commit, state }, id) {
      return request({
        url: `/pcOfflineRecharge/user/${id}`,
        method: "delete"
      });
    }
  }
};

export default billapply;
