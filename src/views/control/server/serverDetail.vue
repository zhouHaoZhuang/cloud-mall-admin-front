<template>
  <div class="cloud-detail-container">
    <div class="header">
      <DetailHeader title="云服务器详情" />
    </div>
    <div class="cloud-action">
      <img class="left-img" src="../../../assets/img/cloud/windows.png" />
      <div class="right-con">
        <div class="title-box">
          <div style="margin-right: 25px">{{ detail.instanceName }}</div>
          <div :class="getStatusClassName(detail.runningStatus)">
            <div v-if="!isHaveAction" class="dot"></div>
            <a-icon
              v-else
              type="loading"
              style="margin-right: 6px; font-size: 18px"
            />
            <span v-if="!isHaveAction">
              {{ runningStatusEnum[detail.runningStatus] }}
            </span>
            <span v-else>{{ actionsTxt }}</span>
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
            <a-button @click="handleStart" :disabled="startBtnDisable">
              启动
            </a-button>
            <a-button
              type="primary"
              @click="handleCloudActionModal('restart')"
              :disabled="restartBtnDisable"
            >
              重启
            </a-button>
            <a-button
              type="primary"
              @click="handleCloudActionModal('stop')"
              :disabled="stopBtnDisable"
            >
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
                <a-menu-item key="1" @click="handleResetPwdModal">
                  重设密码
                </a-menu-item>
                <a-menu-item key="2" @click="handleResetSystemModal">
                  重装系统
                </a-menu-item>
                <a-menu-item key="3" disabled>PUSH</a-menu-item>
                <a-menu-item key="4" @click="handleCreateSnapshotModal">
                  创建快照
                </a-menu-item>
                <a-menu-item key="5" disabled>管理快照</a-menu-item>
                <a-menu-item key="6" disabled>重设VNC密码</a-menu-item>
                <a-menu-item key="7" disabled>续费降配</a-menu-item>
                <a-menu-item key="8" disabled>销毁</a-menu-item>
                <a-menu-item key="9" @click="installMonitor">
                  安装监控插件
                </a-menu-item>
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
        <a-tab-pane key="2" tab="性能监控">
          <CloudMonitor :tabsKey="tabsKey" :detail="detail" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="备案白名单"></a-tab-pane>
        <a-tab-pane key="4" tab="操作日志"></a-tab-pane>
      </a-tabs>
    </div>
    <!-- 弹窗相关-----start -->
    <!-- 重置密码弹窗 -->
    <UpdatePwdModal v-model="updatePwdVisible" :detail="detail" />
    <!-- 重启/关机弹窗 -->
    <CloudActionModal
      v-model="cloudActionVisible"
      :type="cloudActionType"
      :list="cloudActionList"
      @success="cloudActionsSuccess"
    />
    <!-- 重装系统 -->
    <UpdateSystemModal v-model="updateSystemVisible" :detail="detail" @success='updateSystemSuccess' />
    <!-- 创建快照 -->
    <CreateSnapshotModal v-model="createSnapshotVisible" />
    <!-- 弹窗相关-----end -->
  </div>
</template>

