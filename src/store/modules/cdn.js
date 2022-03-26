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
    // 获取加速域名的基础配置
    getDomainBasicConfig({ commit, state }, data) {
      return request({
        url: "/aliyun/cdn/describeCdnDomainDetail",
        method: "post",
        data
      });
    },
    // 修改加速区域
    updateScopeArea({ commit, state }, data) {
      return request({
        url: "/aliyun/cdn/modifyCdnDomainSchdmByProperty",
        method: "post",
        data
      });
    },
    // 新增+编辑+删除源站信息
    updateSourceInfo({ commit, state }, data) {
      return request({
        url: "/aliyun/cdn/modifyCdnDomain",
        method: "post",
        data
      });
    },
    // 获取加速域名的配置信息
    getDomainConfig({ commit, state }, data) {
      return request({
        url: "/aliyun/cdn/describeCdnDomainConfigs",
        method: "post",
        data
      });
    },
    // 单独删除指定域名的指定配置
    delAloneConfig({ commit, state }, data) {
      return request({
        url: "/aliyun/cdn/deleteSpecificConfig",
        method: "post",
        data
      });
    },
    // 保存指定配置
    saveConfig({ commit, state }, data) {
      return request({
        url: "/aliyun/cdn/batchSetCdnDomainConfig",
        method: "post",
        data
      });
    }
  }
};

export default cdn;
