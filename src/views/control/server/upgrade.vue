<template>
  <div class="upgrade-container">
    <DetailHeader title="升级配置" />
    <div class="info-box">
      <a-icon class="icon" type="exclamation-circle" />
      服务器升级后，到期时间不变，差价的计算精确到天；升级价格计算公式：(升级配置价格[月]
      - 原始配置价格[月]) * 12 / 365 * 到期剩余天数。
    </div>
    <a-tabs v-model="tabKey" @change="handleTabChange">
      <a-tab-pane key="1" tab="实例规格"> </a-tab-pane>
      <a-tab-pane key="2" tab="SSD数据盘"> </a-tab-pane>
      <a-tab-pane key="3" tab="公网带宽"> </a-tab-pane>
    </a-tabs>
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="IP地址"> {{ detail.outIp }} </a-form-model-item>
      <a-form-model-item v-if="tabKey === '1'" label="CPU">
        <a-select
          style="width: 160px"
          v-model="form.cpu"
          placeholder="请选择"
          @change="getRegionData"
        >
          <a-select-option
            v-for="item in cpuData"
            :key="item.value"
            :value="item.value"
          >
            {{ item.title }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item v-if="tabKey === '1'" label="内存">
        <a-select
          style="width: 160px"
          v-model="form.memory"
          placeholder="请选择"
          @change="getRegionData"
        >
          <a-select-option
            v-for="item in memoryData"
            :key="item.value"
            :value="item.value"
          >
            {{ item.title }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item v-if="tabKey === '2'" label="SSD数据盘">
        <div
          v-for="(item, index) in form.dataDisk"
          :key="item.id"
          class="datasidk-item"
        >
          <div class="input-number-box">
            <a-input-number
              v-model="item.size"
              class="input-number"
              :min="item.min"
              :max="500"
              @change="getPrice"
            />
            <div class="txt">GB</div>
          </div>
          <div class="action-box">
            <div v-if="item.default" class="add">
              <div class="left-btn" @click="addDisk">
                <a-icon class="icon" type="plus-circle" theme="filled" />
                <span>添加数据盘</span>
              </div>
              <div class="info">
                还可以添加
                <span class="strong">{{ 4 - form.dataDisk.length }}</span>
                块数据盘
              </div>
            </div>
            <div v-if="!item.old" class="del">
              <div class="left-btn" @click="delDisk(index)">
                <a-icon class="icon" type="minus-circle" theme="filled" />
                <span class="txt">删除磁盘</span>
              </div>
            </div>
          </div>
        </div>
      </a-form-model-item>
      <a-form-model-item v-if="tabKey === '3'" label="公网带宽">
        <div class="input-number-box">
          <a-input-number
            v-model="form.internetMaxBandwidthOut"
            class="input-number"
            :min="minBandwidth"
            :max="100"
            @change="getPrice"
          />
          <div class="txt">Mbps</div>
        </div>
      </a-form-model-item>
      <a-form-model-item label="到期时间">
        {{ detail.endTimeStr }}
      </a-form-model-item>
      <a-form-model-item label="升级差价">
        <div class="price">{{ price.tradePrice }}</div>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 10, offset: 5 }">
        <a-button :disabled="priceLoading" type="primary" @click="handleSubmit"
          >确认提交</a-button
        >
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { snapshotDayEnum } from "@/utils/enum";
import { setCpuOrDiskData } from "@/utils/index";
import DetailHeader from "@/components/Common/detailHeader";
export default {
  components: {
    DetailHeader
  },
  data() {
    return {
      snapshotDayEnum,
      setCpuOrDiskData,
      detail: {},
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      form: {
        cpu: undefined,
        memory: undefined,
        dataDisk: [],
        internetMaxBandwidthOut: 1
      },
      cpuData: [],
      memoryData: [],
      // 最小带宽
      minBandwidth: 1,
      price: {
        tradePrice: "0.00"
      },
      priceLoading: true,
      // 是否是第一次进入，第一次进入不需要询价
      firstIn: true,
      tabKey: "1"
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
          this.detail = {
            ...res.data
          };
          if (this.tabKey === "1") {
            this.form = {
              cpu: res.data.cpu,
              memory: res.data.memory
            };
            this.getCpu();
          }
          if (this.tabKey === "2") {
            this.form = {
              dataDisk: res.data.dataDisk.map((item, index) => {
                return {
                  ...item,
                  id: index === 0 ? -1 : -1 - index,
                  min: item.size,
                  old: true,
                  default: index === 0
                };
              })
            };
          }
          if (this.tabKey === "3") {
            this.form.internetMaxBandwidthOut =
              res.data.internetMaxBandwidthOut;
            this.minBandwidth = res.data.internetMaxBandwidthOut;
          }
        });
    },
    // 获取地域对应的cpu信息
    getCpu() {
      this.$store
        .dispatch("cloud/getAddressCpu", { regionId: this.detail.regionId })
        .then((res) => {
          this.cpuData = [...setCpuOrDiskData(res.data?.cpuCoreCount, "核")];
          if (this.cpuData.length > 0) {
            this.getDisk();
          } else {
            this.memoryData = [];
            this.firstIn = false;
          }
        });
    },
    // 获取地域对应的内存信息
    getDisk(cpu) {
      this.$store
        .dispatch("cloud/getAddressDisk", {
          regionId: this.detail.regionId,
          cpuCoreCount: cpu || this.cpuData[0].value
        })
        .then((res) => {
          this.memoryData = [...setCpuOrDiskData(res.data, "G")];
          this.getRegionData();
        });
    },
    // 添加一块ssd数据盘
    addDisk() {
      if (this.form.dataDisk.length === 4) {
        return;
      }
      this.form.dataDisk.push({
        ...this.form.dataDisk[0],
        id: this.form.dataDisk[this.form.dataDisk.length - 1].id - 1,
        size: 40,
        min: 40,
        default: false,
        old: false
      });
      this.getRegionData();
    },
    // 删除一块ssd数据盘
    delDisk(index) {
      this.form.dataDisk.splice(index, 1);
      this.getRegionData();
    },
    // 获取对应的实例和实例属性，属性值---目前页面没有设计选择，默认拿第一个
    getRegionData() {
      this.$store
        .dispatch("cloud/getRegionDetail", {
          regionId: this.detail.regionId,
          cpuCoreCount: this.form.cpu,
          memorySize: this.form.memory
        })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            this.form.instanceType = res.data[0].instanceTypeId;
            this.getPrice();
          } else {
            this.$message.warning("该地域/内存/CPU下没有实例");
          }
        })
        .finally(() => {
          this.firstIn = false;
        });
    },
    // 获取询价或提交时的请求参数
    getParams() {
      return {
        cpu: this.form.cpu,
        memory: this.form.memory,
        dataDisk: this.form.dataDisk,
        id: this.$route.query.id,
        instanceType: this.form.instanceType,
        internetMaxBandwidthOut: this.form.internetMaxBandwidthOut
      };
    },
    // 升级询价
    getPrice() {
      if (this.firstIn) return;
      this.price.tradePrice = "价格计算中...";
      this.priceLoading = true;
      this.$store
        .dispatch("cloud/getcloudUpgradePrice", this.getParams())
        .then((res) => {
          this.price = { ...res.data, tradePrice: res.data.tradePrice + "元" };
        })
        .finally(() => {
          this.priceLoading = false;
        });
    },
    // tab切换
    handleTabChange(val) {
      console.log(val);
      this.getDetail();
    },
    // 确认提交
    handleSubmit() {
      this.priceLoading = true;
      this.$store
        .dispatch("cloud/cloudUpgrade", this.getParams())
        .then((res) => {
          this.$message.success("升级配置成功");
          this.$router.back();
        })
        .finally(() => {
          this.priceLoading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.upgrade-container {
  .info-box {
    display: flex;
    align-items: center;
    padding: 7px 22px 5px 37px;
    min-height: 32px;
    border: 1px solid #ffdac2;
    border-radius: 2px;
    color: #ff6600;
    font-size: 12px;
    margin-bottom: 20px;
    background: #fff3eb;
    margin-top: 20px;
    .icon {
      font-size: 16px;
      margin-right: 6px;
    }
  }
  .input-number-box {
    width: 160px;
    position: relative;
    .input-number {
      width: 160px;
    }
    .txt {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 28px;
    }
  }
  .datasidk-item {
    display: flex;
    margin-bottom: 10px;
    .action-box {
      .add {
        display: flex;
        align-items: center;
        .left-btn {
          color: #ff6600;
          font-size: 14px;
          margin-right: 5px;
          cursor: pointer;
          .icon {
            font-size: 18px;
            margin-right: 5px;
            margin-left: 15px;
          }
        }
        .info {
          .strong {
            color: #ff6600;
            font-weight: 600;
          }
        }
      }
      .del {
        display: flex;
        align-items: center;
        .left-btn {
          color: #00aaff;
          font-size: 14px;
          margin-right: 5px;
          cursor: pointer;
          .icon {
            font-size: 18px;
            margin-right: 5px;
            margin-left: 15px;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.upgrade-container {
  .ant-input-number-handler-wrap {
    opacity: 1 !important;
  }
}
</style>
