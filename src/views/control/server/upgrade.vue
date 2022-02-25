<template>
  <div class="upgrade-container">
    <DetailHeader :title="title" />
    <div class="info-box">
      <a-icon class="icon" type="exclamation-circle" />
      <span v-if="isUpgrade">
        服务器升级后，到期时间不变，差价的计算精确到天；升级价格计算公式：(升级配置价格[月]
        - 原始配置价格[月]) * 12 / 365 * 到期剩余天数。
      </span>
      <span v-else>
        实例必须处于已停止（Stopped）状态每台实例降低配置次数不能超过三次。
      </span>
    </div>
    <a-tabs v-model="tabKey" @change="handleTabChange">
      <a-tab-pane key="1" tab="实例规格"> </a-tab-pane>
      <a-tab-pane v-if="isUpgrade" key="2" tab="SSD数据盘"> </a-tab-pane>
      <a-tab-pane key="3" tab="公网带宽"> </a-tab-pane>
    </a-tabs>
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="IP地址"> {{ detail.outIp }} </a-form-model-item>
      <a-form-model-item label="当前规格">
        <span style="margin-right: 20px">
          CPU：
          {{ example.cpu }}核
        </span>
        <span>
          内存：
          {{ example.memory }}G
        </span>
      </a-form-model-item>
      <a-form-model-item v-if="tabKey === '1'" label="分类">
        <a-radio-group v-model="form.specFamily" @change="typeChange">
          <a-radio
            v-for="item in typeList"
            :key="item.typeFamily"
            :value="item.typeFamily"
          >
            {{ item.typeFamily }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item class="cpu-wrap" v-if="tabKey === '1'" label="CPU">
        <a-select
          style="width: 160px"
          v-model="form.cpu"
          placeholder="请选择"
          @change="handleCpuChange"
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
      <a-form-model-item class="memory-wrap" v-if="tabKey === '1'" label="内存">
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
            <NumberInput
              v-model="item.size"
              :disabled="item.old"
              :on-change="getPrice"
            />
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
          <NumberInput
            v-if="minBandwidth && maxBandwidth"
            v-model="form.internetMaxBandwidthOut"
            company="M"
            :step="1"
            :min="minBandwidth"
            :max="maxBandwidth"
            :on-change="getPrice"
          />
        </div>
      </a-form-model-item>
      <a-form-model-item label="到期时间">
        {{ detail.endTimeStr }}
      </a-form-model-item>
      <a-form-model-item :label="isUpgrade ? '升级差价' : '降配差价'">
        <div class="price">{{ price.tradePrice }}</div>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 10, offset: 5 }">
        <a-button type="primary" @click="handleSubmit"> 确认提交 </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { snapshotDayEnum } from "@/utils/enum";
