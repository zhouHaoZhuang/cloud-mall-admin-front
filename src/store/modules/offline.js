import request from "@/utils/request";

const offline = {
  namespaced: true,
  actions: {
    // 查询线下公司充值信息
    getInfo({ commit, state} ) {
      return request({
				url: "/pcOfflineRecharge/companyInfo",
				method: "get",
			})
    },
    putOffline({ commit, state }, data) {
      console.log(state);
      return request({
        url: `/pcOfflineRecharge`,
        method: "post",
				data
      });
    }
  },
};

export default offline;
