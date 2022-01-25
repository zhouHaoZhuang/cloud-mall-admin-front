<template>
  <div>
    <DetailHeader title = '消息中心'/>
    <p class="all-types">全部类型</p>
    <div class="action-button">
      <a-button class="mark-read" @click="haveRead" :disabled = 'selectedRowKeys.length == 0'>标记已读</a-button>
      <a-button @click="readAll">全部已读</a-button>
    </div>
    <div>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="paginationProps"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
      >
        <div slot="sendTime" slot-scope="text">
          {{ text | formatDate }}
        </div>
        <div slot="action" slot-scope="text, record">
          <a-button type="link" @click="lookOver(record.id)">查看</a-button>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import DetailHeader from '@/components/Common/detailHeader.vue';
export default {
  components: {
    DetailHeader,
  },  
  data() {
    return {
      data: [],
      paginationProps: {
        showSizeChanger: true,
        total: 1,
        showTotal: (total, range) =>
          `共 ${total} 条记录 第 ${this.listQuery.currentPage} / ${Math.ceil(
            total / this.listQuery.pageSize
          )} 页`,
        onChange: this.quickJump,
        onShowSizeChange: this.onShowSizeChange,
      },
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: '发送时间',
          dataIndex: 'sendTime',
          scopedSlots: {
            customRender: 'sendTime',
          },
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      selectedRowKeys: [],
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  created() {
    this.getMessageList();
  },
  methods: {
    // 获取选中的行
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    // 全部已读
    readAll() {
      this.$store.dispatch('message/readAll').then((val) => {
        this.$message.success('全部已读');
      });
    },
    // 标记已读
    haveRead() {
      console.log(this.selectedRowKeys);
      this.$store
        .dispatch('message/changeList', { id: this.selectedRowKeys.toString() })
        .then((val) => {
          console.log(val);
        });
    },
    // 获取消息列表
    getMessageList() {
      this.$store.dispatch('message/getList', this.listQuery).then((res) => {
        this.data = res.data.list;
        this.paginationProps.total = res.data.totalCount * 1;
        console.log(res);
      });
    },
    // 表格分页快速跳转n页
    quickJump(currentPage) {
      this.listQuery.currentPage = currentPage;
      this.getMessageList();
    },
    onShowSizeChange(current, pageSize) {
      this.listQuery.currentPage = current;
      this.listQuery.pageSize = pageSize;
      this.getMessageList();
    },
    lookOver(id) {
      this.$router.push({
        path: '/messageInfo',
        query: {
          id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.message {
  margin-left: 10px;
}
.all-types {
  margin: 20px 0;
  height: 38px;
  line-height: 38px;
  padding-left: 20px;
  background-color: #f0f3f5;
}
.action-button {
  width: 100%;
  margin-bottom: 10px;
  .mark-read {
    margin: 10px;
  }
}
</style>
