<template>
  <div>
    <a-modal
      :title="newTitle"
      width="650px"
      :visible="visibleDetail"
      :confirm-loading="confirmLoading"
      cancelText="关闭"
      @cancel="handleCancel"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="name" label="申请单号" prop="orderNo">
          {{ form.orderNo }}
        </a-form-model-item>
        <a-form-item label="银行名称" prop="accountName">
          {{ form.accountName }}
        </a-form-item>
        <a-form-item label="银行卡号" prop="accountNo">
          {{ form.accountNo }}
        </a-form-item>
        <a-form-item label="银行绑定人" prop="receiverName">
          {{ form.receiverName }}
        </a-form-item>
        <a-form-item label="提现金额" prop="dealAmount">
          {{ form.dealAmount }}
        </a-form-item>
        <a-form-item label="状态" prop="status">
          <a-tag
            :color="
              form.status == 1
                ? '#87d068'
                : form.status == 2
                ? '#2db7f5'
                : form.status == 3
                ? 'red'
                : form.status == 4
                ? 'orange'
                : form.status == 5
                ? 'blue'
                : 'gray'
            "
            >{{ applyStatus[form.status] }}</a-tag
          >
        </a-form-item>
        <a-form-item label="备注" prop="memo">
          {{ form.memo }}
        </a-form-item>
        <a-form-item label="反馈信息" prop="feedback" v-show="title == 1">
          <span> {{ form.feedback }}</span>
        </a-form-item>
        <a-form-item
          label="反馈信息"
          prop="feedback"
          v-show="title == 2 || title == 3"
        >
          <a-input
            v-model="form.feedback"
            placeholder="请填写驳回原因"
            type="input"
          />
        </a-form-item>
      </a-form-model>

      <template slot="footer">
        <a-button @click="handleOk('ok')" v-if="title == 3" type="primary"
          >确定</a-button
        >
        <a-button type="danger" @click="handleOk('reject')" v-if="title == 2"
          >驳回</a-button
        >
        <a-button @click="handleCancel">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { applyStatus } from "@/utils/enum";
export default {
  model: {
    event: "changeVisible",
    prop: "visibleDetail"
  },
  props: {
    // 是否显示弹框
    visibleDetail: {},
    //1 采购-财务管理下的提现申请详情  2 销售-财务管理-提现管理-提现操作
    type: {},
    // 申请提现详情
    detailInfo: {
      type: Object,
      default: () => {}
    },
    //标题
    title: {}
  },
  watch: {
    visibleDetail: {
      handler(newVal) {},
      immediate: true
    },
    detailInfo: {
      handler(newVal) {
        this.$nextTick(() => {
          this.form = newVal;
        });
      },
      immediate: true,
      deep: true
    },
    title: {
      handler(newVal) {
        //  1 : 提现申请详情 , 2:驳回提现申请 , 3:确认提现申请
        if (newVal == 1) {
          this.newTitle = "提现申请详情";
        } else if (newVal == 2) {
          this.newTitle = "驳回提现申请";
        } else if (newVal == 3) {
          this.newTitle = "确认提现申请";
        }
      },
      immediate: true,
      deep: true
    }
  },

  data() {
    return {
      applyStatus,
      confirmLoading: false,
      newTitle: "",
      form: {},
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      rules: {
        feedback: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入反馈信息"));
              } else {
                callback();
              }
            },
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  methods: {
    //确定,驳回申请
    handleOk(val) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let title;
          if (val == "ok") {
            this.form.status = 1;
            title = "确定提现嘛?";
          }
          if (val == "reject") {
            this.form.status = 3;
            title = "确认要驳回申请吗?";
          }
          this.$confirm({
            title: title,
            onOk: () => {
              this.$store.dispatch("withdraw/approval", this.form).then(res => {
                this.$message.success("操作成功");
                this.$emit("changeVisible", false);
                this.$emit("success");
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 取消弹框
    handleCancel(e) {
      this.$emit("changeVisible", false);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
  display: flex;
}
</style>
