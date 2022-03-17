<template>
  <div>
    <DetailHeader title="退票申请" />
    <div class="title-hint">
      <a-steps :current="current">
        <a-step title="确认退票信息" />
        <a-step title="填写物流信息" />
      </a-steps>
    </div>
    <div v-show="current === 0">
      <a-descriptions title="申请信息">
        <a-descriptions-item label="发票ID">
          FP20220314001
        </a-descriptions-item>
        <a-descriptions-item label="开具类型"> 企业 </a-descriptions-item>
        <a-descriptions-item label="发票类型">
          增值税专用发票
        </a-descriptions-item>
        <a-descriptions-item label="发票抬头"> 上海XX公司 </a-descriptions-item>
        <a-descriptions-item label="税务登记号">
          910004565465465
        </a-descriptions-item>
        <a-descriptions-item label="开票金额">
          <b>￥100.00</b>
        </a-descriptions-item>
      </a-descriptions>
      <h3>开票明细</h3>
      <div>
        <a-table :columns="columns" :data-source="data"> </a-table>
        <div>
          <a-button class="next" type="primary" @click="current = 1">
            下一步
          </a-button>
        </div>
      </div>
    </div>
    <div v-show="current === 1">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="物流单号" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="寄件联系人" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="联系电话" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="备注" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 9, offset: 8 }">
          <a-button type="primary" @click="onSubmit"> 提交申请 </a-button>
          <a-button style="margin-left: 10px" @click="current = 0">
            返回上一步
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import DetailHeader from "@/components/Common/detailHeader.vue";
export default {
  components: {
    DetailHeader
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 9 },
      form: {
        name: "",
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "Please input Activity name",
            trigger: "blur"
          },
          {
            min: 3,
            max: 5,
            message: "Length should be 3 to 5",
            trigger: "blur"
          }
        ]
      },
      current: 0,
      columns: [
        { title: "订单ID", dataIndex: "id" },
        { title: "类型", dataIndex: "type" },
        { title: "产品名称", dataIndex: "name" },
        { title: "可开票金额", dataIndex: "canInvoiceAmount" },
        { title: "订单创建时间", dataIndex: "createTime" }
      ],
      data: []
    };
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.next {
  width: 120px;
  margin: 20px calc(50% - 60px);
}
.title-hint {
  width: 80%;
  margin: 30px auto;
}
</style>
