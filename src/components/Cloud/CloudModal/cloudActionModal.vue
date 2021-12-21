<template>
  <a-modal
    :visible="value"
    width="630px"
    centered
    :title="modalTitle"
    wrapClassName="action-modal-container"
    okText="确定"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="content">
      <div class="info-box">
        <a-icon class="icon" type="exclamation-circle" />
        你所选的1台云服务器将执行{{ actionInfo }}操作，是否确定该操作？
      </div>
      <div class="select-txt">请选择您的关机方式：</div>
      <div class="radio">
        <a-radio-group>
          <a-radio :value="1">
            正常{{ actionInfo }}
            <span class="color">[推荐]</span>
          </a-radio>
          <a-radio :value="2">
            强制{{ actionInfo }}
            <span> 强制关机可能会导致未保存的数据丢失 </span>
          </a-radio>
        </a-radio-group>
      </div>
    </div>
  </a-modal>
</template>

<script>
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
    // 类型，重启还是关机
    type: {
      type: String,
      default: ""
    }
  },
  computed: {
    modalTitle() {
      return this.type === "restart" ? "重启云服务器" : "关闭云服务器";
    },
    actionInfo() {
      return this.type === "restart" ? "重启" : "关机";
    }
  },
  data() {
    return {
      loading: false
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
.action-modal-container {
  background: #fff;
  .content {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .info-box {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .icon {
      font-size: 40px;
      color: #ff6600;
      margin-right: 15px;
    }
  }
  .select-txt {
    position: relative;
    margin-bottom: 20px;
    font-size: 12px;
    color: #a0a2a3;
    margin-left: -183px;
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      z-index: 10;
      width: 268px;
      height: 1px;
      background-color: #ddd;
    }
  }
  .radio {
    width: 200px;
    margin-left: -103px;
    margin-bottom: 50px;
    span {
      margin-left: 20px;
    }
    .color {
      color: #ff6600;
    }
  }
}
</style>
