<template>
  <div>
    <h2><a-icon type="left" @click="$router.back()"/><span class="message">消息中心</span></h2>
    <p class="all-types">全部类型</p>
    <div class="action-button">
      <a-button class="mark-read">标记已读</a-button>
      <a-button>全部已读</a-button>
    </div>
    <div>
      <a-table
        :columns="columns"
        :data-source="data"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
      >
        <a slot="name" slot-scope="text">{{ text }}</a>
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
          title: "标题",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "发送时间",
          dataIndex: "gmtCreate",
        },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
			selectedRowKeys: [],
    };
  },
	methods: {
		onSelectChange(selectedRowKeys) {
			console.log('selectedRowKeys changed: ', selectedRowKeys);
			this.selectedRowKeys = selectedRowKeys;
		},
	},
};
</script>

<style lang='less' scoped>
.message{
	margin-left: 10px;
}
.all-types{
	margin:20px 0;
	height: 38px;
	line-height: 38px;
	padding-left: 20px;
	background-color: #f0f3f5;
}
.action-button{
	width: 100%;
	margin-bottom: 10px;
	.mark-read{
		margin: 10px;

	}
}
</style>
