import request from "@/utils/request";

const cdn = {
  namespaced: true,
  state: {},

  mutations: {},

  actions: {
    // 获取域名列表
    getDomainList({ commit, state }, params) {
      return request({
        url: "/cdnDomain",
        method: "get",
        params
      });
    },
    // 校验域名归属权
    checkDomainAscription({ commit, state }, data) {
      return request({
        url: "/cdnDomain/verifyCdnDomain",
        method: "post",
        data
      });
    },
    // 创建域名
    createDomain({ commit, state }, data) {
      return request({
        url: "/cdnDomain",
        method: "post",
        data
      });
    },
    // 启用+批量
    changeDomainOpen({ commit, state }, data) {
      return request({
        url: `/aliyun/cdn/batchStartCdnDomain`,
        method: "post",
        data
      });
    },
    // 停用+批量
    changeDomainOff({ commit, state }, data) {
      return request({
        url: `/aliyun/cdn/batchStopCdnDomain`,
        method: "post",
        data
      });
    },
    // 删除+批量
    delDomain({ commit, state }, data) {
      return request({
        url: `/cdnDomain/${data.ids}`,
        method: "delete"
      });
    },
    // 查询地域列表
    addressList({ commit, state }) {
      return request({
        url: "/index/query/region",
        method: "get"
      });
    },
    // 查询分类列表
    typeList({ commit, state }) {
      return request({
        url: "/index/getSpecFamily",
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
        url: `/scEcsStock/query/modify/cpu`,
        method: "get",
        params
      });
    },
    // 获取单个地域对应的内存信息
    getAddressDisk({ commit, state }, params) {
      return request({
        url: "/scEcsStock/query/modify/memory",
        method: "get",
        params
      });
    },
    // 获取对应的实例和实例属性，属性值
    getRegionDetail({ commit, state }, params) {
      return request({
        url: "/scEcsStock/query/modify/instance",
        method: "get",
        params
      });
    },
    // 服务器升级配置询价
    getcloudUpgradePrice({ commit, state }, data) {
      return request({
        url: "/scEcsStock/modify/selectInstance",
        method: "post",
        data
      });
    },
    // 服务器升级配置提交
    cloudUpgrade({ commit, state }, data) {
      return request({
        url: "/scEcsStock/modify/prepay/instance",
        method: "post",
        data
      });
    }
  }
};

export default cdn;
