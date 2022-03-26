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
    // 用量查询接口
    getUsage({ commit, state }, data) {
      return request({
        url: `/aliyun/cdn/describeDomainUsageData`,
        method: "post",
        data
      });
    },
    // 域名列表查询接口
    getDomainList({ commit, state }, params) {
      return request({
        url: `/cdnDomain`,
        method: "get",
        params
      });
    }
  },
};

export default cdndashboard;
