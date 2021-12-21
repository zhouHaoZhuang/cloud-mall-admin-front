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
    }
  }
};

export default cloud;
