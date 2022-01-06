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
    // 服务器实例操作-启动-关机-重启
    cloudActions({ commit, state }, data) {
      return request({
        url: "/aliEcs/operateEcs",
        method: "post",
        data
      });
    },
    // 修改服务器实例信息-主机名-密码-实例名称
    updateCloudInfo({ commit, state }, data) {
      return request({
        url: "/aliEcs/modifyInstanceAttribute",
        method: "post",
        data
      });
    },
    // 获取服务器实例运行状态
    getCloudRunStatus({ commit, state }, data) {
      return request({
        url: "/aliEcs/queryEcsStatus",
        method: "post",
        data
      });
    },
    // 查询云服务器系统镜像
    getSystemList({ commit, state }, params) {
      return request({
        url: "/index/query/images",
        method: "get",
        params
      });
    },
    // 重装系统
    reloadSystem({ commit, state }, data) {
      return request({
        url: "/aliEcs/replaceSystemDisk",
        method: "post",
        data
      });
    },
    // 查询当前实例监控插件运行状态
    getMonitorStatus({ commit, state }, data) {
      return request({
        url: "/aliEcs/describeMonitoringAgentStatuses",
        method: "post",
        data
      });
    },
    // 安装监控插件
    installMonitor({ commit, state }, data) {
      return request({
        url: "/aliEcs/installMonitoringAgent",
        method: "post",
        data
      });
    },
    // 查询监控数据
    getMonitorData({ commit, state }, data) {
      return request({
        url: "/aliEcs/describeMetricList",
        method: "post",
        data
      });
    },
    // 获取单个地域对应的cpu信息
    getAddressCpu({ commit, state }, params) {
      return request({
        url: `/index/query/property/value/${params.regionId}`,
        method: "get",
        params
      });
    },
    // 获取单个地域对应的内存信息
    getAddressDisk({ commit, state }, params) {
      return request({
        url: "/index/query/property/memory",
        method: "get",
        params
      });
    }
  }
};

export default cloud;
