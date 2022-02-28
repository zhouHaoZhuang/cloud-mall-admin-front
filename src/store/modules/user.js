import request from "@/utils/request";

const user = {
  namespaced: true,
  state: {
    token: "",
    userInfo: {},
    userRealInfo: {},
    perms: [],
    allConfig: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = { ...userInfo };
    },
    SET_ALLCONFIG: (state, allConfig) => {
      state.allConfig = { ...allConfig };
    },
    SET_USERREALINFO: (state, userRealInfo) => {
      state.userRealInfo = { ...userRealInfo };
    },
    SET_PERMS: (state, perms) => {
      state.perms = [...perms];
    }
  },

  actions: {
    // 登录
    login({ commit, state, dispatch }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: "/user/loginByUsername",
          method: "post",
          data
        })
          .then((res) => {
            const token = res.data.token;
            commit("SET_TOKEN", token);
            dispatch("getUserInfo");
            dispatch("getUserActualName");
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 登录后获取当前用户的权限数据
    getUserPerms({ commit, state }) {
      commit("SET_PERMS", [{ code: "*:*" }]);
      // return new Promise((resolve, reject) => {
      //   request({
      //     url: `/user/listAuthorizedResources`,
      //     method: "get"
      //   })
      //     .then((res) => {
      //       commit("SET_PERMS", [{ code: "*:*" }]);
      //       resolve();
      //     })
      //     .catch((error) => {
      //       reject(error);
      //     });
      // });
    },
    // 登出
    logout({ commit, state }) {
      return new Promise((resolve) => {
        commit("SET_TOKEN", "");
        commit("SET_USERINFO", {});
        commit("SET_PERMS", []);
        resolve();
      });
    },
    // 发送验证码
    sendCode({ commit, state }, data) {
      return request({
        url: "/sms/sendSms",
        method: "post",
        data
      });
    },
    // 修改密码
    changePassword({ commit, state }, data) {
      return request({
        url: "/user/updatePassword",
        method: "post",
        data
      });
    },
    // 向邮箱发送验证码
    sendEmail({ commit, state }, data) {
      return request({
        url: `/sms/getCodeByEmail`,
        method: "post",
        data
      });
    },
    // 绑定邮箱
    emailBinding({ commit, state }, data) {
      return request({
        url: `/user/bindEmail`,
        method: "post",
        data
      });
    },
    // 获取用户真实信息
    getUserActualName({ commit, state }) {
      return new Promise((resolve, reject) => {
        request({
          url: "/ccCorporation/getByToken",
          method: "get"
        })
          .then((res) => {
            commit("SET_USERREALINFO", {
              ...res.data
            });
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 获取其他全局配置
    getAllConfig({ commit, state }) {
      return new Promise((resolve, reject) => {
        request({
          url: "/ccConfigRelation/selectCcConfigConfigRelation",
          method: "get"
        })
          .then((res) => {
            commit("SET_ALLCONFIG", {
              ...res.data
            });
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 获取公司信息
    getCompanyInfo({ commit, state }, data) {
      return request({
        url: "/ccCompanyInfo/getOne",
        method: "get",
        data
      });
    },
    // 获取用户信息
    getUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        request({
          url: "/uc/getByToken",
          method: "get"
        })
          .then((res) => {
            commit("SET_USERINFO", res.data);
            resolve(res.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  }
};

export default user;
