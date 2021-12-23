import request from "@/utils/request";

const income = {
  namespaced: true,
  actions: {
    // 获取充值记录
    getList({ commit, state}, data) {
      return request({
				url: "/custpmerAccountlog",
				method: "get",
				data,
			})
    },
  },
};

export default income;
