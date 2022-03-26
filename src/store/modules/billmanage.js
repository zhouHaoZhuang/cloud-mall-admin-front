import request from "@/utils/request";
// 账单管理相关接口
const billmanage = {
  namespaced: true,
  actions: {
    // 获取发票信息列表
    getList({ commit, state }, params) {
      return request({
        url: "/tcBill",
        method: "get",
        params
      });
    }
  }
};

export default billmanage;
