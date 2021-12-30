import request from "@/utils/request";

const inquire = {
  namespaced: true,
  actions: {
    // 获取线下充值记录
    getList({ commit, state},params ) {
      return request({
				url: "/pcOfflineRecharge",
				method: "get",
				params,
			})
    },
		// 获取线下充值记录详情
    getOne({ commit, state }, id) {
      console.log(state);
      return request({
        url: `/pcOfflineRecharge/detailed/${id}`,
        method: "get"
      });
    }
  },
};

export default inquire;
