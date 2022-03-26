<template>
  <div class="orderInfo">
    <!-- 订单信息 -->
    <div v-if="orderInfo" class="channel">
      <DetailHeader title="资源退订" back="/user/finance/trash" />

      <div class="config">
        <a-table
          :columns="columns"
          :data-source="data"
          rowKey="id"
          :pagination="false"
        >
          <a slot="name" slot-scope="text">{{ text }}</a>
          <div slot="chargingType" slot-scope="text">
            <span v-if="text === 'Beforepay'">预付费</span>
            <span v-if="text === 'AfterPay'">后付费</span>
          </div>
          <div slot="tradeType" slot-scope="text">
            {{ tradeTypeEnum[text] }}
          </div>
          <div slot="productConfig" slot-scope="text, record">
            <!-- <div>线路:{{ regionDataEnum[record.regionId] }}</div> -->
            <div>CPU:{{ record.cpu }}核</div>
            <div>内存:{{ record.memory }}G</div>
            <div>带宽:{{ record.internetMaxBandwidthOut }}M</div>
            <div>镜像:{{ record.osName }}</div>
            <div>系统盘:{{ record.systemDiskSize }}G</div>
            <div>数据盘:{{ record.dataDiskSize }}G</div>
            <div>
              自动续费:
              <span v-if="record.autoRenew === 0" style="color: red">
                未开通
              </span>
              <span v-if="record.autoRenew === 1" style="color: #2bbe22">
                已开通
              </span>
            </div>
          </div>
          <div slot="orderCreateTime" slot-scope="text">
            <div>{{ text }}</div>
          </div>
        </a-table>
      </div>
      <div class="outbox">
        <p class="purchase-tittle">*退订原因</p>
        <a-radio-group
          :options="plainOptions"
          :default-value="value1"
          @change="onChange1"
        />
        <a-textarea
          placeholder="少于100字"
          v-model="textarea"
          :maxLength="100"
          :rows="4"
          class="textarea"
        />
        <!-- 应付金额 -->
        <div class="should-pay">
          <span>实付金额:</span>
          <span class="price-top">¥</span>
          <span>{{ price }}</span>
          <br />
          <span class="refund-price">退款金额:</span>
          <span class="price-bottom">¥</span>
          <span class="price-one">{{ price.toString().split(".")[0] }}</span>
          <span v-if="priceFlag">.</span>
          <span class="price-other">{{ price.toString().split(".")[1] }}</span>
          <br />
          <br />
          <a-checkbox v-model="checked" @change="onChange"> </a-checkbox>
          <span class="price-bottom">我已知晓退订规则，确认退订金额</span>
        </div>
      </div>
    </div>
    <!-- 订单支付模块 -->
    <PaySelect
      v-if="orderInfo.tradeStatus === 1"
      :detail="orderInfo"
      @success="startTime"
    />
  </div>
</template>

<script>
import moment from "moment";
import DetailHeader from "@/components/Common/detailHeader";
import PaySelect from "@/components/Finance/paySelect";
import { useLeftTime } from "@/utils/index";
import { orderStatusEnum, tradeTypeEnum, regionDataEnum } from "@/utils/enum";
const plainOptions = [
  "配置选择错误",
  "地域节点选择错误",
  "不会操作/操作过于复杂",
  "程序或者软件不兼容",
  "性能(或网络)不稳定",
  "业务测试完毕退订",
  "其他"
];
const options = [
  { label: "配置选择错误", value: "1" },
  { label: "地域节点选择错误", value: "2" },
  { label: "不会操作/操作过于复杂", value: "3" },
  { label: "程序或者软件不兼容", value: "4" },
  { label: "性能(或网络)不稳定", value: "5" },
  { label: "业务测试完毕退订", value: "6" },
  { label: "其他", value: "7" }
];
export default {
  components: { DetailHeader, PaySelect },
  computed: {
    // 根据自动续费周期的单位返回文字
    getAutoRenewUnit() {
      return function (unit) {
        if (unit === "Month") {
          return "个月";
        }
        if (unit === "Year") {
          return "年";
        }
      };
    }
  },
  data() {
    return {
      plainOptions,
      orderStatusEnum,
      tradeTypeEnum,
      regionDataEnum,
      options,
      orderInfo: {},
      data: [],
      columns: [
        {
          title: "产品名称",
          dataIndex: "productName"
        },
        {
          title: "具体配置",
          dataIndex: "productConfig",
          scopedSlots: { customRender: "productConfig" }
        },
        {
          title: "计费方式",
          dataIndex: "chargingType",
          scopedSlots: { customRender: "chargingType" }
        },
        {
          title: "订单时间",
          dataIndex: "orderCreateTime",
          scopedSlots: { customRender: "orderCreateTime" }
        },
        {
          title: "退款金额",
          dataIndex: "actualAmount",
          scopedSlots: { customRender: "actualAmount" }
        }
      ],
      countDownTime: "--时--分--秒",
      time: null,
      payTime: null,
      endTime: "",
      price: 11.234,
      value1: "配置选择错误",
      textarea: "",
      checked: false,
      priceFlag: false
    };
  },
  created() {
    this.getDetail();
  },
  beforeDestroy() {
    this.time && clearInterval(this.time);
    this.payTime && clearInterval(this.payTime);
  },
  methods: {
    getDetail() {
      let aaa = [
        {
          orderNo: "22222222",
          tradeStatus: 22,
          id: 1
        }
      ];
      this.data = aaa;
      // 测试获取列,上方代码待删除
      this.$store
        .dispatch("income/getOne", this.$route.query.id)
        .then((res) => {
          this.orderInfo = { ...res.data };
          this.data = [{ ...res.data }];
          this.price = this.orderInfo.actualAmount;
          //判断是否有小数点
          let isnan = this.price.toString().split("").indexOf(".");
          if (isnan === -1) {
            this.priceFlag = false;
          } else {
            this.priceFlag = true;
          }
          if (res.data.tradeStatus === 1) {
            this.startCountDown(res.data.orderCreateTime);
          }
        });
    },
    onChange() {
      console.log("我是复选框");
    },
    onChange1(e) {
      console.log("radio1 checked", e.target.value);
    },
    // 开启倒计时计算支付剩余时间
    startCountDown(createTime) {
      this.time && clearInterval(this.time);
      this.endTime = moment(createTime)
        .add(30, "m")
        .format("YYYY-MM-DD HH:mm:ss");
      this.time = setInterval(() => {
        const diff = moment(this.endTime).diff(moment(), "ms");
        if (diff < 0) {
          clearInterval(this.time);
          this.$router.back();
          return;
        }
        const [HH, mm, ss] = useLeftTime(diff);
        this.countDownTime = `${HH}时${mm}分${ss}秒`;
      }, 1000);
    },
    // 取消订单
    cancelOrder() {
      this.$confirm({
        title: "确认要取消订单吗？",
        onOk: () => {
          this.$store
            .dispatch("income/cancelOrder", { id: this.orderInfo.orderId })
            .then((res) => {
              this.$message.success("取消订单成功");
              this.getDetail();
            });
        }
      });
    },
    // 获取详情
    getDetailStatus() {
      this.$store
        .dispatch("income/getOne", this.$route.query.id)
        .then((res) => {
          if (res.data.tradeStatus !== 1) {
            this.orderInfo = { ...res.data };
            clearInterval(this.payTime);
          }
        });
    },
    // 开启轮询查询订单详情
    startTime() {
      this.payTime && clearInterval(this.payTime);
      this.payTime = setInterval(() => {
        this.getDetailStatus();
      }, 3000);
    }
  }
};
</script>

