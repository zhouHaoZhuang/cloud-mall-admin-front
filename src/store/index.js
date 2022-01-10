import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import modules from "./modules";
import getters from "./getters";

Vue.use(Vuex);
// 配置需要持久化的模块
const PERSIST_PATHS = ["setting", "user.token"];
const store = new Vuex.Store({
  modules,
  getters,
  plugins: [
    createPersistedState({
      paths: PERSIST_PATHS
    })
  ] // 数据持久化
});

export default store;
