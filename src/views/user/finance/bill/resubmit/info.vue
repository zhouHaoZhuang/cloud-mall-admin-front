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
      <a-descriptions title="申请信息" v-if="data">
        <a-descriptions-item label="发票ID">
          {{ data.invoiceNo }}
        </a-descriptions-item>
        <a-descriptions-item label="开具类型">
          {{ issueTypeMap[data.invoiceInfo.issueType] }}
        </a-descriptions-item>
        <a-descriptions-item label="发票类型">
          {{ invoiceTypeMap[data.invoiceInfo.invoiceType] }}
        </a-descriptions-item>
        <a-descriptions-item label="发票抬头">
          {{ data.invoiceInfo.invoiceTitle }}
        </a-descriptions-item>
        <a-descriptions-item label="税务登记号">
          {{ data.invoiceInfo.registerNo }}
        </a-descriptions-item>
        <a-descriptions-item label="开票金额">
          <b style="color: #02a7f0">￥{{ data.invoiceAmount }}</b>
        </a-descriptions-item>
      </a-descriptions>
      <h3>开票明细</h3>
      <div>
        <a-table
          :columns="columns"
          :data-source="dataDetails"
          :pagination="false"
          rowKey="id"
        >
          <div slot="canInvoiceAmount" slot-scope="text, record">
            <span v-if="record.consumptionType === 2">
              {{ record.originalAmountShow }}
            </span>
            <span v-if="record.consumptionType === 1">
              {{ record.canInvoiceAmount }}
            </span>
          </div>
          <div slot="type" slot-scope="text">
            {{ typeMap[text] }}
          </div>
          <div v-if="text" slot="createTime" slot-scope="text">
            {{ text | formatDate }}
          </div>
        </a-table>
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
        <a-form-model-item label="物流单号" prop="expressDelivery">
          <a-input v-model="form.expressDelivery" />
        </a-form-model-item>
        <a-form-model-item label="寄件联系人" prop="sender">
          <a-input v-model="form.sender" />
        </a-form-model-item>
        <a-form-model-item label="联系电话" prop="senderPhone">
          <a-input v-model="form.senderPhone" />
        </a-form-model-item>
        <a-form-model-item label="备注" prop="refundRemark">
          <a-input v-model="form.refundRemark" />
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
      data: null,
      typeMap: {
        1: "订单",
        2: "账单"
      },
      issueTypeMap: {
        1: "个人",
        2: "企业"
      },
      invoiceTypeMap: {
        1: "增值税普通发票",
        2: "增值税专用发票"
      },
      labelCol: { span: 8 },
      wrapperCol: { span: 9 },
      form: {
        expressDelivery: "",
        sender: "",
        senderPhone: "",
        refundRemark: ""
      },
      rules: {
        expressDelivery: [
          {
            required: true,
            message: "请填写物流单号",
            trigger: "blur"
          }
        ],
        sender: [
          {
            required: true,
            message: "请填写寄件联系人",
            trigger: "blur"
          }
        ],
        senderPhone: [
          {
            required: true,
            message: "请填写联系电话",
            trigger: "blur"
          },
          {
            pattern:
              /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            message: "请输入正确的联系电话",
            trigger: ["blur", "change"]
          }
        ],
        refundRemark: [
          {
            required: true,
            message: "请填写备注",
            trigger: "blur"
          }
        ]
      },
      current: 0,
      columns: [
        { title: "订单ID", dataIndex: "id" },
        {
          title: "类型",
          dataIndex: "type",
          scopedSlots: { customRender: "type" }
        },
        { title: "产品名称", dataIndex: "productName" },
        {
          title: "开票金额",
          dataIndex: "canInvoiceAmount",
          scopedSlots: {
            customRender: "canInvoiceAmount"
          }
        },
        {
          title: "订单创建时间",
          dataIndex: "createTimeShow"
        }
      ],
      dataDetails: [],
      listQuery: {
        key: "",
        search: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
        status: "",
        startTime: "",
        endTime: "",
        accountType: ""
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
    this.getData();
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        this.form.id = this.$route.query.id;
        if (valid) {
          this.$store
            .dispatch("billapply/refundApply", this.form)
            .then((res) => {
              this.$message.success("提交成功");
              this.$router.back();
            });
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    // 获取页面数据
    getData() {
      this.$store
        .dispatch("billapply/getInvoiceInfo", { id: this.$route.query.id })
        .then((res) => {
          console.log(res, "---------");
          this.data = res.data;
          this.dataDetails = res.data.invoiceEvaluatePage.list;
          this.paginationProps.total =
            res.data.invoiceEvaluatePage.totalCount * 1;
        });
    },
    //查询数据表格
    getList() {
      this.$getListQp("word/getList", this.listQuery).then((res) => {
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
