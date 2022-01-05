<template>
  <div class="example-detail-container">
    <div class="public-box">
      <div class="public-title">基本信息</div>
      <div class="public-list">
        <div class="public-item">
          <div class="public-label">名称</div>
          <div class="public-value">
            {{ detail.instanceName }}
            <!-- <a-icon class="icon-edit" type="edit" @click="handleUpdateName" /> -->
          </div>
        </div>
        <div class="public-item">
          <div class="public-label">地域</div>
          <div class="public-value">{{ detail.regionId }}</div>
        </div>
        <div class="public-item">
          <div class="public-label">登录账号</div>
          <div class="public-value">{{ userInfo.username }}</div>
        </div>
        <div class="public-item">
          <div class="public-label">操作系统</div>
          <div class="public-value">{{ detail.osName }}</div>
        </div>
        <div class="public-item">
          <div class="public-label">公网IP</div>
          <div class="public-value">{{ detail.outIp }}</div>
        </div>
        <div class="public-item">
          <div class="public-label">私有IP</div>
          <div class="public-value">{{ detail.innerIp }}</div>
        </div>
      </div>
    </div>
    <div class="public-box">
      <div class="public-title">付费信息</div>
      <div class="public-list">
        <div class="public-item">
          <div class="public-label">付费方式</div>
          <div class="public-value">包年包月</div>
        </div>
        <div class="public-item">
          <div class="public-label">关联订单</div>
          <div class="public-value">
            <span class="color-blue"> {{ detail.orderNo }}</span>
            [购买]
          </div>
        </div>
        <div class="public-item"></div>
        <div class="public-item">
          <div class="public-label">创建时间</div>
          <div class="public-value">{{ detail.createTimeStr }}</div>
        </div>
        <div class="public-item">
          <div class="public-label">到期时间</div>
          <div class="public-value">{{ detail.endTimeStr }}</div>
        </div>
        <div class="public-item">
          <div class="public-label">自动续费</div>
          <div class="public-value">
            <span v-if="detail.autoRenew === 0" class="auto-txt color-red">
              未开通
            </span>
            <span v-else class="auto-txt"> 已开通 </span>
          </div>
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
          <div class="public-value">{{ detail.cpu }}核{{ detail.memory }}G</div>
        </div>
        <div class="public-item">
          <div class="public-label">SSD系统盘</div>
          <div class="public-value">{{ detail.systemSize }}G</div>
        </div>
        <div class="public-item">
          <div class="public-label">SSD数据盘</div>
          <div class="public-value">{{ getDataSidkNum }}G</div>
        </div>
        <div class="public-item">
          <div class="public-label">公网带宽</div>
          <div class="public-value">{{ detail.internetMaxBandwidthOut }}M</div>
        </div>
        <div class="public-item"></div>
        <!-- <div class="public-item">
          <div class="public-label">防御峰值</div>
          <div class="public-value">{{ detail.instanceName }}</div>
        </div> -->
        <div class="public-item"></div>
        <div class="public-item public-item-row">
          <div class="public-label">操作</div>
          <div class="public-value">
            <a-space>
              <a-button class="color-btn" @click="handleCloudUpgrade">
                升级配置
              </a-button>
              <a-button class="color-btn">相同配置创建</a-button>
            </a-space>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改实例名称弹窗 -->
    <UpdateNameModal v-model="updateNameVisible" />
    <!-- 产品续费弹窗 -->
    <RenewModal v-model="renewVisible" :detail="detail" />
    <!-- 自动产品续费弹窗 -->
    <AutoRenewModal
      v-model="autoRenewVisible"
      :detail="detail"
      @success="autoRenewSuccess"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { runningStatusEnum } from "@/utils/enum";
import UpdateNameModal from "@/components/Cloud/CloudModal/updateNameModal";
import RenewModal from "@/components/Cloud/CloudModal/renewModal";
import AutoRenewModal from "@/components/Cloud/CloudModal/autoRenewModal";
export default {
  props: {
    // 实例详情
    detail: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    UpdateNameModal,
    RenewModal,
    AutoRenewModal
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    }),
    // 返回数据盘大小
    getDataSidkNum() {
      let sum = 0;
      this.detail.dataDisk &&
        this.detail.dataDisk.forEach((ele) => {
          sum += ele.size;
        });
      return sum;
    }
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
    },
    // 自动续费成功回调
    autoRenewSuccess(autoRenew) {
      this.detail.autoRenew = autoRenew;
    },
    // 跳转升级
    handleCloudUpgrade() {
      this.$router.push({
        path: "/control/server/upgrade",
        query: {
          id: this.detail.id
        }
      });
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
          .color-red {
            color: red;
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
