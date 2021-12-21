<template>
  <div class="cloud-detail-container">
    <div class="header">
      <div class="box">
        <a-icon type="left" @click="$router.back()" />
      </div>
      <span>云服务器详情</span>
    </div>
    <div class="cloud-action">
      <img class="left-img" src="../../../assets/img/cloud/windows.png" />
      <div class="right-con">
        <div class="title-box">
          <div>{{ detail.instanceName }}</div>
          <div :class="getStatusClassName(detail.runningStatus)">
            <div class="dot"></div>
            {{ runningStatusEnum[detail.runningStatus] }}
          </div>
        </div>
        <div class="info">
          <span class="ip">公网IP：{{ detail.outIp }}</span>
          <div>
            到期时间：{{ detail.endTimeStr }}
            <span class="red">
              ({{ getEndTimeDay(detail.endTimeStr) }}天后到期)
            </span>
          </div>
        </div>
        <div class="btns">
          <a-space>
            <a-button @click="handleStart">启动</a-button>
            <a-button type="primary" @click="handleCloudAction('restart')">
              重启
            </a-button>
            <a-button type="primary" @click="handleCloudAction('stop')">
              关机
            </a-button>
            <a-button type="primary" disabled>VNC连接</a-button>
            <a-button type="primary">同步</a-button>
            <a-dropdown :trigger="['click']">
              <a-button>
                更多操作
                <a-icon type="caret-down" />
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item key="1" @click="handleResetPwd">
                  重设密码
                </a-menu-item>
                <a-menu-item key="2" disabled>重装系统</a-menu-item>
                <a-menu-item key="3" disabled>PUSH</a-menu-item>
                <a-menu-item key="4" disabled>创建快照</a-menu-item>
                <a-menu-item key="5" disabled>管理快照</a-menu-item>
                <a-menu-item key="6" disabled>重设VNC密码</a-menu-item>
                <a-menu-item key="7" disabled>续费降配</a-menu-item>
                <a-menu-item key="8" disabled>销毁</a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-space>
        </div>
      </div>
    </div>
    <div class="detail">
      <a-tabs default-active-key="1" @change="tabsCallback">
        <a-tab-pane key="1" tab="实例详情">
          <CloudDetail :detail="detail" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="性能监控"></a-tab-pane>
        <a-tab-pane key="3" tab="备案白名单"></a-tab-pane>
        <a-tab-pane key="4" tab="操作日志"></a-tab-pane>
      </a-tabs>
    </div>
    <!-- 弹窗相关-----start -->
    <!-- 重置密码弹窗 -->
    <UpdatePwdModal v-model="updatePwdVisible" />
    <!-- 重启/关机弹窗 -->
    <CloudActionModal v-model="cloudActionVisible" :type="cloudActionType" />
    <!-- 弹窗相关-----end -->
  </div>
</template>

<script>
import moment from "moment";
import { runningStatusEnum } from "@/utils/enum";
import CloudDetail from "@/components/Cloud/cloudDetail";
import UpdatePwdModal from "@/components/Cloud/CloudModal/updatePwdModal";
import CloudActionModal from "@/components/Cloud/CloudModal/cloudActionModal";
export default {
  components: { CloudDetail, UpdatePwdModal, CloudActionModal },
  computed: {
    // 返回表格状态类名
    getStatusClassName() {
      return function (status) {
        if (status === 0) {
          return "status hole";
        }
        if (status === 1) {
          return "status start";
        }
        if (status === 2) {
          return "status stop";
        }
        if (status === 3) {
          return "status overdue";
        }
      };
    },
    // 返回还有多久过期的天数
    getEndTimeDay() {
      return function (time) {
        return moment(time).diff(moment(new Date()), "days");
      };
    }
  },
  data() {
    return {
      runningStatusEnum,
      detail: {},
      // 弹窗相关----------start
      // 重置密码弹窗
      updatePwdVisible: false,
      // 重启/关机弹窗
      cloudActionVisible: false,
      cloudActionType: "",
      // 启动服务器
      startLoading: false
      // 弹窗相关----------end
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    // 获取服务器实例详情
    getDetail() {
      this.$store
        .dispatch("cloud/cloudDetail", { id: this.$route.query.id })
        .then((res) => {
          this.detail = { ...res.data };
        });
    },
    // tabs切换回调
    tabsCallback(key) {
      console.log(key);
    },
    // 弹窗相关----------start
    // 重设密码第一步弹窗
    handleResetPwd() {
      this.$confirm({
        width: "500px",
        centered: true,
        title: "你所选的1台云服务器将执行重置密码操作，是否确定该操作？",
        content:
          "重设云服务器密码后不影响VNC连接密码，如需修改VNC密码请单独修改；请提前保存好云服务器数据，重设密码会使云服务器自动重启生效。",
        onOk: () => {
          return new Promise((resolve, reject) => {
            this.updatePwdVisible = true;
            resolve();
          });
        }
      });
    },
    // 重启/关机弹窗
    handleCloudAction(type) {
      this.cloudActionType = type;
      this.cloudActionVisible = true;
    },
    // 启动服务器
    handleStart() {
      this.$confirm({
        width: "500px",
        centered: true,
        title: "你所选的1台云服务器将执行启动操作。",
        content: "是否确定启动？",
        confirmLoading: this.startLoading,
        onOk: () => {
          return new Promise((resolve, reject) => {
            resolve();
          });
        }
      });
    }
    // 弹窗相关----------end
  }
};
</script>

<style lang="less" scoped>
.cloud-detail-container {
  background-color: #fff;
  .header {
    display: flex;
    font-weight: 500;
    font-size: 22px;
    color: #272829;
    .box {
      width: 40px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #ddd;
      font-size: 18px;
      margin-right: 15px;
      font-weight: 400;
      color: #ccc;
      cursor: pointer;
    }
  }
  .cloud-action {
    margin: 18px 0 30px;
    display: flex;
    font-size: 14px;
    .left-img {
      width: 96px;
      height: 96px;
      margin-right: 24px;
    }
    .right-con {
      .title-box {
        display: flex;
        align-items: center;
        .status {
          color: #29cc7a;
          font-size: 12px;
          margin-left: 25px;
          display: flex;
          align-items: center;
          .dot {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #29cc7a;
            margin-right: 5px;
          }
        }
        .start {
          color: #29cc7a;
          .dot {
            background: #29cc7a;
          }
        }
        .stop {
          color: red;
          .dot {
            background: red;
          }
        }
        .hole {
          color: #000;
          .dot {
            background: #000;
          }
        }
        .overdue {
          color: #666;
          .dot {
            background: #666;
          }
        }
      }
      .info {
        display: flex;
        margin: 13px 0;
        font-size: 12px;
        color: #a0a2a3;
        .ip {
          margin-right: 25px;
        }
        .red {
          color: #ff6600;
        }
      }
    }
  }
  .detail {
    .ant-tabs-nav-scroll {
      background-color: #f0f3f5;
    }
  }
}
</style>
<style lang="less">
.cloud-detail-container {
  .detail {
    .ant-tabs-nav-scroll {
      background-color: #f0f3f5;
    }
  }
}
</style>
