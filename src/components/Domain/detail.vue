<template>
  <div class="work-top-container">
    <div class="item">
      <div class="label">问题标题：</div>
      <div class="value"></div>
    </div>
    <div class="item">
      <div class="label">工单编号：</div>
      <div class="value"></div>
    </div>
    <div class="item">
      <div class="label">提交时间：</div>
      <div class="value"></div>
    </div>
    <div class="item">
      <div class="label">工单状态：</div>
      <div class="value">
        <!-- 待接单 -->
        <div class="wait status">{{ workOrderStatusEnum[text] }}</div>
        <!-- 处理中 -->
        <div class="center status">
          {{ workOrderStatusEnum[text] }}
        </div>
        <!-- 处理完成 -->
        <div class="ok status">{{ workOrderStatusEnum[text] }}</div>
      </div>
    </div>
    <!-- 按钮盒子 -->
    <div class="btns-wrap">
      <a-button @click="handleCloseWorkOrder"> 关闭工单 </a-button>
      <a-button @click="handleJumpComment"> 评价工单 </a-button>
    </div>
    <!-- 投诉盒子 -->
    <!-- <div class="complaint-wrap">
      <a-button type="link" @click="handleComplaint"> 一键投诉 </a-button>
      <span>已投诉</span>
    </div> -->
  </div>
</template>

<script>
import moment from "moment";
import { workOrderStatusEnum } from "@/utils/enum";
export default {
  props: {
    // 工单详情
    detail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      workOrderStatusEnum
    };
  },
  methods: {
    // 关闭工单
    handleCloseWorkOrder() {},
    // 跳转评价工单
    handleJumpComment() {
      this.$router.push({
        path: "/user/workOrder/comment",
        query: {
          workOrderNo: 132
        }
      });
    },
    // 一键投诉
    handleComplaint() {}
  }
};
</script>

<style lang="less" scoped>
.work-top-container {
  border: 1px solid #eee;
  background-color: #f5f9fa;
  padding: 20px;
  margin: 20px 0;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
  .item {
    width: 33.33%;
    .label {
      color: #a0a2a3;
    }
  }
  .item:nth-child(4) {
    margin-top: 10px;
  }
  .btns-wrap,
  .complaint-wrap {
    position: absolute;
    bottom: 10px;
    right: 20px;
    .ant-btn {
      font-size: 12px;
    }
  }
  // .btns-wrap{
  //   right: 120px;
  // }
  .wait {
    color: #262829;
    .icon {
      color: #00aaff;
      font-size: 18px;
    }
  }
  .center {
    color: #faad14;
    .icon {
      color: #faad14;
      font-size: 16px;
    }
  }
  .ok {
    color: #2bbe22;
    .icon {
      color: #2bbe22;
      font-size: 16px;
    }
  }
}
</style>
