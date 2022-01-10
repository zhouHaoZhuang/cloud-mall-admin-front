<template>
  <div>
    <h2><a-icon @click="$router.back()" type="left" class="back" />全部消息</h2>
    <div class="message-budy">
      <h2>云虚拟主机过期提醒</h2>
      <p class="message-time">2021-12-31 10：20：13</p>
      <p class="message-info">
        尊敬的用户，您的云虚拟主机已于 2021-12-30 21:03:32
        正式到期（主机名称：host105304160），请于 2022-01-01 21:03:32
        前续费，到期释放备案将同步取消接入，请及时续费。
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
			data:{},
		};
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
	.message-time{
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
