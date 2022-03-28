<template>
  <div>
    <a-modal
      :title="newTitle"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item
          ref="accountName"
          label="银行名称"
          prop="accountName"
        >
          <a-input v-model="form.accountName" placeholder="请输入银行名称" />
        </a-form-model-item>

        <a-form-model-item label="银行卡号" prop="accountNo">
          <a-input v-model="form.accountNo" v-number-evolution placeholder="请输入银行卡号" />
          <span class="tigs">请确保符合银行卡号规则</span>
        </a-form-model-item>
        <a-form-model-item label="银行卡绑定人" prop="receiverName">
          <a-input
            v-model="form.receiverName"
            placeholder="请输入银行卡绑定人姓名"
          />
          <span class="tigs">请确保符合银行卡绑定人正确</span>
        </a-form-model-item>
        <a-form-model-item label="提现金额" prop="dealAmount">
          <a-input
            v-model="form.dealAmount"
            ref="dealAmount"
            placeholder="请输入需要提现的金额"
           v-number-evolution="{ value: 2, min: 0, max: 999999 }"
          />
          <span class="tigs">请确保符合当前账号下余额充足</span>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="memo">
          <a-input
            v-model="form.memo"
            type="textarea"
            :max-length="200"
            placeholder="请填写备注信息"
          />
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button type="primary" @click="handleOk('save')">保存</a-button>
        <a-button @click="handleOk('submit')" type="primary">提交</a-button>
        <a-button @click="handleCancel">取消</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
export default {
  model: {
    event: "changeVisible",
    prop: "visible"
  },
  props: {
    visible: {},
    // 申请提现详情
    detailInfo: {
      type: Object,
      default: () => {}
    },
    apply: {},
    balance:{}
  },
  watch: {
    apply: {
      handler(newVal) {
        if (newVal == 1) {
          this.newTitle = "新建提现申请";
          this.form = {};
        } else if (newVal == 2) {
          this.$nextTick(() => {
            this.newTitle = "提现申请详情";
            this.form = this.detailInfo;
          });
        }
      },
      immediate: true,
      deep: true
    },
    detailInfo: {
      handler(newVal) {
        if (!newVal) {
          this.form = {};
        } else if (newVal) {
          this.$nextTick(() => {
            this.form = this.detailInfo;
          });
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      newTitle: "",
      confirmLoading: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      form: {
        status: 2,
        accountName: "",
        accountNo: "",
        dealAmount: "",
        receiverName: "",
        memo: ""
      },
      rules: {
        accountName: [
          {
            required: true,
            message: "银行名称未填写",
            trigger: "blur"
          }
        ],
        accountNo: [
          {
            required: true,
             message: "银行卡号未填写",
            trigger: ["blur", "change"]
          }
        ],
        dealAmount: [
          {
            required: true,
             message: "余额未填写",
            trigger: ["blur", "change"],
          }
        ],
        receiverName: [
          {
            required: true,
            message: "银行卡绑定人未填写",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 保存,提交新增申请
    handleOk(val) {
      this.confirmLoading = true;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let title;
          console.log(this.balance,'this.balance');
          console.log(this.$refs.dealAmount.value,'this.$refs.dealAmount.value');
          if(!this.balance){
            this.$message.error("请刷新页面");
          }
          if (this.$refs.dealAmount.value >  this.balance) {
            this.$message.error("当前无足够余额可以进行提现，请核对剩余余额");
            return
          }

          if (val == "save") {
            title = "确认保存申请吗?";
            this.form.status = 0;
            if (this.apply == 1) {
              this.add(title);
            }
            if (this.apply == 2) {
              this.edit(title);
            }
          }
          if (val == "submit") {
            title = "确认提交申请吗?";
            this.form.status = 2;
            if (this.apply == 1) {
              this.add(title);
            }
            if (this.apply == 2) {
              this.edit(title);
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      setTimeout(() => {
        // this.confirmLoading = false;
      }, 2000);
    },
    handleCancel(e) {
      this.$emit("changeVisible", false);
    },
    // 新增
    add(title) {
      this.$confirm({
        title: title,
        onOk: () => {
          this.$store
            .dispatch("withdraw/addRecord", this.form)
            .then((res) => {
              this.$message.success("提交成功");
              this.$emit("changeVisible", false);
              this.$emit("success");
            })
            .catch((err) => {
              this.confirmLoading = false;
            });
        }
      });
    },
    // 编辑
    edit(title) {
      this.$confirm({
        title: title,
        onOk: () => {
          this.$store
            .dispatch("withdraw/editRecord", this.form)
            .then((res) => {
              this.$message.success("提交成功");
              this.$emit("changeVisible", false);
              this.$emit("success");
            })
            .catch((err) => {
              this.confirmLoading = false;
            });
        }
      });
    },
    // 重置表单数据
    resetForm() {
      this.form = {
        accountName: "",
        accountNo: "",
        dealAmount: "",
        receiverName: "",
        memo: ""
      };
    }
  },
};
</script>

<style lang="less" scoped>
.tigs {
  color: #ccc;
  font-size: 13px;
}
</style>
