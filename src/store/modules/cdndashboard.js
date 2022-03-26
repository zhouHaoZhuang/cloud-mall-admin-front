import request from "@/utils/request";
// 发票信息管理相关接口
const cdndashboard = {
  namespaced: true,
  actions: {
    // 获取流量排行
    getList({ commit, state},params ) {
      return request({
				url: "/invoiceInfo",
				method: "get",
				params,
			})
    },
		// 获取单个信息
    getOne({ commit, state }, data) {
      return request({
        url: `/invoiceInfo/${data.id}`,
        method: "get"
      });
    },
    // 添加
    add({ commit, state }, data) {
      return request({
        url: "/invoiceInfo",
        method: "post",
        data
      });
    },
    // 修改
    edit({ commit, state }, data) {
      return request({
        url: `/invoiceInfo/${data.id}`,
        method: "patch",
        data
      });
    },
    setDefault({ commit, state }, data) {
      return request({
        url: `/invoiceInfo/default/${data.id}`,
        method: "post"
      });
    },
    // 删除
    del({ commit, state }, data) {
      return request({
        url: `/invoiceInfo/delete`,
        method: "delete",
        data
      });
    }
  },
};

export default cdndashboard;
