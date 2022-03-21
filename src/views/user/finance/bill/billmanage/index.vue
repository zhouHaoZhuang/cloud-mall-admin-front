<template>
  <div>
    <h3>发票信息管理</h3>
    <div>
      <a-button
        @click="$router.push('/user/finance/bill/addBillInfo')"
        type="primary"
        icon="plus"
        style="margin: 10px 0 20px"
      >
        新增发票信息
      </a-button>
    </div>
    <div>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="paginationProps"
        rowKey="id"
      >
        <div slot="issueType" slot-scope="text">{{ issueTypeMap[text] }}</div>
        <div slot="invoiceType" slot-scope="text">
          {{ invoiceTypeMap[text] }}
        </div>
        <div slot="action" slot-scope="text, record">
          <a-button
            type="link"
            @click="
              $router.push(`/user/finance/bill/addBillInfo?id=${record.id}`)
            "
          >
            编辑
          </a-button>
          <a-button type="link" @click="delbillInfo(record.id)">删除</a-button>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      columns: [
        {
          title: "发票抬头",
          dataIndex: "invoiceTitle"
        },
        {
          title: "开具类型",
          dataIndex: "issueType",
          scopedSlots: { customRender: "issueType" }
        },
        {
          title: "发票类型",
          dataIndex: "invoiceType",
          scopedSlots: { customRender: "invoiceType" }
        },
        {
          title: "税务登记号",
          dataIndex: "registerNo"
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      listQuery: {
        key: "",
        search: "",
        currentPage: 1,
        pageSize: 10,
        total: 0
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
      issueTypeMap: {
        1: "个人",
        2: "企业"
      },
      invoiceTypeMap: {
        1: "增值税普通发票",
        2: "增值税专用发票"
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 删除
    delbillInfo(id) {
      this.$confirm({
        title: "确认要删除发票信息吗？",
        onOk: () => {
          this.$store.dispatch("billnews/del", { ids: id }).then(() => {
            this.$message.success("删除成功");
            this.getList();
          });
        }
      });
    },
    //查询数据表格
    getList() {
      this.$store.dispatch("billnews/getList", this.listQuery).then((res) => {
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

<style></style>
