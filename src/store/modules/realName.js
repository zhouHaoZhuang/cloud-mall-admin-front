import request from "@/utils/request";

const income = {
  namespaced: true,
  actions: {
    // 实名认证接口
    realName({
      commit,
      state
    }, data) {
      return request({
        url: "/authentication/checkFace",
        method: "post",
        data,
      })
    },

    // 获取余额接口
    getBalance({ commit, state }, id) {
      console.log(state);
      return request({
        url: `/tcOrder`,
        method: "get"
      });
    }
  },
};

export default income;