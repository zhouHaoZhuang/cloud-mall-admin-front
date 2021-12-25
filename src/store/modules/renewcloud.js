import request from "@/utils/request";

const renewcloud = {
  namespaced: true,
  state: {},

  mutations: {},

  actions: {
    // 控制台-云服务器-获取列表
    cloudList({ commit, state }, params) {
      return request({
        url: "/corporation/ecsStock/queryRenewEcsPage",
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
    // 产品续费时询价
    cloudRenewPrice({ commit, state }, data) {
      return request({
        url: "/scEcsStock/renew/selectInstance",
        method: "post",
        data
      });
    },
    // 产品续费提交
    cloudRenew({ commit, state }, data) {
      return request({
        url: "/scEcsStock/renew/instance",
        method: "post",
        data
      });
    },
    // 产品自动续费提交
    cloudAutoRenew({ commit, state }, data) {
      return request({
        url: `/corporation/ecsStock/automatic/${data.id}`,
        method: "patch",
        data
      });
    },
  }
};

export default renewcloud;
