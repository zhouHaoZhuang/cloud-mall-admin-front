<template>
  <div>
    <h1 class="ny-panel-title">退票列表</h1>
    <div style="margin-bottom: 20px">
      <a-input
        v-model="listQuery.invoiceNo"
        style="width: 200px"
        placeholder="请输入发票ID进行搜索"
        allowClear
      >
      </a-input>
      <a-button style="margin-left: 10px" type="primary" @click="getList()"
        >查询</a-button
      >
    </div>
    <div>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="paginationProps"
        rowKey="id"
      >
        <div slot="status" slot-scope="text">
          {{ invoiceStatusEnum[text] }}
        </div>
        <div slot="action" slot-scope="text, record">
          <a-button
            type="link"
            @click="
              $router.push('/user/finance/bill/refundInfo?id=' + record.id)
            "
          >
            详情
          </a-button>
          <a-button
            type="link"
            :disabled="record.status !== 6"
            :class="{ 'del-red': record.status === 6 }"
            @click="getCancelRefund(record.id)"
          >
            取消
          </a-button>
          <a-button
            type="link"
            v-if="record.status === 7 || record.status === 8"
            @click="$router.push('/user/finance/bill/resubmit?id=' + record.id)"
          >
            重新提交
          </a-button>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import { invoiceStatusEnum } from "@/utils/enum.js";

export default {
  data() {
    return {
      invoiceStatusEnum,
      columns: [
        {
          title: "发票ID",
          dataIndex: "invoiceNo"
        },
        {
          title: "发票抬头",
          dataIndex: "invoiceTitle"
        },
        {
          title: "开票金额",
          dataIndex: "invoiceAmount"
        },
        {
          title: "退票申请状态",
          dataIndex: "status",
          scopedSlots: {
            customRender: "status"
          }
        },
        {
          title: "退票申请时间",
          dataIndex: "refundCreateTimeShow"
        },
        {
          title: "备注",
          dataIndex: "refundRemark"
        },
        {
          title: "退票申请反馈时间",
          dataIndex: "refundFeedbackTimeShow"
        },
        {
          title: "退票申请反馈说明",
          dataIndex: "refundFeedbackRemark"
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      data: [],
      listQuery: {
        key: "",
        search: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
        invoiceNo: ""
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
  created() {
    this.getList();
  },
  methods: {
    //查询数据表格
    getList() {
      this.$getList("refundlist/getList", this.listQuery).then((res) => {
        console.log(res);
        this.data = [...res.data.list];
        this.paginationProps.total = res.data.totalCount * 1;
      });
    },
    // 取消
    getCancelRefund(id) {
      this.$confirm({
        title: "确定要取消吗?",
        onOk: () => {
          this.$store.dispatch("refundlist/getCancelRefund", id).then((res) => {
            this.$message.success("取消成功");
            console.log(res);
            this.getList();
          });
        }
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

<style>
.del-red {
  color: #d9001b;
}
</style>
