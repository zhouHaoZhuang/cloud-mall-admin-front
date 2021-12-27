<template>
  <div class="upgrade-container">
    <DetailHeader title="升级配置" />
    <div class="info-box">
      <a-icon class="icon" type="exclamation-circle" />
      服务器升级后，到期时间不变，差价的计算精确到天；升级价格计算公式：(升级配置价格[月]
      - 原始配置价格[月]) * 12 / 365 * 到期剩余天数。
    </div>
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="IP地址"> {{ detail.outIp }} </a-form-model-item>
      <a-form-model-item label="CPU">
        <a-select style="width: 160px" v-model="form.time" placeholder="请选择">
          <a-select-option
            v-for="(value, key) in snapshotDayEnum"
            :key="key"
            :value="key"
          >
            {{ value }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="内存">
        <a-select style="width: 160px" v-model="form.time" placeholder="请选择">
          <a-select-option
            v-for="(value, key) in snapshotDayEnum"
            :key="key"
            :value="key"
          >
            {{ value }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="SSD数据盘">
        <div class="datasidk-item">
          <div class="input-number-box">
            <a-input-number class="input-number" :min="1" :max="10" />
            <div class="txt">GB</div>
          </div>
        </div>
      </a-form-model-item>
      <a-form-model-item label="公网带宽">
        <div class="input-number-box">
          <a-input-number class="input-number" :min="1" :max="10" />
          <div class="txt">Mbps</div>
        </div>
      </a-form-model-item>
      <a-form-model-item label="到期时间">
        {{ detail.endTimeStr }}
      </a-form-model-item>
      <a-form-model-item label="升级差价">
        <div class="price">{{ price }}</div>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 10, offset: 5 }">
        <a-button type="primary" @click="handleSubmit">确认提交</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { snapshotDayEnum } from "@/utils/enum";
import DetailHeader from "@/components/Common/detailHeader";
export default {
  components: {
    DetailHeader
  },
  data() {
    return {
      snapshotDayEnum,
      detail: {},
      labelCol: { span: 5 },
      wrapperCol: { span: 10 },
      form: {},
      price: ""
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    // 获取服务器实例详情
    getDetail() {
      this.$store
        .dispatch("cloud/cloudDetail", { id: this.$route.query.id })
        .then((res) => {
          this.detail = { ...res.data };
        });
    },
    // 确认提交
    handleSubmit() {}
  }
};
</script>

<style lang="less" scoped>
.upgrade-container {
  .info-box {
    display: flex;
    align-items: center;
    padding: 7px 22px 5px 37px;
    min-height: 32px;
    border: 1px solid #ffdac2;
    border-radius: 2px;
    color: #ff6600;
    font-size: 12px;
    margin-bottom: 20px;
    background: #fff3eb;
    margin-top: 20px;
    .icon {
      font-size: 16px;
      margin-right: 6px;
    }
  }
  .input-number-box {
    width: 160px;
    position: relative;
    .input-number {
      width: 160px;
    }
    .txt {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 28px;
    }
  }
}
</style>
<style lang="less">
.upgrade-container {
  .ant-input-number-handler-wrap {
    opacity: 1 !important;
  }
}
</style>
