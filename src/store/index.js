import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import modules from "./modules";
import getters from "./getters";

Vue.use(Vuex);
const store = new Vuex.Store({
  modules,
  getters,
  plugins: [createPersistedState()], // 数据持久化
});

export default store;
