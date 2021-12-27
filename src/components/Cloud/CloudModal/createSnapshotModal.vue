<template>
  <div>
    <!-- 第一步 -->
    <a-modal
      :visible="value"
      width="630px"
      centered
      title="创建快照"
      wrapClassName="create-modal-container"
      okText="下一步"
      @ok="handleCreateNext"
      @cancel="handleCancel"
    >
      <div class="content">
        <div class="info-box">
          <a-icon class="icon" type="exclamation-circle" />
          你所选的1台云服务器 将执行创建快照操作，是否确定该操作？
        </div>
        <div class="select-txt">
          <div>创建完快照的云服务器无法进行升级/降配/PUSH/重装系统的操作</div>
          <div>
            如需进行以上操作，请删除已创建快照进行操作 (
            <span class="strong">删除快照费用无法退还</span>
            )
          </div>
        </div>
        <div class="confrim-box">
          <a-checkbox v-model="confrimSelect" />
          本人已阅读
          <a-button type="link">《快照功能注意事项》</a-button>
          ，并确定要使用快照功能
        </div>
      </div>
    </a-modal>
    <!-- 确认操作 -->
    <a-modal
      :visible="visible"
      width="630px"
      centered
      title="创建快照"
      wrapClassName="create-next-container"
      okText="确定"
      :confirmLoading="visibleLoading"
      @ok="handleSubmit"
      @cancel="nextHandleCancel"
    >
      <div class="info-box">
        <a-icon class="icon" type="exclamation-circle" />
        每台云服务器快照限创建1个快照；快照价格 = 总磁盘大小 × 购买时长 × 单价 (
        <a-button class="btn" type="link">查看详细</a-button>
        )
      </div>
      <a-form-model
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="快照名称">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="选择时长">
          <a-select
            v-model="form.type"
            style="width: 120px"
            @change="handleSnapshotChange"
          >
            <a-select-option value="day">按天</a-select-option>
            <a-select-option value="month">按月</a-select-option>
          </a-select>
          <a-select
            v-if="form.type === 'day'"
            v-model="form.time"
            style="width: 130px; margin-left: 15px"
            placeholder="请选择"
          >
            <a-select-option
              v-for="(value, key) in snapshotDayEnum"
              :key="key"
              :value="key"
            >
              {{ value }}
            </a-select-option>
          </a-select>
          <a-select
            v-else
            v-model="form.time"
            style="width: 130px; margin-left: 15px"
            placeholder="请选择"
          >
            <a-select-option
              v-for="(value, key) in snapshotMonthEnum"
              :key="key"
              :value="key"
            >
              {{ value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="到期时间"> 2020 </a-form-model-item>
        <a-form-model-item label="总费用">
          <div class="price-box">
            ￥
            <span class="strong">7</span>
          </div>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { snapshotDayEnum, snapshotMonthEnum } from "@/utils/enum";
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
      snapshotDayEnum,
      snapshotMonthEnum,
      // 是否勾选同意操作
      confrimSelect: false,
      visible: false,
      visibleLoading: false,
      labelCol: { span: 8 },
      wrapperCol: { span: 11 },
      form: {
        name: "",
        type: "day",
        time: "7"
      }
    };
  },
  created() {},
  methods: {
    // 关闭弹窗
    handleCancel() {
      this.$emit("changeVisible", false);
    },
    // 确认弹窗关闭
    nextHandleCancel() {
      this.visible = false;
    },
    // 时长类型选择
    handleSnapshotChange(value) {
      console.log(value);
      this.form.time = undefined;
    },
    // 创建快照下一步
    handleCreateNext() {
      if (!this.confrimSelect) {
        this.$message.warning("请先勾选是否同意");
        return;
      }
      this.$emit("changeVisible", false);
      this.visible = true;
    },
    // 确认提交
    handleSubmit() {
      if (!this.form.name) {
        this.$message.warning("请输入快照名称");
        return;
      }
      this.visible = false;
      // this.$router.push({
      //   path: "/user/finance/orderdetails",
      //   query: {
      //     id: res.orderNo
      //   }
      // });
    }
  }
};
</script>

<style lang="less" scoped>
.create-modal-container {
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
    margin-bottom: 10px;
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
    margin-left: 50px;
    .strong {
      color: #ff6600;
    }
  }
  .confrim-box {
    margin-left: 25px;
    padding: 0 10px;
    border: 1px solid #ffdac2;
    border-radius: 2px;
    color: #ff6600;
    font-size: 12px;
    background: #fff3eb;
    button {
      padding: 0;
      font-size: 12px;
    }
  }
}
.create-next-container {
  .info-box {
    display: flex;
    align-items: center;
    padding: 0 10px;
    border: 1px solid #ffdac2;
    border-radius: 2px;
    color: #ff6600;
    font-size: 12px;
    background: #fff3eb;
    margin-bottom: 20px;
    .icon {
      font-size: 16px;
      margin-right: 5px;
    }
    .btn {
      padding: 0;
      font-size: 12px;
    }
  }
  .price-box {
    color: #ff6600;
    font-size: 14px;
    .strong {
      font-size: 20px;
    }
  }
}
</style>
