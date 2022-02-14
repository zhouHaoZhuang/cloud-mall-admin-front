<template>
  <div class="work-detail-container">
    <!-- 头部标题 -->
    <DetailHeader title="工单详情" />
    <!-- 步骤组件 -->
    <Step :step="step" type="myDetail" />
    <!-- 头部信息 -->
    <Detail :detail="detail" />
    <!-- 沟通记录 -->
    <Record :detail="detail" />
    <!-- 发表回复 -->
    <Reply :detail="detail" />
  </div>
</template>

<script>
import DetailHeader from "@/components/Common/detailHeader";
import Step from "@/components/Domain/step";
import Detail from "@/components/Domain/detail";
import Record from "@/components/Domain/record";
import Reply from "@/components/Domain/reply";
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
      detail: {}
    };
  },
  created() {
    // this.getDetail();
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
          wordOrderNo: this.$route.query.wordOrderNo
        })
        .then((res) => {
          this.detail = { ...res.data };
        });
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
