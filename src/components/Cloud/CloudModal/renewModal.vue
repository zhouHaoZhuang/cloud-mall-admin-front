<template>
  <a-modal
    :visible="value"
    width="630px"
    centered
    title="云服务器续费"
    wrapClassName="renew-modal-container"
    okText="确认续费"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="IP地址"> {{ detail.outIp }} </a-form-model-item>
      <a-form-model-item label="到期时间">
        {{ detail.endTimeStr }}
      </a-form-model-item>
      <a-form-model-item label="续费时长">
        <a-select v-model="form.period" @change="periodChange">
          <a-select-option
            v-for="(value, key) in regionEnum"
            :key="key"
            :value="key"
          >
            {{ value }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="续费后到期时间">
        {{ getRenewEndTime }}
      </a-form-model-item>
      <a-form-model-item label="费用">
        <div class="price">{{ price }}</div>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import moment from "moment";
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
  computed: {
    // 返回续费后到期时间
    getRenewEndTime() {
      return moment(this.detail.endTimeStr)
        .add(this.form.period * 1, "months")
        .format("YYYY-MM-DD HH:mm:ss");
    }
  },
  data() {
    return {
      regionEnum,
      labelCol: { span: 9 },
      wrapperCol: { span: 10 },
      loading: false,
      form: {
        period: "1"
      },
      price: "0.00"
    };
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal) {
          this.getPrice();
        }
      },
      immediate: true
    }
  },
  methods: {
    // 处理询价和提交续费的参数
    getRequestData() {
      return {
        ...this.form,
        id: this.detail.id,
        regionId: this.detail.regionId,
        productCode: this.detail.productCode,
        ...setBuyTimeData(this.form.period)
      };
    },
    // 询价
    getPrice() {
      this.price = "价格计算中...";
      this.loading = true;
      this.$store
        .dispatch("cloud/cloudRenewPrice", this.getRequestData())
        .then((res) => {
          this.price = res.data.tradePrice + "元";
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 时间选择
    periodChange(val) {
      this.getPrice();
    },
    // 关闭弹窗
    handleCancel() {
      this.$emit("changeVisible", false);
    },
    // 弹窗提交
    handleOk() {
      this.loading = true;
      this.$store
        .dispatch("cloud/cloudRenew", this.getRequestData())
        .then((res) => {
          this.$message.success("提交续费订单成功");
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
.renew-modal-container {
  background: #fff;
  .price {
    color: #ff6600;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
