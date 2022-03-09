<template>
  <div>
    <a-modal
      title="提现申请详情"
      width="650px"
      :visible="visibleDetail"
      :confirm-loading="confirmLoading"
      cancelText="关闭"
      @cancel="handleCancel"
    >
      <a-form :model="form">
        <a-form-item label="申请单号">
          {{ form.name }}
        </a-form-item>
        <a-form-item label="银行名称">
          {{ form.date1 }}
        </a-form-item>
        <a-form-item label="银行卡号">
          {{ form.delivery }}
        </a-form-item>
        <a-form-item label="银行绑定人">
          {{ form.desc }}
        </a-form-item>
        <a-form-item label="提现金额">
          {{ form.desc }}
        </a-form-item>
        <a-form-item label="状态">
          {{ form.desc }}
        </a-form-item>
        <a-form-item label="备注">
          {{ form.desc }}
        </a-form-item>
        <a-form-item label="反馈信息">
          {{ form.desc }}
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button @click="handleCancel">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    visibleDetail: {}
  },
  data() {
    return {
      form: {
        name: "haha",
        region: "xixi",
        date1: "啥也不是",
        delivery: "false",
        resource: "213",
        desc: "2321"
      }
    };
  },
  methods: {
    handleCancel(e) {
        this.$emit('closeDetail')
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
  display: flex;
}
</style>
