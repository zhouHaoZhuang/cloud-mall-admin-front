import request from "@/utils/request";

const withdraw = {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    //------------------------向瑶池申请
    // 查询提现申请记录
    getRecordList({ commit, state }, params) {
      return request({
        url: "/pcWithdrawRecord",
        method: "get",
        params
      });
    },
    // 新增申请
    addRecord({ commit, state }, data) {
      return request({
        url: "/pcWithdrawRecord",
        method: "post",
        data
      });
    },
    // 编辑申请
    editRecord({ commit, state }, data) {
      return request({
        url: `/pcWithdrawRecord/patchUserWithdraw/${data.id}`,
        method: "patch",
        data
      });
    },
    // 删除提现申请
    delRecord({ commit, state }, id) {
      return request({
        url: `/pcWithdrawRecord/${id}`,
        method: "delete"
      });
    },
    //获取提现申请详情
    getRecordDetail({ commit, state }, id) {
      return request({
        url: `/pcWithdrawRecord/${id}`,
        method: "get"
      });
    },
  }
};

export default withdraw;
