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
    getList({ commit, state }, params) {
      return request({
        url: `customerAccountLog`,
        method: "get",
        params,
        // pay:true
      });
    },
  
    selectList({ commit, state }, params){
      return request({
        url: `/customerAccountLog?key=createTime&search=${params.startTime}&currentPage=1&pageSize=10&total=0&qp-createTime-gt=${params.startTime}&qp-createTime-lt=${params.endTime}`,
        method: "get",
        params,
        // pay:true
      });
    },
  }
};

export default finance;
