import request from "@/utils/request";

const organization = {
  namespaced: true,
  state: {},

  mutations: {},

  actions: {
    // 获取角色列表
    getRoleList({ commit, state }, params) {
      return request({
        url: "/role",
        method: "get",
        params
      });
    },
    // 新增角色
    addRole({ commit, state }, data) {
      return request({
        url: "/role",
        method: "post",
        data
      });
    },
    // 编辑角色
    editRole({ commit, state }, data) {
      return request({
        url: `/role/${data.id}`,
        method: "patch",
        data
      });
    },
    // 删除角色
    delRole({ commit, state }, data) {
      return request({
        url: `/role/${data.id}`,
        method: "delete"
      });
    },
    // 获取角色详情
    getRoleDetail({ commit, state }, params) {
      return request({
        url: `/role/${params.id}`,
        method: "get"
      });
    },
    // 获取当前角色权限map数据
    getRolePermMap({ commit, state }) {
      return request({
        url: `/imPermissions/getByUserCode`,
        method: "get"
      });
    },
    // 角色关联权限资源
    roleRelationPerm({ commit, state }, data) {
      return request({
        url: "/rolePermissions",
        method: "post",
        data
      });
    },
    // 获取子账号列表
    getAccountList({ commit, state }, data) {
      return request({
        url: "/user/getAdminUsers",
        method: "post",
        data
      });
    },
    // 新增子账号
    addAccount({ commit, state }, data) {
      return request({
        url: "/user/createUser",
        method: "post",
        data
      });
    },
    // 编辑子账号
    editAccount({ commit, state }, data) {
      return request({
        url: `/user/updateAdminUsers`,
        method: "post",
        data
      });
    },
    // 冻结/解冻子账号
    editAccountStatus({ commit, state }, data) {
      return request({
        url: `/user/updateStatus`,
        method: "post",
        data
      });
    }
  }
};

export default organization;
