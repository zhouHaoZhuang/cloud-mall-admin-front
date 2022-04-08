import request from "@/utils/request";

const snapshoot = {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    // 快照表接口
    getList({ commit, state }, params) {
      return request({
        url: "/scSnapshot",
        method: "get",
        params
      });
    },
    // 创建快照
    add({ commit, state }, data) {
      return request({
        url: "/scSnapshot",
        method: "post",
        data
      });
    },
    // 回滚
    resetDisk({ commit, state }, data) {
      return request({
        url: `/aliyun/snapshot/resetDisk`,
        method: "post",
        data
      });
    },
    // 删除
    del({ commit, state }, ids) {
      return request({
        url: `/scSnapshot/${ids}`,
        method: "delete"
      });
    },
  // 查询云盘数据
  getDescribeDisks({ commit, state }, data) {
    return request({
      url: "/aliEcs/getDescribeDisks",
      method: "post",
      data
    });
  },
  }
};

export default snapshoot;
