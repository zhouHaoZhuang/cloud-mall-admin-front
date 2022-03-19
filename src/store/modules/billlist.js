import request from "@/utils/request";
// 发票列表相关接口
const billlist = {
  namespaced: true,
  actions: {
    // 获取
    getList({ commit, state},params ) {
      return request({
				url: "/pcOfflineRecharge/user",
				method: "get",
				params,
			})
    },
		// 获取
    getOne({ commit, state }, id) {
      console.log(state);
      return request({
        url: `/pcOfflineRecharge/detailed/${id}`,
        method: "get"
      });
    },
    // 添加常用地址
    add({ commit, state }, params) {
      return request({
        url: "/pcOfflineRecharge/user",
        method: "post",
        data: params
      });
    },
    // 修改常用地址
    edit({ commit, state }, params) {
      return request({
        url: `/pcOfflineRecharge/user/${params.id}`,
        method: "put",
        data: params
      });
    },
    // 删除常用地址
    del({ commit, state }, id) {
      return request({
        url: `/pcOfflineRecharge/user/${id}`,
        method: "delete"
      });
    }
  },
};

export default billlist;
