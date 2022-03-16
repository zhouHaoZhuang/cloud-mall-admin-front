<template>
  <div>
    <h1>退票列表</h1>
    <div>
      <a-input style="width: 200px" placeholder="请输入发票ID进行搜索">
      </a-input>
      <a-button style="margin-left: 10px" type="primary">查询</a-button>
    </div>
    <div>
      <a-table :columns="columns" :data-source="data">
        <div slot="action" slot-scope="text">
          <a-button type="link">详情</a-button>
          <a-button type="link">取消</a-button>
          <a-button type="link">重新提交</a-button>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        {
          title: "发票ID",
          dataIndex: "id"
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
          title: "退票申请状态",
          dataIndex: "status"
        },
        {
          title: "退票申请时间",
          dataIndex: "createTime"
        },
        {
          title: "备注",
          dataIndex: "remark"
        },
        {
          title: "退票申请反馈时间",
          dataIndex: "updateTime"
        },
        {
          title: "退票申请反馈说明",
          dataIndex: "feedbackRemark"
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      data: []
    };
  }
};
</script>

<style></style>
