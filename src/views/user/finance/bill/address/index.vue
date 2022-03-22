<template>
  <div>
    <DetailHeader title="修改地址" />
    <div class="address-info">
      <a-descriptions style="margin: 30px 0" title="申请信息">
        <a-descriptions-item label="发票ID">
          FP20220314001
        </a-descriptions-item>
        <a-descriptions-item label="开具类型"> 企业 </a-descriptions-item>
        <a-descriptions-item label="发票类型">
          增值税专用发票
        </a-descriptions-item>
        <a-descriptions-item label="发票抬头"> 上海市公司 </a-descriptions-item>
        <a-descriptions-item label="税务登记号">
          910004565465465
        </a-descriptions-item>
        <a-descriptions-item label="申请状态"> 已提交 </a-descriptions-item>
        <a-descriptions-item label="开票金额"> ￥500.00 </a-descriptions-item>
        <a-descriptions-item label="申请时间"> 2016-09-21 </a-descriptions-item>
      </a-descriptions>
      <a-descriptions title="原收件人信息">
        <a-descriptions-item label="收件人"> 王富贵 </a-descriptions-item>
        <a-descriptions-item label="联系电话">
          15000000000000
        </a-descriptions-item>
        <a-descriptions-item label="地址">
          上海市/黄浦区/华新街道/华新路
        </a-descriptions-item>
        <a-descriptions-item label="详细地址"> 上海市虹桥 </a-descriptions-item>
      </a-descriptions>
    </div>
    <div>
      <h3 class="new-adress">选择新的地址</h3>
      <div>
        <a-table
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange
          }"
          :columns="columns"
          :data-source="data"
          :pagination="paginationProps"
          rowKey="id"
        >
          <div slot="companyName" slot-scope="text">{{ text }}</div>
          <div slot="action">
            <a-button type="link">编辑</a-button>
          </div>
        </a-table>
      </div>
    </div>
    <a-button type="link" icon="plus"> 新增常用地址 </a-button>
    <div style="text-align: center; margin-top: 20px">
      <a-button type="primary"> 保存提交 </a-button>
    </div>
  </div>
</template>

<script>
import DetailHeader from "@/components/Common/detailHeader.vue";

export default {
  components: {
    DetailHeader
  },
  data() {
    return {
      data: [],
      selectedRowKeys: [],
      columns: [
        {
          title: "收件人",
          dataIndex: "companyName",
          key: "companyName",
          width: "20%"
        },
        {
          title: "联系电话",
          dataIndex: "phone",
          key: "phone",
          width: "20%"
        },
        {
          title: "地址",
          dataIndex: "address",
          key: "address",
          width: "20%"
        },
        {
          title: "详细地址",
          dataIndex: "detailAddress",
          key: "detailAddress",
          width: "20%"
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          scopedSlots: {
            customRender: "action"
          }
        }
      ],
      listQuery: {
        key: "",
        search: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
        status: "",
        startTime: "",
        endTime: "",
        accountType: ""
      },
      paginationProps: {
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total, range) =>
          `共 ${total} 条记录 第 ${this.listQuery.currentPage} / ${Math.ceil(
            total / this.listQuery.pageSize
          )} 页`,
        onChange: this.quickJump,
        onShowSizeChange: this.onShowSizeChange
      }
    };
  },
  methods: {
    // 选择收货信息
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //查询数据表格
    getList() {
      this.$getListQp("word/getList", this.listQuery).then(res => {
        console.log(res);
        this.data = [...res.data.list];
        this.paginationProps.total = res.data.totalCount * 1;
      });
    },
    //表格分页跳转
    quickJump(currentPage) {
      this.listQuery.currentPage = currentPage;
      this.getList();
    },
    //表格分页切换每页条数
    onShowSizeChange(current, pageSize) {
      this.listQuery.currentPage = current;
      this.listQuery.pageSize = pageSize;
      this.getList();
    }
  }
};
</script>

<style lang="less" scoped>
.address-info {
  margin: 30px 0;
}
.new-adress {
  margin: 20px 0;
  font-weight: 600;
}
</style>
