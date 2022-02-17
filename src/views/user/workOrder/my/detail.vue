<template>
  <div class="work-detail-container">
    <!-- 头部标题 -->
    <DetailHeader title="工单详情" />
    <!-- 步骤组件 -->
    <Step :step="step" type="myDetail" />
    <!-- 头部信息 -->
    <Detail :detail="detail" @success="detailSuccess" />
    <!-- 沟通记录 -->
    <Record :recordList="recordList" />
    <!-- 发表回复 -->
    <Reply :detail="detail" @success="getRecord" />
  </div>
</template>

<script>
import DetailHeader from "@/components/Common/detailHeader";
import Step from "@/components/WorkOrder/step";
import Detail from "@/components/WorkOrder/detail";
import Record from "@/components/WorkOrder/record";
import Reply from "@/components/WorkOrder/reply";
export default {
  components: {
    DetailHeader,
    Step,
    Detail,
    Record,
    Reply
  },
  data() {
    return {
      time: null,
      step: 1,
      detail: {},
      recordList: []
    };
  },
  created() {
    this.getDetail();
    this.getRecord();
    // this.startTime();
  },
  beforeDestroy() {
    this.time && clearInterval(this.time);
  },
  methods: {
    // 获取我的工单详情
    getDetail() {
      this.$store
        .dispatch("workorder/workOrderDetail", {
          queryType: 1,
          workOrderNo: this.$route.query.workOrderNo
        })
        .then((res) => {
          this.detail = { ...res.data };
        });
    },
    // 获取消息记录
    getRecord() {
      this.$store
        .dispatch("workorder/messageList", {
          queryType: 1,
          workOrderNo: this.$route.query.workOrderNo
        })
        .then((res) => {
          this.recordList = res.data.map((ele) => {
            return {
              ...ele,
              replyUrl: ele.replyUrl ? ele.replyUrl.split(",") : []
            };
          });
        });
    },
    // 头部操作后的回调
    detailSuccess() {
      this.getDetail();
    },
    // 定时轮询
    startTime() {
      this.time && clearInterval(this.time);
      this.time = setInterval(() => {
        this.getList();
      }, 180000);
    }
  }
};
</script>

<style lang="less" scoped>
.work-detail-container {
  padding-bottom: 50px;
}
</style>
