<template>
  <div class="work-detail-container">
    <!-- 头部标题 -->
    <DetailHeader title="工单详情" />
    <!-- 步骤组件 -->
    <!-- 头部信息 -->
    <!-- 沟通记录 -->
    <!-- 发表回复 -->
  </div>
</template>

<script>
import DetailHeader from "@/components/Common/detailHeader";
export default {
  components: {
    DetailHeader
  },
  data() {
    return {
      time: null
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
}
</style>
