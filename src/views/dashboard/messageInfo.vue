<template>
  <div>
    <DetailHeader title="全部消息" />
    <div class="message-budy" v-if="data">
      <h2>{{ data.title }}</h2>
      <p class="message-time">{{ data.sendTime | formatDate }}</p>
      <p class="message-info">
        {{ data.content }}
      </p>
    </div>
  </div>
</template>

<script>
import DetailHeader from '@/components/Common/detailHeader.vue';
export default {
  components: {
    DetailHeader,
  },
  data() {
    return {
      data: null,
    };
  },

  created() {
    this.getMessageInfo();
  },
  methods: {
    getMessageInfo() {
      this.$store
        .dispatch('message/getOne', { id: this.$route.query.id })
        .then((res) => {
          console.log(res, '1232123');
          this.data = res.data;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.back {
  margin-right: 10px;
}
.message-budy {
  border: 1px solid #e8e8e8;
  padding: 30px 35px;
  h2 {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #262829;
  }
  .message-time {
    text-align: center;
    font-size: 14px;
    color: #999;
    padding-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;
  }
  .message-info {
    padding: 40px 0 120px;
    font-size: 14px;
    color: #4d4d4d;
  }
}
</style>
