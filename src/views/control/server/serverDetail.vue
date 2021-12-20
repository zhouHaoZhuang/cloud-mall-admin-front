<template>
  <div class="cloud-detail-container">
    <div class="header">
      <div class="box">
        <a-icon type="left" />
      </div>
      <span>云服务器详情</span>
    </div>
    <div class="cloud-action">
      <img class="left-img" src="../../../assets/img/cloud/windows.png" />
      <div class="right-con">
        <div class="title-box">
          <div>server_DGlAg9s8</div>
          <div class="status">
            <div class="dot"></div>
            运行中
          </div>
        </div>
        <div class="info">
          <span class="ip">公网IP：43.226.39.91:3389</span>
          <div>
            到期时间：2022-01-02 09:16:31
            <span class="red"> (12天后到期) </span>
          </div>
        </div>
        <div class="btns">
          <a-space>
            <a-button>启动</a-button>
            <a-button type="primary">重启</a-button>
            <a-button type="primary">关机</a-button>
            <a-button type="primary" disabled>VNC连接</a-button>
            <a-button type="primary">同步</a-button>
            <a-dropdown :trigger="['click']">
              <a-button>
                更多操作
                <a-icon type="caret-down" />
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item key="1">重设密码</a-menu-item>
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
          <CloudDetail />
        </a-tab-pane>
        <a-tab-pane key="2" tab="性能监控"></a-tab-pane>
        <a-tab-pane key="3" tab="备案白名单"></a-tab-pane>
        <a-tab-pane key="4" tab="操作日志"></a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { runningStatusEnum } from "@/utils/enum";
import CloudDetail from "@/components/Cloud/cloudDetail";
export default {
  components: { CloudDetail },
  data() {
    return {
      runningStatusEnum
    };
  },
  created() {},
  methods: {
    // 获取服务器实例详情
    getDetail() {},
    // tabs切换回调
    tabsCallback(key) {
      console.log(key);
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
