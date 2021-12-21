import request from "@/utils/request";

const income = {
  namespaced: true,
  actions: {
    // 获取收支明细列表
    getList({ commit, state}, data) {
      return request({
				url: "/user/loginByUsername",
				method: "get",
				data,
			})
    },
  },
};

export default income;
