<template>
  <div class="record">
    <div class="search">
      <a-input-group compact enterButton="true">
        <a-select v-model="listQuery.key">
          <a-select-option value="memo"> 充值方式 </a-select-option>
        </a-select>
        <a-input-search
          style="width: 250px"
          placeholder="请输入搜索关键词"
          enter-button
          @search="onSearch"
        />
        <span class="refresh">
          <a-icon type="reload" />
        </span>
      </a-input-group>
    </div>
    <div>
      <a-table
        :columns="columns"
        :data-source="data"
        @change="handleChange"
        row-key="id"
        :pagination="paginationProps"
      >
      <div slot-scope="text" slot="createTime" v-if="text">
        {{ text | formatDate }}
      </div>
      <div slot-scope="text" slot="modifyTime" v-if="text">
        {{ text | formatDate }}
      </div>
      <div slot="channelCode" slot-scope="text">
        {{ rechargeTypeMap[text] }}
      </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import {rechargeTypeMap} from '@/utils/enum'
export default {
  data() {
    return {
      data: [],
      rechargeTypeMap,
      columns: [
        {
          title: '充值金额',
          dataIndex: 'amount',
          key: 'amount',
          sorter: (a, b) => a.amount - b.amount,
        },
        {
          title: '充值方式',
          dataIndex: 'channelCode',
          key: 'channelCode',
          scopedSlots:{
             customRender: 'channelCode',
          }
        },
        {
          title: '到账日期',
          dataIndex: 'modifyTime',
          key: 'modifyTime',
          sorter: (a, b) => {
            return (
              new Date(a.modifyTime).getTime() - new Date(b.modifyTime).getTime()
            );
          },
          scopedSlots: {
            customRender: 'modifyTime',
          },
        },
        {
          title: '充值日期',
          dataIndex: 'createTime',
          scopedSlots: {
            customRender: 'createTime',
          },
          sorter: (a, b) => {
            return (
              new Date(a.payTime).getTime() - new Date(b.payTime).getTime()
            );
          },
        },
      ],
      listQuery: {
        key: 'memo',
        search: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        sorter: '',
        memo: '',
      },
      paginationProps: {
        showQuickJumper: true,
        showSizeChanger: true,
        total: 1,
        showTotal: (total, range) =>
          `共 ${total} 条记录 第 ${this.listQuery.currentPage} / ${Math.ceil(
            total / this.listQuery.pageSize
          )} 页`,
        onChange: this.quickJump,
        onShowSizeChange: this.onShowSizeChange,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    onSearch(value) {
      // console.log(value);
      this.listQuery.memo = value;
      this.getList();
    },
    // 排序的回调
    handleChange(pagination, filters, sorter) {
      if (sorter) {
        if (sorter.columnKey == 'memo') {
          // sorter.order = sorter.order.replace('end', '') + '-' + sorter.columnKey
          console.log(sorter, '这是充值方式');
        } else if (sorter.columnKey == 'payTime') {
          console.log(sorter, '这是充值日期');
        }
      }
    },
    getList() {
      this.$store.dispatch('pay/getList', this.listQuery).then((res) => {
        this.data = res.data.list;
        this.paginationProps.total = res.data.total * 1;
      });
    },
    quickJump(current) {
      this.listQuery.currentPage = current;
      this.getList();
    },
    onShowSizeChange(current, pageSize) {
      this.listQuery.pageSize = pageSize;
      this.listQuery.currentPage = current;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.table-operations {
  margin-bottom: 16px;
}

.table-operations > button {
  margin-right: 8px;
}
.record {
  .search {
    margin-bottom: 20px;
  }
  .refresh {
    float: right;
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    border: 1px solid #d9d9d9;
    font-size: 17px;
  }
}
</style>
