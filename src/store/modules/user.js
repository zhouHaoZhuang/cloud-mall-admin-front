import request from "@/utils/request";
const { AuthenticationClient } = require("authing-js-sdk");
import env from "@/config/env";

const user = {
  namespaced: true,
  state: {
    token: "",
    userInfo: {},
    perms: [],
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = { ...userInfo };
    },
    SET_PERMS: (state, perms) => {
      state.perms = [...perms];
    },
  },

  actions: {
    // 登录
    login({ commit, state, dispatch }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: "/user/loginByUsername",
          method: "post",
          data,
        })
          .then((res) => {
            const token = res.data.token;
            commit("SET_TOKEN", token);
            dispatch("getUserInfo");
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 登录后获取当前用户的权限数据
    getUserPerms({ commit, state }) {
      return new Promise((resolve, reject) => {
        request({
          url: `/user/listAuthorizedResources`,
          method: "get",
        })
          .then((res) => {
            commit("SET_PERMS", res.data.list);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 登出
    logout({ commit, state }) {
      return new Promise((resolve) => {
        commit("SET_TOKEN", "");
        commit("SET_USERINFO", {});
        commit("SET_PERMS", []);
        // const authenticationClient = new AuthenticationClient({
        //   appId: env.appId,
        //   appHost: env.appHost,
        //   token: state.token
        // });
        // authenticationClient.logout();
        resolve();
      });
    },
    // 发送验证码
    sendCode({ commit, state }, data) {
      return request({
        url: "/sms/sendSms",
        method: "post",
        data,
      });
    },
    // 修改密码
    changePassword({ commit, state }, data) {
      return request({
        url: "/user/updatePassword",
        method: "post",
        data,
      });
    },
    // 绑定邮箱
    emailBinding({ commit, state }, email) {
      return request({
        url: `/user/bindEmail/${email}`,
        method: "get",
      });
    },
    // 获取用户真实信息
    getUserActualName({ commit, state }, data) {
      return request({
        url: "/ccCorporation/getByToken",
        method: "get",
        data,
      });
    },
    // 获取公司信息
    getCompanyInfo({ commit, state }, data) {
      return request({
        url: "/ccCompanyInfo/getOne",
        method: "get",
        data,
      });
    },
    // 获取用户信息
    getUserInfo({ commit, state }) {
      const authenticationClient = new AuthenticationClient({
        appId: env.appId,
        appHost: env.appHost,
        token: state.token,
      });
      authenticationClient.getCurrentUser().then((user) => {
        // console.log("查看信息", user);
        commit("SET_USERINFO", {
          ...user,
          // username: user.username.substring(0, 11)
        });
      });
    },
  },
};

export default user;
