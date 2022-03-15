<template>
  <div>
    <h3>发票申请</h3>
    <div class="top-select">
      <a-button type="primary" icon="plus">合并开票</a-button>
      <a-input
        style="width: 150px; margin-left: 10px"
        placeholder="请输入订单ID"
      />
      <a-date-picker
        style="margin-left: 10px"
        v-model="startValue"
        :disabled-date="disabledStartDate"
        show-time
        format="YYYY-MM-DD HH:mm:ss"
        placeholder="创建开始时间"
        @openChange="handleStartOpenChange"
      />
      --
      <a-date-picker
        v-model="endValue"
        :disabled-date="disabledEndDate"
        show-time
        format="YYYY-MM-DD HH:mm:ss"
        placeholder="创建结束时间"
        :open="endOpen"
        @openChange="handleEndOpenChange"
      />
      <a-button style="margin-left: 10px" type="primary">查询</a-button>
    </div>
    <div>
      <a-table
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        :columns="columns"
        :data-source="data"
      >
        <div slot="companyName" slot-scope="text">{{ text }}</div>
        <div slot="action">
          <a-button type="link">申请开票</a-button>
          <a-button type="link">查看详情</a-button>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startValue: null,
      endValue: null,
      endOpen: false,
      data: [],
      selectedRowKeys: [], // Check here to configure the default column
      columns: [
        {
          title: "订单ID",
          dataIndex: "id",
          scopedSlots: { customRender: "id" }
        },
        {
          title: "产品名称",
          dataIndex: "name"
        },
        {
          title: "可开票金额",
          dataIndex: "amount"
        },
        {
          title: "订单创建时间",
          dataIndex: "createTime"
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ]
    };
  },
  watch: {
    startValue(val) {
      console.log("startValue", val);
    },
    endValue(val) {
      console.log("endValue", val);
    }
  },
  methods: {
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    }
  }
};
</script>

<style lang="less" scoped>
.top-select {
  margin: 20px 0;
}
</style>
