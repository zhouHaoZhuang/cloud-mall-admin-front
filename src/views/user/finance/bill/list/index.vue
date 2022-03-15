<template>
  <div>
    <h3>发票列表</h3>
    <div style="margin:20px 0">
      <a-input style="width: 200px" placeholder="请输入发票ID进行搜索" />
      <a-button style="margin-left: 10px" type="primary">查询</a-button>
    </div>
    <div>
      <a-table
        :columns="columns"
        :data-source="data"
      >
        <div slot="companyName" slot-scope="text">{{ text }}</div>
        <div slot="action">
          <a-button type="link">详情</a-button>
          <a-button type="link">取消</a-button>
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
          title: "发票ID",
          dataIndex: "id",
          scopedSlots: { customRender: "id" }
        },
        {
          title: "发票抬头",
          dataIndex: "title"
        },
        {
          title: "开票金额",
          dataIndex: "amount"
        },
        {
          title: "申请状态",
          dataIndex: "status"
        },
        {
          title: "发票创建时间",
          dataIndex: "createTime"
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ]
    }
  },
};
</script>

<style></style>
