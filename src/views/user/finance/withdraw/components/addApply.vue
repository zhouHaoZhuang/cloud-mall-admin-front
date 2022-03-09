<!--
 * @Author: your name
 * @Date: 2022-03-09 11:21:48
 * @LastEditTime: 2022-03-09 15:10:18
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \cloud-mall-admin-front\src\views\user\finance\withdraw\components\addApply.vue
-->

<template>
  <div>
    <a-modal
      title="新建提现申请"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="name" label="银行名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入银行名称" />
        </a-form-model-item>

        <a-form-model-item label="银行卡号" prop="code">
          <a-input v-model="form.code" placeholder="请输入银行卡号" />
          <span class="tigs">请确保符合银行卡号规则</span>
        </a-form-model-item>
        <a-form-model-item label="银行卡绑定人" prop="name1">
          <a-input v-model="form.name1" placeholder="请输入银行卡绑定人姓名" />
          <span class="tigs">请确保符合银行卡绑定人正确</span>
        </a-form-model-item>
        <a-form-model-item label="提现金额" prop="sum">
          <a-input v-model="form.sum" placeholder="请输入需要提现的金额" />
          <span class="tigs">请确保符合当前账号下余额充足</span>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="desc">
          <a-input
            v-model="form.desc"
            type="textarea"
            placeholder="请填写备注信息"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    visible: {}
  },
  data() {
    return {
      confirmLoading: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      form: {
        name: "",
        code: "",
        sum: "",
        name1: "",
        desc: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "银行名称未填写",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "银行卡号不符合编号规则",
            trigger: "blur"
          }
        ],
        sum: [
          {
            required: true,
            message: "当前无足够余额可以进行提现，请核对剩余余额",
            trigger: "blur"
          }
        ],
        name1: [
          {
            required: true,
            message: "银行卡绑定人不正确",
            trigger: "blur"
          }
        ],
      }
    };
  },
  methods: {
    // 提交新增申请
    handleOk(e) {
      this.confirmLoading = true;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert("submit!");
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
      this.$emit("closeAdd");
    },
  }
};
</script>

<style lang="less" scoped>
.tigs {
  color: #ccc;
  font-size: 13px;
}
</style>
