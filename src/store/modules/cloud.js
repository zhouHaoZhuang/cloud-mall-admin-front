import request from "@/utils/request";

const cloud = {
  namespaced: true,
  state: {},

  mutations: {},

  actions: {
    // 控制台-云服务器-获取列表
    cloudList({ commit, state }, params) {
      return request({
        url: "/corporation/ecsStock/queryEcsPage",
        method: "get",
        params
      });
    },
    // 获取服务器详情
    cloudDetail({ commit, state }, params) {
      return request({
        url: `/corporation/ecsStock/${params.id}`,
        method: "get"
      });
    },
    // 查询地域列表
    addressList({ commit, state }) {
      return request({
        url: "/index/query/region",
        method: "get"
      });
    }
  }
};

export default cloud;
