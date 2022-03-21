import request from "@/utils/request";

const mangeaddress = {
  namespaced: true,
  actions: {
    // 获取常用地址列表
    getList({ commit, state},params ) {
      return request({
				url: "/address",
				method: "get",
				params,
			})
    },
		// 获取线下充值记录详情
    getOne({ commit, state }, data) {
      return request({
        url: `/address/${data.id}`,
        method: "get"
      });
    },
    // 添加常用地址
    add({ commit, state }, data) {
      return request({
        url: "/address",
        method: "post",
        data
      });
    },
    // 修改常用地址
    edit({ commit, state }, data) {
      return request({
        url: `/address/${data.id}`,
        method: "patch",
        data
      });
    },
    // 设为默认
    setDefault({ commit, state }, data) {
      return request({
        url: `/address/defaultSign/${data.id}`,
        method: "patch"
      });
    },
    // 删除常用地址
    del({ commit, state }, params) {
      return request({
        url: `/address/deletes`,
        method: "delete",
        params
      });
    }
  },
};

export default mangeaddress;
