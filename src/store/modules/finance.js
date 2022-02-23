import request from "@/utils/request";

const finance = {
  namespaced: true,
  state: {
    poolList: [],
    userInfo: {}
  },

  mutations: {
    SET_POOL: (state, poolList) => {
      state.poolList = poolList;
      // console.log(state.poolList,'state');
    }
  },

  actions: {
    // 获取列表
    getList({ commit, state }, data) {
      return request({
        url: `/customerAccountLog/channel`,
        method: "post",
        data
      });
    },
    selectList({ commit, state }, params) {
      return request({
        url: `/customerAccountLog?key=createTime&search=${params.startTime}&currentPage=1&pageSize=10&total=0&qp-createTime-gt=${params.startTime}&qp-createTime-lt=${params.endTime}`,
        method: "get",
        params
      });
    },
    // 充值
    recharge({ commit, state }, data) {
      return request({
        url: "/idcPay/onlineTopUp",
        method: "post",
        data
      });
    },
    // 支付前查询余额和价格
    getUserBalance({ commit, state }, data) {
      return request({
        url: "/tcMergeOrder/queryPayBalanceDetail",
        method: "post",
        data
      });
    },
    // 支付宝支付
    aliPay({ commit, state }, data) {
      return request({
        url: "/tcOrder/confirmOrderAndPay",
        method: "post",
        data
      });
    }
  }
};

export default finance;
