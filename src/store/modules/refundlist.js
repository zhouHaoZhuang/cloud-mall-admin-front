import request from "@/utils/request";
// 退票列表相关接口
const refundlist = {
  namespaced: true,
  actions: {
    // 获取列表
    getList({ commit, state},params ) {
      return request({
				url: "/invoiceRecord/refund/page",
				method: "get",
				params,
			})
    },
		// 取消单个
    getCancelRefund({ commit, state }, id) {
      return request({
        url: `/invoiceRecord/cancelRefund/${id}`,
        method: "patch"
      });
    },
    // 添加常用地址
    add({ commit, state }, params) {
      return request({
        url: "/pcOfflineRecharge/user",
        method: "post",
        data: params
      });
    },
    // 修改常用地址
    edit({ commit, state }, params) {
      return request({
        url: `/pcOfflineRecharge/user/${params.id}`,
        method: "put",
        data: params
      });
    },
    // 删除常用地址
    del({ commit, state }, id) {
      return request({
        url: `/pcOfflineRecharge/user/${id}`,
        method: "delete"
      });
    }
  },
};

export default refundlist;
