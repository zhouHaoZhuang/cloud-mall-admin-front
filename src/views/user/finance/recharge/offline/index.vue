<template>
  <div class="offline-content">
    <div class="offline-title">
      <p>
        温馨提示：建议您首先采用微信、支付宝、银行卡
        <a @click="change('online')">在线充值</a>
        ，金额可实时到账；线下汇款受银行系统影响，到账时间可能会存在延迟。
      </p>
    </div>
    <div class="offline-steps">
      <a-steps :current="current" direction="vertical" disabled>
        <a-step disabled>
          <div slot="title" class="stepInfo">
            <p>汇款至{{ companyName }}银行账户</p>
            <p>线下汇款直接向{{ companyName }}的账户汇款，汇款账号如下：</p>
          </div>
          <div slot="description">
            <div>
              <a-table
                bordered
                rowKey="id"
                :columns="columns"
                :data-source="data"
                :pagination="false"
              >
                <div slot="companyName" slot-scope="text">{{ text }}</div>
              </a-table>
            </div>
          </div>
        </a-step>

        <a-step disabled>
          <div slot="title" class="stepInfo">
            <p>充值结果反馈</p>
            <p>
              汇款成功后请详细填写与您汇款账号关联的汇款凭据，我司将会核实您的汇款信息；到账时间取决于您的银行系统，请您耐心等待。
            </p>
          </div>
          <div slot="description">
            <div>
              <a-form-model
                ref="ruleForm"
                :model="form"
                :rules="rules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-form-model-item ref="amount" label="汇款金额" prop="amount">
                  <a-input-number
                    :min="1"
                    v-model="form.amount"
                    style="margin-right: 10px"
                  />元
                </a-form-model-item>
                <a-form-model-item
                  ref="accountName"
                  label="汇款户名"
                  prop="accountName"
                >
                  <a-input v-model="form.accountName" />
                </a-form-model-item>
                <a-form-model-item
                  ref="accountCode"
                  label="汇款账号"
                  prop="accountCode"
                >
                  <a-input v-model="form.accountCode" />
                </a-form-model-item>
                <a-form-model-item
                  ref="accountBankName"
                  label="汇款银行"
                  prop="accountBankName"
                >
                  <a-input v-model="form.accountBankName" />
                </a-form-model-item>
                <a-form-model-item ref="memo" label="汇款备注" prop="memo">
                  <a-input v-model="form.memo" />
                </a-form-model-item>
                <a-form-model-item
                  ref="accountType"
                  label="款项类型"
                  prop="accountType"
                >
                  <a-radio-group v-model="form.accountType">
                    <a-radio :value="2"> 线下充值 </a-radio>
                    <!-- <a-radio :value="4"> 退款 </a-radio> -->
                  </a-radio-group>
                </a-form-model-item>
                <a-form-model-item
                  ref="voucher"
                  label="汇款凭证"
                  prop="voucher"
                >
                  <Upload
                    :size="5"
                    :defaultFile="form.voucher"
                    @change="imgChange"
                  />
                  <div slot="help">
                    <p>彩色扫描件</p>
                    <p>JPG或PNG格式，文件大小不超过5MB</p>
                    <p>汇款凭证不能为空</p>
                  </div>
                </a-form-model-item>
                <a-form-model-item :wrapper-col="{ span: 14, offset: 2 }">
                  <a-button @click="submitForm" type="primary">
                    提交汇款记录
                  </a-button>
                </a-form-model-item>
              </a-form-model>
            </div>
          </div>
        </a-step>
        <a-step disabled>
          <p slot="title">提交成功</p>
        </a-step>
      </a-steps>
    </div>
  </div>
</template>

<script>
import Upload from "@/components/Upload/index.vue";
export default {
  components: {
    Upload
  },
  data() {
    return {
      current: 1,
      data: [],
      columns: [
        {
          title: "账户名称",
          dataIndex: "companyName",
          scopedSlots: { customRender: "companyName" }
        },
        {
          title: "银行账号",
          dataIndex: "bankAccount"
        },
        {
          title: "开户银行",
          dataIndex: "openBank"
        }
        // {
        //   title: "汇款备注",
        //   dataIndex: "remark"
        // }
      ],
      form: {
        status: 0,
        amount: "",
        accountName: "",
        accountCode: "",
        memo: "",
        accountBankName: "",
        accountType: 2
      },
      labelCol: { span: 2 },
      wrapperCol: { span: 5 },
      rules: {
        amount: [
          {
            required: true,
            message: "请输入汇款金额",
            trigger: "blur"
          }
        ],
        accountName: [
          {
            required: true,
            message: "请输入汇款户名",
            trigger: "blur"
          }
        ],
        accountCode: [
          {
            required: true,
            message: "请输入汇款账号",
            trigger: "blur"
          },
          {
            pattern: /^[0-9]*$/,
            message: "请输入正确的汇款账号",
            trigger: "blur"
          }
        ],
        accountBankName: [
          {
            required: true,
            message: "请输入汇款银行",
            trigger: "blur"
          }
        ],
        memo: [
          {
            required: true,
            message: "请输入汇款备注",
            trigger: "blur"
          }
        ],
        voucher: [
          {
            required: true,
            message: "请输入汇款凭证",
            trigger: "blur"
          }
        ],
        accountType: [
          {
            required: true,
            message: "请输入款项类型",
            trigger: "blur"
          }
        ]
      },
      companyName: ""
    };
  },
  props: ["change"],
  created() {
    this.getInfo();
    this.getCompanyInfo();
  },
  methods: {
    imgChange({ urlList, firstImageUrl }) {
      // console.log("上传图片回调", urlList, firstImageUrl);
      this.form.voucher = urlList.toString();
    },
    getInfo() {
      this.$store.dispatch("offline/getInfo").then((res) => {
        this.data = [res.data];
        console.log(res);
      });
    },
    // 获取公司信息
    getCompanyInfo() {
      this.$store.dispatch("user/getCompanyInfo").then((res) => {
        console.log(res.data.companyName);
        this.companyName = res.data.companyName;
      });
    },
    putOffline() {
      this.$store.dispatch("offline/putOffline", this.form).then((res) => {
        // this.data = res.data;
        console.log(res);
      });
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$confirm({
            title: "确定要提交吗?",
            onOk: () => {
              console.log(this.form);
              this.$store
                .dispatch("offline/putOffline", this.form)
                .then((res) => {
                  // this.data = res.data;
                  this.$message.success("提交成功");
                  this.change("Inquire");
                  this.current = 2;
                });
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.offline-content {
  .offline-title {
    > p {
      color: #ff6600;
      font-size: 12px;
      height: 32px;
      background: #fff3eb url(../../../../../assets/img/pay/ExclamationMark.png)
        no-repeat 10px 8px;
      line-height: 32px;
      padding: 0px 22px 5px 37px;
      margin: 0;
      border: 1px solid #ffdac2;
      border-radius: 2px;
    }
  }
  .offline-steps {
    margin-top: 30px;
    margin-left: 20px;
    .stepInfo {
      > p:nth-child(1) {
        height: 32px;
        line-height: 32px;
        font-size: 16px;
        color: #262829;
      }
      > p:nth-child(2) {
        margin-top: 10px;
        font-size: 12px;
      }
    }
    .transfer {
      display: inline-block;
      width: 200px;
      margin-right: 10px;
    }
    .transfer420 {
      display: inline-block;
      width: 420px;
    }
  }
}
</style>
