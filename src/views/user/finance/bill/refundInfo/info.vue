<template>
  <div>
    <DetailHeader title="退票申请详情" />
    <div class="bill-info" v-if="data">
      <a-descriptions style="margin: 20px 0" title="申请信息">
        <a-descriptions-item label="发票ID">
          {{ data.invoiceNo }}
        </a-descriptions-item>
        <a-descriptions-item label="开具类型">
          {{ issueTypeMap[data.invoiceInfo.issueType] }}
        </a-descriptions-item>
        <a-descriptions-item label="发票类型">
          {{ invoiceTypeMap[data.invoiceInfo.invoiceType] }}
        </a-descriptions-item>
        <a-descriptions-item label="发票抬头">
          {{ data.invoiceInfo.invoiceTitle }}
        </a-descriptions-item>
        <a-descriptions-item label="税务登记号">
          {{ data.invoiceInfo.registerNo }}
        </a-descriptions-item>
        <a-descriptions-item label="退票申请状态">
          {{ invoiceStatusEnum[data.status] }}
        </a-descriptions-item>
        <a-descriptions-item label="开票金额">
          ￥{{ data.invoiceAmount }}
        </a-descriptions-item>
        <a-descriptions-item label="退票申请时间">
          {{ data.refundCreateTimeShow }}
        </a-descriptions-item>
        <a-descriptions-item label="备注">
          {{ data.refundRemark }}
        </a-descriptions-item>
        <a-descriptions-item label="退票申请反馈时间">
          {{ data.refundFeedbackTimeShow }}
        </a-descriptions-item>
        <a-descriptions-item label="退票申请反馈说明">
          {{ data.refundFeedbackRemark }}
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions style="margin: 20px 0" title="物流信息">
        <a-descriptions-item label="物流单号">
          {{ data.expressDelivery }}
        </a-descriptions-item>
        <a-descriptions-item label="寄件联系人">
          {{ data.sender }}
        </a-descriptions-item>
        <a-descriptions-item label="联系电话">
          {{ data.senderPhone }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div>
      <h2 style="margin: 20px 0">开票明细</h2>
      <a-table
        :columns="columns"
        :data-source="dataDetails"
        :pagination="paginationProps"
        rowKey="id"
      >
        <div slot="canInvoiceAmount" slot-scope="text, record">
          <span v-if="record.consumptionType === 2">
            {{ record.debtAmount }}
          </span>
          <span v-if="record.consumptionType === 1">
            {{ record.canInvoiceAmount }}
          </span>
        </div>

        <div v-if="text" slot="createTime" slot-scope="text">
          {{ text | formatDate }}
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import DetailHeader from "@/components/Common/detailHeader.vue";
import { invoiceStatusEnum } from "@/utils/enum.js";
export default {
  components: {
    DetailHeader
  },
  data() {
    return {
      data: null,
      invoiceStatusEnum,
      columns: [
        {
          title: "订单ID",
          dataIndex: "orderNo"
        },
        {
          title: "类型",
          dataIndex: "type"
        },
        {
          title: "产品名称",
          dataIndex: "productName"
        },
        {
          title: "开票金额",
          dataIndex: "canInvoiceAmount",
          scopedSlots: {
            customRender: "canInvoiceAmount"
          }
        },
        {
          title: "订单创建时间",
          dataIndex: "createTimeShow"
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
      issueTypeMap: {
        1: "个人",
        2: "企业"
      },
      invoiceTypeMap: {
        1: "增值税普通发票",
        2: "增值税专用发票"
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
      dataDetails: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.$store
        .dispatch("billapply/getInvoiceInfo", { id: this.$route.query.id })
        .then((res) => {
          console.log(res, "---------");
          this.data = res.data;
          this.dataDetails = res.data.invoiceEvaluatePage.list;
          this.paginationProps.total =
            res.data.invoiceEvaluatePage.totalCount * 1;
        });
    },
    //表格分页跳转
    quickJump(currentPage) {
      this.listQuery.currentPage = currentPage;
      this.getData();
    },
    //表格分页切换每页条数
    onShowSizeChange(current, pageSize) {
      this.listQuery.currentPage = current;
      this.listQuery.pageSize = pageSize;
      this.getData();
    }
  }
};
</script>

<style lang="less" scoped>
.bill-info {
  margin: 30px 0;
}
</style>
