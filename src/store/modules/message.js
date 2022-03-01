import request from '@/utils/request';

const message = {
  namespaced: true,
  state: {},

  mutations: {},
  actions: {
    // 获取列表
    getList({ commit, state }, params) {
      return request({
        url: '/imMessageRecord',
        method: 'get',
        params,
      });
    },
    //  修改详细状态为已读
    changeList({ commit, state }, data) {
      return request({
        url: `/imMessageRecord/update/${data.id}`,
        method: 'patch',
        data,
      });
    },
    // 全部已读接口
    readAll({ commit, state }, params) {
      return request({
        url: '/imMessageRecord/updateAll',
        method: 'get',
        params,
      });
    },
    getOne({ commit, state }, params) {
      // console.log(params,'params');
      return request({
        url: `/imMessageRecord/${params.id}`,
        method: 'get',
      });
    },
  },
};

export default message;
