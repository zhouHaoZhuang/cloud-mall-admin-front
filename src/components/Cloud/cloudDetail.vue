<template>
  <div class="example-detail-container">
    <div class="public-box">
      <div class="public-title">基本信息</div>
      <div class="public-list">
        <div class="public-item">
          <div class="public-label">名称</div>
          <div class="public-value">
            服务器名称
            <a-icon class="icon-edit" type="edit" @click="handleUpdateName" />
          </div>
        </div>
        <div class="public-item">
          <div class="public-label">地域</div>
          <div class="public-value">中国大连</div>
        </div>
        <div class="public-item">
          <div class="public-label">登录账号</div>
          <div class="public-value">adminssssssss</div>
        </div>
        <div class="public-item">
          <div class="public-label">操作系统</div>
          <div class="public-value">Windows Server 2008 R2 64位 企业版</div>
        </div>
        <div class="public-item">
          <div class="public-label">公网IP</div>
          <div class="public-value">43.226.39.91:3389</div>
        </div>
        <div class="public-item">
          <div class="public-label">私有IP</div>
          <div class="public-value">43.226.39.91:3389</div>
        </div>
      </div>
    </div>
    <div class="public-box">
      <div class="public-title">付费信息</div>
      <div class="public-list">
        <div class="public-item">
          <div class="public-label">付费方式</div>
          <div class="public-value">服务器名称</div>
        </div>
        <div class="public-item">
          <div class="public-label">关联订单</div>
          <div class="public-value">
            <span class="color-blue">100020</span>
            [购买]
          </div>
        </div>
        <div class="public-item"></div>
        <div class="public-item">
          <div class="public-label">创建时间</div>
          <div class="public-value">Windows Server 2008 R2 64位 企业版</div>
        </div>
        <div class="public-item">
          <div class="public-label">到期时间</div>
          <div class="public-value">43.226.39.91:3389</div>
        </div>
        <div class="public-item">
          <div class="public-label">自动续费</div>
          <div class="public-value">43.226.39.91:3389</div>
        </div>
        <div class="public-item public-item-row">
          <div class="public-label">操作</div>
          <div class="public-value">
            <a-space>
              <a-button class="color-btn" @click="handleRenew">
                产品续费
              </a-button>
              <a-button class="color-btn" @click="handleAutoRenew">
                自动续费
              </a-button>
            </a-space>
          </div>
        </div>
      </div>
    </div>
    <div class="public-box">
      <div class="public-title">配置信息</div>
      <div class="public-list">
        <div class="public-item">
          <div class="public-label">实例规格</div>
          <div class="public-value">服务器名称</div>
        </div>
        <div class="public-item">
          <div class="public-label">SSD系统盘</div>
          <div class="public-value">中国大连</div>
        </div>
        <div class="public-item">
          <div class="public-label">SSD数据盘</div>
          <div class="public-value">adminssssssss</div>
        </div>
        <div class="public-item">
          <div class="public-label">公网带宽</div>
          <div class="public-value">Windows Server 2008 R2 64位 企业版</div>
        </div>
        <div class="public-item">
          <div class="public-label">防御峰值</div>
          <div class="public-value">43.226.39.91:3389</div>
        </div>
        <div class="public-item"></div>
        <div class="public-item public-item-row">
          <div class="public-label">操作</div>
          <div class="public-value">
            <a-space>
              <a-button class="color-btn">升级配置</a-button>
              <a-button class="color-btn">相同配置创建</a-button>
            </a-space>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改实例名称弹窗 -->
    <UpdateNameModal v-model="updateNameVisible" />
    <!-- 产品续费弹窗 -->
    <RenewModal v-model="renewVisible" />
    <!-- 自动产品续费弹窗 -->
    <AutoRenewModal v-model="autoRenewVisible" />
  </div>
</template>

<script>
import { runningStatusEnum } from "@/utils/enum";
import UpdateNameModal from "@/components/Cloud/CloudModal/updateNameModal";
import RenewModal from "@/components/Cloud/CloudModal/renewModal";
import AutoRenewModal from "@/components/Cloud/CloudModal/autoRenewModal";
export default {
  components: {
    UpdateNameModal,
    RenewModal,
    AutoRenewModal
  },
  data() {
    return {
      runningStatusEnum,
      // 修改实例名称弹窗
      updateNameVisible: false,
      // 产品续费弹窗
      renewVisible: false,
      // 自动产品续费弹窗
      autoRenewVisible: false
    };
  },
  created() {},
  methods: {
    // 点击修改实例名称
    handleUpdateName() {
      this.updateNameVisible = true;
    },
    // 点击产品续费
    handleRenew() {
      this.renewVisible = true;
    },
    // 点击自动产品续费
    handleAutoRenew() {
      this.autoRenewVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.example-detail-container {
  .public-box {
    margin-bottom: 20px;
    .public-title {
      height: 40px;
      line-height: 40px;
      color: #636566;
      font-weight: 700;
      padding-left: 16px;
      padding-right: 6px;
      border-top: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
      background-color: #f7f9fa;
      font-size: 12px;
    }
    .public-list {
      display: flex;
      flex-wrap: wrap;
      .public-item {
        width: 33.33%;
        min-height: 50px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e5e5e5;
        font-size: 12px;
        color: #262829;
        .public-label {
          width: 95px;
          margin-left: 36px;
          text-align: left;
          margin-right: 15px;
          color: #a0a2a3;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .public-value {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          .color-blue {
            color: #00aaff;
          }
          .color-btn {
            border: 1px solid #eb5e00;
            background-color: #ff6600;
            border-radius: 4px;
            color: #fff;
          }
          .icon-edit {
            font-size: 16px;
            margin-left: 5px;
            color: #00aaff;
            cursor: pointer;
          }
        }
      }
      .public-item-row {
        width: 100%;
      }
    }
  }
}
</style>
