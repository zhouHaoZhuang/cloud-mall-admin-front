import request from "@/utils/request";
// 发票信息管理相关接口
const cdndashboard = {
  namespaced: true,
  actions: {
		// 获取总览数据信息
    getData({ commit, state }, data) {
      return request({
        url: `/cdnDomain/query/cdnHomePageData`,
        method: "post",
        data
      });
    },
  },
};

export default cdndashboard;
