<template>
  <div>
    <DetailHeader title="发票申请详情" />
    <div class="bill-info">
      <a-descriptions style="margin: 20px 0" title="申请信息">
        <a-descriptions-item label="发票ID">
          FP20220314001
        </a-descriptions-item>
        <a-descriptions-item label="开具类型"> 企业 </a-descriptions-item>
        <a-descriptions-item label="发票类型">
          增值税专用发票
        </a-descriptions-item>
        <a-descriptions-item label="发票抬头">上海 </a-descriptions-item>
        <a-descriptions-item label="税务登记号">
          910004565465465
        </a-descriptions-item>
        <a-descriptions-item label="申请状态"> 已提交 </a-descriptions-item>
        <a-descriptions-item label="开票金额"> ￥500.00 </a-descriptions-item>
        <a-descriptions-item label="申请时间">
          2016-09-21 08:50:08
        </a-descriptions-item>
        <a-descriptions-item label="反馈时间">
          2016-09-21 08:50:08
        </a-descriptions-item>
        <a-descriptions-item label="反馈说明">
          阿萨德hasla
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions style="margin: 20px 0" title="收件人信息">
        <a-descriptions-item label="收件人"> 王富贵 </a-descriptions-item>
        <a-descriptions-item label="联系电话">
          15200000000000
        </a-descriptions-item>
        <a-descriptions-item label="地址">
          上海市/浦东区/陆家嘴
        </a-descriptions-item>
        <a-descriptions-item label="详细地址">上海 虹桥</a-descriptions-item>
        <a-descriptions-item label="物流单号">
          910004565465465
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div>
      <h2 style="margin: 20px 0">开票明细</h2>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="paginationProps"
        rowKey="id"
      >
      </a-table>
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
      columns: [
        {
          title: "订单ID",
          dataIndex: "orderId"
        },
        {
          title: "类型",
          dataIndex: "orderType"
        },
        {
          title: "产品名称",
          dataIndex: "productName"
        },
        {
          title: "可开票金额",
          dataIndex: "canInvoiceAmount"
        },
        {
          title: "订单创建时间",
          dataIndex: "orderCreateTime"
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
      },
    };
  },
  methods: {
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
  },
};
</script>

<style lang="less" scoped>
.bill-info {
  margin: 30px 0;
}
</style>
