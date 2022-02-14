<template>
  <div class="work-record-container">
    <div class="title">沟通记录</div>
    <div class="record-list">
      <div class="item">
        <div class="left">
          <div class="ava">
            <img src="@/assets/img/workOrder/user.png" alt="" />
            <img src="@/assets/img/workOrder/customer.png" alt="" />
          </div>
          <div class="info-box">
            <div class="top-title">问题描述</div>
            <div class="info-txt"></div>
            <div class="info-img">
              <img src="" alt="" />
            </div>
          </div>
        </div>
        <div class="right">2022-01-21 16:39:04</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 工单详情
    detail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.work-record-container {
  font-size: 12px;
  .title {
    height: 36px;
    border-bottom: 1px solid #eee;
    background-color: #f5f9fa;
    padding-left: 20px;
    line-height: 36px;
    font-size: 14px;
  }
  .record-list {
    margin-top: 10px;
    padding: 20px 30px;
    .item {
      padding: 30px 25px;
      display: flex;
      justify-content: space-between;
      .left {
        display: flex;
        .ava {
          width: 50px;
          height: 50px;
          margin-right: 25px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .info-box {
          .top-title {
            font-weight: bold;
            color: #555;
          }
          .customer-txt {
            color: #00aaff;
          }
          .sys-txt {
            color: #ff8800;
          }
          .info-txt {
            color: #999;
          }
          .info-img {
            display: flex;
            margin-top: 10px;
            img {
              margin-right: 6px;
              width: 100px;
              height: 100px;
              object-fit: cover;
            }
          }
        }
      }
      .right {
        color: #999;
      }
    }
  }
}
</style>
