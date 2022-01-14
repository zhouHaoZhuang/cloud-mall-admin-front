import request from '@/utils/request';

const message = {
  namespaced: true,
  state: {},

  mutations: {},
  actions: {
    // 获取列表
    getList({ commit, state }, params) {
      return request({
        url: '/messageRecord',
        method: 'get',
        params,
      });
    },
    //  修改详细状态为已读
    changeList({ commit, state }, data) {
      return request({
        url: `/messageRecord/update/${data.id}`,
        method: 'patch',
        data,
      });
    },

    getOne({ commit, state }, params) {
      // console.log(params,'params');
      return request({
        url: `/messageRecord/${params.id}`,
        method: 'get',
      });
    },
  },
};

export default message;