<style lang="less" scoped>
.orderInfo {
  margin: 0 24px;
  .outbox {
    margin-top: 20px;
  }
  .unpaid-box {
    padding: 7px 22px 5px 37px;
    background: #fff3eb;
    min-height: 32px;
    border: 1px solid #ffdac2;
    border-radius: 2px;
    color: #ff6600;
    font-size: 12px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    .icon {
      font-size: 20px;
      margin-right: 10px;
    }
    .time {
      color: #00aaff;
    }
  }
  .channel {
    margin-bottom: 20px;
    background-color: #fff;
    .outbox {
      background-color: #f0f2f5;
      padding: 20px;
    }
    .should-pay {
      float: right;
      margin-top: 40px;
      text-align: right;
      .price-top {
        margin-left: 30px;
      }
      .price-bottom {
        margin-left: 20px;
      }
      .refund-price {
        font-size: 16px;
        color: #c35a67;
      }

      .price-one {
        font-size: 16px;
        color: #c35a67;
      }
      .price-other {
        font-size: 14px;
        color: #c35a67;
      }
    }

    > p {
      font-size: 16px;
      padding: 16px;
      padding-left: 30px;
      font-weight: 650;
      margin: 0;
      color: rgba(0, 0, 0, 0.847);
      border-bottom: 1px solid rgb(233, 233, 233);
    }
    .purchase-tittle {
      font-weight: 500;
      font-size: 18px;
      border-bottom: none;
    }
    .detail-box {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      padding: 10px 20px;
      padding-bottom: 0;
      // background-color: #f7f9fa;
      border-bottom: 1px solid #ebeced;
      font-size: 12px;
      position: relative;
      li {
        list-style: none;
        width: 33.33%;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        > span:nth-child(1) {
          display: inline-block;
          width: 100px;
          text-align: right;
          padding-right: 8px;
          font-size: 14px;
          font-weight: 400;
          color: #a0a2a3;
        }
        .strong {
          color: #ff6600;
        }
      }
      .cancelOrder-btn {
        width: auto;
        position: absolute;
        right: 20px;
        bottom: 11px;
        margin: 0;
      }
    }
    .allocation {
      display: inline-block;
      width: 80px;
      text-align: right;
      margin-right: 5px;
      line-height: 65px;
    }
    .config {
      margin-top: 20px;
      > div {
        > span:nth-child(1) {
          display: inline-block;
          width: 80px;
          text-align: right;
          margin-right: 5px;
          line-height: 65px;
        }
      }
    }
    .green {
      background-color: rgb(115, 209, 61);
      color: rgb(255, 255, 255);
      display: inline-block;
      font-size: 12px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      border-radius: 2px;
      padding: 0 4px;
    }
    .blue {
      display: inline-block;
      background-color: rgb(64, 169, 255);
      color: rgb(255, 255, 255);
      font-size: 12px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      border-radius: 2px;
      padding: 0 4px;
    }
  }
}
::v-deep .ant-radio-wrapper {
  margin: 0 30px 20px 0;
}
</style>
