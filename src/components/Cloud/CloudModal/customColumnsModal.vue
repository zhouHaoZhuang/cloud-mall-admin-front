<template>
  <a-modal
    :visible="value"
    width="630px"
    centered
    title="自定义列表项"
    wrapClassName="columns-modal-container"
    okText="确定"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-row>
      <a-col
        style="margin-bottom: 20px"
        v-for="item in columns"
        :key="item.dataIndex"
        :span="6"
      >
        <a-checkbox
          :value="item.dataIndex"
          v-model="item.select"
          :disabled="item.disabled"
        >
          {{ item.title }}
        </a-checkbox>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
export default {
  // 双向绑定
  model: {
    event: "changeVisible",
    prop: "value"
  },
  props: {
    // 组件传递的值
    value: {
      type: Boolean,
      default: false
    },
    // 渲染的数据
    list: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    list: {
      handler(newVal) {
        newVal.forEach((item) => {
          const index = this.columns.findIndex(
            (ele) => ele.dataIndex === item.dataIndex
          );
          this.columns.splice(index, 1, {
            ...this.columns[index],
            select: item.select
          });
        });
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      loading: false,
      columns: [
        {
          title: "实例名称",
          dataIndex: "id",
          disabled: true,
          select: true
        },
        {
          title: "监控",
          dataIndex: "monitor",
          disabled: false,
          select: true
        },
        {
          title: "地域",
          dataIndex: "shortName",
          disabled: false,
          select: true
        },
        {
          title: "IP地址",
          dataIndex: "ip",
          disabled: false,
          select: true
        },
        {
          title: "状态",
          dataIndex: "runningStatus",
          disabled: true,
          select: true
        },
        {
          title: "配置",
          dataIndex: "setting",
          disabled: false,
          select: true
        },
        {
          title: "类型/到期日期",
          dataIndex: "endTimeStr",
          disabled: false,
          select: true
        },
        {
          title: "自动续费/周期",
          dataIndex: "autoRenew",
          disabled: true,
          select: true
        },
        {
          title: "操作",
          dataIndex: "action",
          disabled: true,
          select: true
        }
      ]
    };
  },
  created() {},
  methods: {
    // 关闭弹窗
    handleCancel() {
      this.$emit("changeVisible", false);
    },
    // 弹窗提交
    handleOk() {
      this.$emit("change", this.columns);
      this.$emit("changeVisible", false);
    }
  }
};
</script>

<style lang="less" scoped>
.columns-modal-container {
  background: #fff;
}
</style>
