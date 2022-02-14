<template>
  <div class="work-record-container">
    <div class="title">沟通记录</div>
    <div class="record-list">
      <div v-for="item in recordList" :key="item.id" class="item">
        <div class="left">
          <div class="ava">
            <img
              v-if="item.identityType === 1"
              src="@/assets/img/workOrder/user.png"
              alt=""
            />
            <img v-else src="@/assets/img/workOrder/customer.png" alt="" />
          </div>
          <div class="info-box">
            <div :class="`top-title ${getClassName(item.identityType)}`">问题描述</div>
            <div class="info-txt">
              {{ item.replyDetail }}
            </div>
            <div class="info-img">
              <img src="" alt="" />
            </div>
          </div>
        </div>
        <div class="right">
          {{ item.createTime | formatDate }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 消息记录列表
    recordList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    // 根据用户类型返回不同类名
    getClassName() {
      return function (val) {
        if (val === 1) {
          return "";
        }
        if (val === 2) {
          return "info-txt";
        }
        if (val === 3) {
          return "sys-txt";
        }
        return "";
      };
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