<script>
import moment from "moment";
import { runningStatusEnum } from "@/utils/enum";
import DetailHeader from "@/components/Common/detailHeader";
import CloudDetail from "@/components/Cloud/cloudDetail";
import CloudMonitor from "@/components/Cloud/cloudMonitor";
import UpdatePwdModal from "@/components/Cloud/CloudModal/updatePwdModal";
import CloudActionModal from "@/components/Cloud/CloudModal/cloudActionModal";
import UpdateSystemModal from "@/components/Cloud/CloudModal/updateSystemModal";
import CreateSnapshotModal from "@/components/Cloud/CloudModal/createSnapshotModal";
export default {
  components: {
    DetailHeader,
    CloudDetail,
    CloudMonitor,
    UpdatePwdModal,
    CloudActionModal,
    UpdateSystemModal,
    CreateSnapshotModal
  },
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
    },
    // 操作按钮是否禁用
    // 启动
    startBtnDisable() {
      if (this.actionsBtnDisable) {
        return true;
      }
      if (this.detail.runningStatus !== 2) {
        return true;
      } else {
        return false;
      }
    },
    // 重启
    restartBtnDisable() {
      if (this.actionsBtnDisable) {
        return true;
      }
      if (this.detail.runningStatus !== 1) {
        return true;
      } else {
        return false;
      }
    },
    // 关机
    stopBtnDisable() {
      if (this.actionsBtnDisable) {
        return true;
      }
      if (this.detail.runningStatus !== 1) {
        return true;
      } else {
        return false;
      }
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
      cloudActionList: [],
      // 启动服务器
      startLoading: false,
      // 重置系统
      updateSystemVisible: false,
      // 创建快照
      createSnapshotVisible: false,
      // 弹窗相关----------end
      // 服务器操作后回调所需数据----------start
      actionsLoading: false,
      actionsBtnDisable: false,
      isHaveAction: false,
      actionsTxt: "",
      actionsTime: null,
      actionsTimeStep: 60, // 单位：秒
      // 服务器操作后回调所需数据----------end
      // tabs的key
      tabsKey: "1"
    };
  },
  created() {
    this.getDetail();
  },
  beforeDestroy() {
    clearInterval(this.actionsTime);
  },
  methods: {
    // 获取服务器实例详情
    getDetail() {
      this.$store
        .dispatch("cloud/cloudDetail", { id: this.$route.query.id })
        .then((res) => {
          this.detail = { ...res.data };
          // 查询监控插件运行状态
          this.getMonitorStatus();
          // 开启轮询查询服务器状态
          this.startTime(false);
        });
    },
    // 获取插件运行状态
    getMonitorStatus() {
      this.$store
        .dispatch("cloud/getMonitorStatus", {
          instanceIds: [this.detail.instanceId]
        })
        .then((res) => {
          this.detail.monitorStatusDetail = { ...res.data[0] };
        });
    },
    // tabs切换回调
    tabsCallback(key) {
      this.tabsKey = key;
    },
    // 弹窗相关----------start
    // 重设密码第一步弹窗
    handleResetPwdModal() {
      this.$confirm({
        width: "600px",
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
    handleCloudActionModal(type) {
      this.cloudActionList = [{ ...this.detail }];
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
            this.cloudActionType = "start";
            this.startLoading = true;
            const newList = [{ ...this.detail }].map((ele) => {
              return {
                instanceId: ele.instanceId,
                regionId: ele.regionId
              };
            });
            const data = {
              instanceQueryReqDtoList: [...newList],
              type: "start"
            };
            this.$store
              .dispatch("cloud/cloudActions", data)
              .then((res) => {
                this.isHaveAction = true;
                this.actionsBtnDisable = true;
                this.startTime(true);
                resolve();
              })
              .finally(() => {
                this.startLoading = false;
              });
          });
        }
      });
    },
    // 重置系统第一步弹窗
    handleResetSystemModal() {
      this.$confirm({
        width: "600px",
        centered: true,
        okText: "下一步",
        title: (h) => (
          <div>
            <div>你所选的1台云服务器将执行重装系统操作，是否确定该操作？</div>
            <div>请在重装前确认数据已备份，释放后数据无法找回</div>
          </div>
        ),
        content: (h) => (
          <div>
            <div>
              同Windows系统或同Linux系统重装，只格式化系统盘，数据盘不变；
            </div>
            <div>Windows系列和Linux系列互换，系统盘和数据盘将同时格式化；</div>
          </div>
        ),
        onOk: () => {
          return new Promise((resolve, reject) => {
            this.updateSystemVisible = true;
            resolve();
          });
        }
      });
    },
    // 重装系统成功回调
    updateSystemSuccess() {
      this.getDetail();
    },
    // 创建快照弹窗
    handleCreateSnapshotModal() {
      this.createSnapshotVisible = true;
    },
    // 弹窗相关----------end
    // 服务器操作后回调所需数据----------start
    // 服务器操作成功后的回调
    cloudActionsSuccess() {
      this.isHaveAction = true;
      this.actionsBtnDisable = true;
      this.startTime(true);
    },
    // 计时器结束后要做的事情
    timeEnd(isHaveAction) {
      clearInterval(this.actionsTime);
      this.actionsLoading = false;
      this.isHaveAction = isHaveAction;
      this.actionsTxt = "";
    },
    // 根据返回的状态判断操作是否结束，然后需要让计时器慢下来
    getActionsIsEnd(status) {
      if (
        this.cloudActionType === "start" ||
        this.cloudActionType === "restart"
      ) {
        return status === 1;
      }
      if (this.cloudActionType === "stop") {
        return status === 2;
      }
    },
    // 获取服务器实例状态
    getCloudRunStatus() {
      const data = {
        instanceId: this.detail.instanceId,
        regionId: this.detail.regionId
      };
      this.$store.dispatch("cloud/getCloudRunStatus", data).then((res) => {
        this.actionsTxt = res.data.name;
        if (this.isHaveAction) {
          this.detail.runningStatus = res.data.code * 1;
          if (this.getActionsIsEnd(res.data.code * 1)) {
            this.timeEnd(false);
            this.actionsBtnDisable = false;
            this.startTime(false);
          }
        }
      });
    },
    // 有过操作后开启定时器和没操作开启，间隔时间不同
    startTime(isHaveAction) {
      // 如果之前有定时器在开启，先行清除定时器
      if (this.actionsTime !== null) {
        this.timeEnd(isHaveAction);
      }
      // 防止多次点击
      if (this.actionsLoading) return;
      this.actionsLoading = true;
      // 先开启一次性定时器直接查状态
      setTimeout(() => {
        this.getCloudRunStatus();
      }, 0);
      // 设置定时器不同时间
      if (this.isHaveAction) {
        this.actionsTimeStep = 3;
      } else {
        this.actionsTimeStep = 6;
      }
      this.actionsTime = setInterval(() => {
        this.getCloudRunStatus();
      }, this.actionsTimeStep * 1000);
    },
    // 服务器操作后回调所需数据----------end
    // 安装监控插件
    installMonitor() {
      const data = {
        force: true,
        instanceIds: [this.detail.instanceId],
        regionId: this.detail.regionId
      };
      this.$store.dispatch("cloud/installMonitor", data).then((res) => {
        this.$message.success("发送安装监控插件请求成功");
      });
    }
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
