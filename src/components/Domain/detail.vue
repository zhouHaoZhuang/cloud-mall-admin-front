<template>
  <div class="work-top-container">
    <div class="item">
      <div class="label">问题标题：</div>
      <div class="value">
        {{ detail.title }}
      </div>
    </div>
    <div class="item">
      <div class="label">工单编号：</div>
      <div class="value">
        {{ detail.workOrderNo }}
      </div>
    </div>
    <div class="item">
      <div class="label">提交时间：</div>
      <div class="value">
        {{ detail.createTime | formatDate }}
      </div>
    </div>
    <div class="item">
      <div class="label">工单状态：</div>
      <div class="value">
        <!-- 待接单 -->
        <div v-if="detail.status === 1" class="wait status">
          {{ workOrderStatusEnum[detail.status] }}
        </div>
        <!-- 处理中 -->
        <div v-if="detail.status === 2" class="center status">
          {{ workOrderStatusEnum[detail.status] }}
        </div>
        <!-- 处理完成 -->
        <div v-if="detail.status === 3" class="ok status">
          {{ workOrderStatusEnum[detail.status] }}
        </div>
      </div>
    </div>
    <!-- 按钮盒子 -->
    <div class="btns-wrap">
      <a-button
        v-if="detail.status !== 3"
        :loading="loading"
        @click="handleCloseWorkOrder"
      >
        关闭工单
      </a-button>
      <a-button v-else @click="handleJumpComment"> 评价工单 </a-button>
    </div>
    <!-- 投诉盒子 -->
    <!-- <div class="complaint-wrap">
      <a-button type="link" @click="handleComplaint"> 一键投诉 </a-button>
      <span>已投诉</span>
    </div> -->
  </div>
</template>

<script>
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
      workOrderStatusEnum,
      loading: false
    };
  },
  methods: {
    // 关闭工单
    handleCloseWorkOrder() {
      this.$confirm({
        title: "确认要关闭工单吗？",
        onOk: () => {
          this.loading = true;
          this.$store
            .dispatch("workorder/closeWorkOrder", {
              workOrderNo: this.detail.workOrderNo
            })
            .then((res) => {
              this.$message.success("关闭工单成功");
              this.$emit("success");
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    // 跳转评价工单
    handleJumpComment() {
      this.$router.push({
        path: "/user/workOrder/comment",
        query: {
          workOrderNo: this.detail.workOrderNo,
          title: this.detail.title
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
    display: flex;
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
