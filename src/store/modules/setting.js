export default {
  namespaced: true,
  state: {
    menuOpen: true,
    leftOpen: true,
    menuData: [],
    leftMenuData: {},
    beforePath: ""
  },
  mutations: {
    setMenuData(state, menuData) {
      state.menuData = menuData;
    },
    setOpenMenu(state, menuOpen) {
      state.menuOpen = menuOpen;
    },
    setLeftOpen(state, leftOpen) {
      state.leftOpen = leftOpen;
    },
    setLeftMenuData(state, leftMenuData) {
      state.leftMenuData = leftMenuData;
    },
    setBeforePath(state, beforePath) {
      state.beforePath = beforePath;
    }
  },
  actions: {
    // 折叠最最最左侧菜单
    changeOpenMenu({ commit, state }, data) {
      commit("setOpenMenu", data);
    },
    // 折叠左侧二级菜单
    changeLeftOpenMenu({ commit, state }, data) {
      commit("setLeftOpen", data);
    },
    // 设置路由前缀，方便三级，四级菜单跳转
    changeBeforePath({ commit, state }, data) {
      commit("setBeforePath", data);
    },
    // 设置主体左侧菜单
    setLeftMenu({ commit, state }, data) {
      commit("setLeftMenuData", data);
    }
  }
};