import { setCpuOrDiskData } from "@/utils/index";
import DetailHeader from "@/components/Common/detailHeader";
import NumberInput from "@/components/NumberInput/index";
export default {
  components: {
    DetailHeader,
    NumberInput
  },
  data() {
    return {
      snapshotDayEnum,
      setCpuOrDiskData,
      type: "", // 标识是升级还是降配
      detail: {},
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      form: {
        specFamily: undefined,
        cpu: undefined,
        memory: undefined,
        dataDisk: [],
        internetMaxBandwidthOut: 1
      },
      cpuData: [],
      memoryData: [],
      // 最小带宽
      minBandwidth: undefined,
      // 最大带宽
      maxBandwidth: undefined,
      price: {
        tradePrice: "0.00元"
      },
      priceLoading: true,
      tabKey: "1",
      // 保存旧配置
      // 实例规格
      example: {
        cpu: undefined,
        memory: undefined
      },
      // 数据盘块数
      dataSidkCount: undefined,
      // 带宽
      oldBandwidth: undefined,
      typeList: []
    };
  },
  computed: {
    title() {
      return this.type ? "降低配置" : "升级配置";
    },
    // 是否是升级配置
    isUpgrade() {
      return !this.type ? true : false;
    }
  },
  watch: {
    $route: {
      handler(newVal) {
        this.type = newVal.query.type;
      },
      immediate: true
    }
  },
  created() {
    this.getDetail();
  },
  methods: {
    // 获取分类列表
    getTypeList() {
      this.$store.dispatch("cloud/typeList").then((res) => {
        this.typeList = [...res.data];
        this.form.specFamily =
          Array.isArray(res.data) && res.data.length > 0
            ? res.data[0].typeFamily
            : undefined;
        this.getCpu();
      });
    },
    // 分类change
    typeChange() {
      this.getCpu();
    },
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
              // cpu: res.data.cpu,
              // memory: res.data.memory,
              cpu: undefined,
              memory: undefined,
              specFamily: res.data.instanceTypeFamily
            };
            // 保存旧配置
            this.example = {
              cpu: res.data.cpu,
              memory: res.data.memory,
              specFamily: res.data.instanceTypeFamily
            };
            this.getTypeList();
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
            // 保存旧配置
            this.dataSidkCount = res.data.dataDisk.length;
          }
          if (this.tabKey === "3") {
            this.form = {
              internetMaxBandwidthOut: res.data.internetMaxBandwidthOut
            };
            if (this.isUpgrade) {
              this.minBandwidth = res.data.internetMaxBandwidthOut;
              this.maxBandwidth = 100;
            } else {
              this.minBandwidth = 1;
              this.maxBandwidth = res.data.internetMaxBandwidthOut;
            }
            // 保存旧配置
            this.oldBandwidth = res.data.internetMaxBandwidthOut;
          }
        });
    },
    // 处理cpu+内存的数据，需要截取当前配置之后的数据
    returnCpuOrDiskData(data, cpuOrMemory) {
      if (data.length === 0) {
        return [];
      }
      const index = data.findIndex((ele) => ele * 1 === cpuOrMemory);
      if (index !== -1) {
        const newData = this.isUpgrade
          ? data.slice(index)
          : data.slice(0, index + 1);
        return newData;
      } else {
        return data;
      }
    },
    // 获取地域对应的cpu信息
    getCpu() {
      this.$store
        .dispatch("cloud/getAddressCpu", {
          regionId: this.detail.regionId,
          specFamily: this.form.specFamily,
          operatorType: this.isUpgrade ? "upgrade" : "downgrade",
          instanceId: this.detail.instanceId
        })
        .then((res) => {
          const newRes = res.data ? res.data : [];
          const newData = this.returnCpuOrDiskData(newRes, this.example.cpu);
          this.cpuData = [...setCpuOrDiskData(newData, "核")];
          if (this.cpuData.length > 0) {
            this.form.cpu = this.cpuData[0].value;
            this.getDisk();
          } else {
            this.$message.warning("没有可用的实例信息");
            this.memoryData = [];
            this.form.cpu = undefined;
            this.form.memory = undefined;
          }
        });
    },
    // 获取地域对应的内存信息
    getDisk() {
      this.$store
        .dispatch("cloud/getAddressDisk", {
          regionId: this.detail.regionId,
          specFamily: this.form.specFamily,
          cpuCoreCount: this.form.cpu,
          operatorType: this.isUpgrade ? "upgrade" : "downgrade",
          instanceId: this.detail.instanceId
        })
        .then((res) => {
          const newRes = res.data ? res.data : [];
          const newData = this.returnCpuOrDiskData(newRes, this.example.memory);
          this.memoryData = [...setCpuOrDiskData(newData, "G")];
          this.form.memory =
            this.memoryData.length > 0 ? this.memoryData[0].value : undefined;
          if (this.memoryData.length === 0) {
            this.$message.warning("没有可用的实例信息");
          }
          // 校验是否修改了配置
          const isChange = this.verifyChange(this.form);
          if (isChange) {
            this.getRegionData();
          } else {
            this.price.tradePrice = "0.00元";
          }
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
      this.getPrice();
    },
    // 删除一块ssd数据盘
    delDisk(index) {
      this.form.dataDisk.splice(index, 1);
      this.getPrice();
    },
    // 获取对应的实例和实例属性，属性值---目前页面没有设计选择，默认拿第一个
    getRegionData() {
      this.$store
        .dispatch("cloud/getRegionDetail", {
          regionId: this.detail.regionId,
          specFamily: this.form.specFamily,
          cpuCoreCount: this.form.cpu,
          memorySize: this.form.memory,
          operatorType: this.isUpgrade ? "upgrade" : "downgrade",
          instanceId: this.detail.instanceId
        })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            this.form.instanceType = res.data[0].instanceTypeId;
            this.getPrice();
          } else {
            this.$message.warning("该地域/内存/CPU下没有实例");
          }
        });
    },
    // 获取询价或提交时的请求参数
    getParams() {
      const newDataDisk =
        this.tabKey === "2"
          ? this.form.dataDisk.filter((ele) => !ele.old)
          : undefined;
      return {
        specFamily: this.form.specFamily,
        cpu: this.form.cpu,
        memory: this.form.memory,
        dataDisk: newDataDisk,
        id: this.$route.query.id,
        instanceType: this.form.instanceType,
        instanceTypeFamily: this.detail.instanceTypeFamily,
        internetMaxBandwidthOut: this.form.internetMaxBandwidthOut,
        type: this.type
      };
    },
    // 升级询价
    getPrice() {
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
      this.getDetail();
      this.price.tradePrice = "0.00元";
    },
    // cpu的change事件
    handleCpuChange(val) {
      this.getDisk(true);
    },
    // 提交前校验是否有修改配置，没有修改需要驳回提交
    verifyChange(data) {
      console.log(this.example, data, this.tabKey);
      if (this.tabKey === "1") {
        if (this.example.specFamily !== data.specFamily) {
          return true;
        }
        return (
          this.example.cpu !== data.cpu || this.example.memory !== data.memory
        );
      }
      if (this.tabKey === "2") {
        return this.form.dataDisk.length !== this.dataSidkCount;
      }
      if (this.tabKey === "3") {
        return data.internetMaxBandwidthOut !== this.oldBandwidth;
      }
    },
    // 确认提交
    handleSubmit() {
      const data = this.getParams();
      // 校验是否修改了配置
      const isChange = this.verifyChange(data);
      if (!isChange) {
        this.$message.warning("没有调整配置");
        return;
      }
      this.priceLoading = true;
      this.$store
        .dispatch("cloud/cloudUpgrade", data)
        .then((res) => {
          if (this.isUpgrade) {
            this.$message.success("提交升级配置订单成功");
            this.$router.push({
              path: "/user/finance/orderDetail",
              query: {
                id: res.data.orderNo
              }
            });
          } else {
            this.$message.success("提交降低配置成功");
            this.$router.back();
          }
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
  .price {
    color: #ff6600;
    font-weight: 500;
    font-size: 16px;
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
