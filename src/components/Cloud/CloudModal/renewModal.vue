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
      <a-form-model-item label="IP地址"> 43.226.39.91:3389 </a-form-model-item>
      <a-form-model-item label="到期时间"> 2022年02月01日 </a-form-model-item>
      <a-form-model-item label="续费时长">
        <a-select>
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
        2022年02月01日
      </a-form-model-item>
      <a-form-model-item label="费用">
        <div class="price">48.70元</div>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { regionEnum } from "@/utils/enum";
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
    }
  },
  data() {
    return {
      regionEnum,
      labelCol: { span: 9 },
      wrapperCol: { span: 10 },
      loading: false,
      form: {}
    };
  },
  created() {},
  methods: {
    // 关闭弹窗
    handleCancel() {
      this.$emit("changeVisible", false);
    },
    // 弹窗提交
    handleOk() {}
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
