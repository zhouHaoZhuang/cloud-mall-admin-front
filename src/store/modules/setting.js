export default {
  namespaced: true,
  state: {
    menuOpen: true,
    leftOpen: true,
    menuData: [],
    leftMenuData: {},
    beforePath: "",
    filterList: ["/dashboard"],
    leftOpenShow: true,
    selectItemPath: "",
    selectLeftPath: ""
  },
  mutations: {
    // 设置左侧side菜单数据
    setMenuData(state, menuData) {
      state.menuData = menuData;
    },
    // 折叠最最最左侧菜单
    setOpenMenu(state, menuOpen) {
      state.menuOpen = menuOpen;
    },
    // 折叠/打开左侧二级菜单
    setLeftOpen(state, leftOpen) {
      state.leftOpen = leftOpen;
    },
    // 设置主体左侧菜单
    setLeftMenuData(state, leftMenuData) {
      state.leftMenuData = leftMenuData;
    },
    // 设置路由前缀，方便三级，四级菜单跳转
    setBeforePath(state, beforePath) {
      state.beforePath = beforePath;
    },
    // 设置主题左侧开关按钮是否展示
    setLeftShow(state, leftOpenShow) {
      state.leftOpenShow = leftOpenShow;
    },
    // side左侧菜单点击后保存点击后的路径实现选中功能
    setMenuSelectPath(state, selectItemPath) {
      state.selectItemPath = selectItemPath;
    },
    // 左侧三级菜单点击后保存点击后的路径实现选中功能
    setLeftMenuSelectPath(state, selectLeftPath) {
      state.selectLeftPath = selectLeftPath;
    }
  },
  actions: {
    // side左侧菜单点击后保存点击后的路径实现选中功能
    changeSelectPath({ commit, state }, data) {
      commit("setMenuSelectPath", data);
    },
    // 折叠最最最左侧菜单
    changeOpenMenu({ commit, state }, data) {
      commit("setOpenMenu", data);
    },
    // 折叠/打开左侧二级菜单
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
    },
    // 设置主题左侧开关按钮是否展示
    changeLeftMenuShow({ commit, state }, data) {
      commit("setLeftShow", data);
    }
  }
};
