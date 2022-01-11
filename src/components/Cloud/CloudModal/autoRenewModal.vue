<template>
  <a-modal
    :visible="value"
    width="630px"
    centered
    title="设置自动续费"
    wrapClassName="autoRenew-modal-container"
    okText="确定"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="info-box">
      <div class="title">温馨提示</div>
      <div class="txt">
        设置成功后，系统自动以1个月时长进行续费。若您设置了自动续费，将于次日开始的扣款日扣款；
      </div>
      <div class="txt">
        自动续费于产品到期前自然日7天，3天，2天以及到期当天为扣款日，每天只扣款一次，扣款成功或者4个扣款日都失败当月不再扣费，请保持账户余额充足；
      </div>
      <div class="txt">如您在扣款日前人工手动续费，则当月不再自动续费；</div>
      <div class="txt">自动续费仅支持账户余额扣款，暂不支持代金券扣款。</div>
    </div>
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="开启自动续费">
        <a-switch v-model="form.autoRenew" />
      </a-form-model-item>
      <a-form-model-item label="续费时长">
        <a-select v-model="form.period">
          <a-select-option
            v-for="(value, key) in regionEnum"
            :key="key"
            :value="key"
          >
            {{ value }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { regionEnum } from "@/utils/enum";
import { setBuyTimeData } from "@/utils/index";
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
    // 实例详情
    detail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      regionEnum,
      labelCol: { span: 9 },
      wrapperCol: { span: 10 },
      loading: false,
      form: {
        autoRenew: undefined,
        period: "1"
      }
    };
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal) {
          this.form.autoRenew = Boolean({ ...this.detail }.autoRenew);
        }
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    // 关闭弹窗
    handleCancel() {
      this.form = {
        autoRenew: false,
        period: "1"
      };
      this.$emit("changeVisible", false);
    },
    // 弹窗提交
    handleOk() {
      this.loading = true;
      const data = {
        id: this.detail.id,
        renewPeriod: setBuyTimeData(this.form.period).period,
        renewUnit: setBuyTimeData(this.form.period).priceUnit,
        autoRenew: this.form.autoRenew ? 1 : 0
      };
      this.$store
        .dispatch("cloud/cloudAutoRenew", data)
        .then((res) => {
          this.$message.success(
            res.data.autoRenew === 1 ? "设置自动续费成功" : "关闭自动续费成功"
          );
          this.$emit("success", res.data);
          this.handleCancel();
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.autoRenew-modal-container {
  background: #fff;
  .info-box {
    width: 100%;
    padding: 7px 22px 14px 37px;
    border: 1px solid #ffdac2;
    border-radius: 2px;
    color: #ff6600;
    font-size: 12px;
    background: #fff3eb;
    margin-bottom: 20px;
    .title {
      position: relative;
      left: -20px;
      line-height: 30px;
    }
    .txt {
      padding-left: 12px;
      color: #666869;
      font-size: 12px;
      line-height: 24px;
      background: url("../../../assets/img/cloud/aler_warn_point.png") no-repeat
        0 10px;
    }
  }
}
</style>
