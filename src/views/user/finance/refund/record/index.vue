<template>
  <div>
    <h1>退订记录</h1>
    <div class="top-menu">
      <span
        :class="{ 'top-menu-item': true, cutover: item.key == cutover }"
        v-for="item in topList"
        :key="item.key"
      >
        {{ item.title }}
      </span>
    </div>
    <div>
      <a-table
        :columns="columns"
        :data-source="data"
        :loading="loading"
        :pagination="paginationProps"
        rowKey="id"
      >
        <a slot="name" slot-scope="text">{{ text }}</a>
        <div slot="createTime" slot-scope="text">
          {{ text | formatDate }}
        </div>
        <div slot="tradeStatus" slot-scope="text">
          {{ orderStatusEnum[text] }}
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import { orderStatusEnum } from "@/utils/enum.js";

export default {
  data() {
    return {
      cutover: "0",
      orderStatusEnum,
      topList: [
        {
          title: "云服务器",
          key: "0"
        }
      ],
      data: [],
      columns: [
        {
          title: "产品名称",
          dataIndex: "productName"
        },
        {
          title: "订单编号",
          dataIndex: "orderNo"
        },
        {
          title: "IP地址",
          dataIndex: "outIp",
          key: "outIp",
          scopedSlots: {
            customRender: "outIp"
          }
        },
        {
          title: "退款金额",
          dataIndex: "amount",
          key: "amount"
        },
        {
          title: "申请日期",
          dataIndex: "createTime",
          key: "createTime",
          scopedSlots: { customRender: "createTime" }
        },
        {
          title: "退款原因",
          dataIndex: "remark",
          key: "remark"
        },
        {
          title: "状态",
          dataIndex: "tradeStatus",
          key: "tradeStatus",
          scopedSlots: { customRender: "tradeStatus" }
        }
      ],
      loading: false,
      listQuery: {
        key: "",
        currentPage: 1,
        pageSize: 10,
        total: 0
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
      this.loading = true;
      this.$getList("refund/getRecord", this.listQuery)
        .then((res) => {
          screen;
          console.log(res);
          this.data = [...res.data.list];
          this.paginationProps.total = res.data.totalCount * 1;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 表格分页快速跳转n页
    quickJump(currentPage) {
      this.listQuery.currentPage = currentPage;
      this.getList();
    },
    // 表格分页每页显示条数改变
    onShowSizeChange(current, pageSize) {
      this.listQuery.currentPage = current;
      this.listQuery.pageSize = pageSize;
      this.getList();
    }
  }
};
</script>

<style lang="less" scoped>
.top-menu {
  margin-bottom: 25px;
  background-color: #f0f3f5;
  // border-bottom: 1px solid #e1e4e6;
  .top-menu-item {
    display: inline-block;
    height: 100%;
    line-height: 50px;
    padding: 0 50px;
    margin-left: 1px;
  }
  .cutover {
    background-color: #fff;
    color: #0af;
    border-top: 4px solid #0af;
  }
}
</style>
