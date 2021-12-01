export default {
  namespaced: true,
  state: {
    menuOpen: true,
    leftOpen: true,
    menuData: [],
    leftMenuData: {}
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
    // 设置主体左侧菜单
    setLeftMenu({ commit, state }, data) {
      commit("setLeftMenuData", data);
    }
  }
};
