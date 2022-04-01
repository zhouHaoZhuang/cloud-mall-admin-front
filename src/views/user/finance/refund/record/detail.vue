<template>
  <div class="orderInfo">
    <!-- 订单信息 -->
    <div v-if="orderInfo" class="channel">
      <DetailHeader title="退订详情" back="/user/finance/refund/record" />
      <!-- 状态为未支付时的提示文字 -->
      <div v-if="orderInfo.tradeStatus === 1" class="unpaid-box">
        <a-icon class="icon" type="exclamation-circle" />
        请于
        <span class="time">
          {{ endTime }}
        </span>
        前完成订单。若未及时支付，系统将自动取消订单，该订单将无法再次发起支付。
      </div>
      <div class="outbox">
        <p class="purchase-tittle">订单信息</p>
        <ul class="detail-box">
          <li>
            <span>退单编号:</span>
            <span>{{ orderInfo.orderNo }}</span>
          </li>
          <li>
            <span>订单类型:</span>
            <span>{{ tradeType[orderInfo.tradeType] }} </span>
          </li>
          <li>
            <span>创建时间:</span>
            <span>{{ orderInfo.orderCreateTime | formatDate }}</span>
          </li>
          <li>
            <span>退款原因:</span>
            <span>{{ orderInfo.orderCreateTime | formatDate }}</span>
          </li>
        </ul>
      </div>
      <div class="outbox">
        <p class="purchase-tittle">退款信息</p>
        <ul class="detail-box">
          <li>
            <span>退款金额:</span>
            <span>{{ orderInfo.orderNo }}</span>
          </li>
          <li>
            <span>退款状态:</span>
            <span>{{ tradeTypeEnum[orderInfo.tradeType] }} </span>
          </li>
           <li v-if="orderInfo.tradeStatus === 5">
            <span>退款时间:</span>
            <span>{{ payTime }} </span>
          </li>
        </ul>
      </div>
      <div class="config">
        <p class="purchase-tittle">产品信息</p>
        <a-table
          :columns="columns"
          :data-source="data"
          rowKey="corporationCode"
          :pagination="false"
        >
          <a slot="name" slot-scope="text">{{ text }}</a>
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
              <!-- <span v-if="record.autoRenew === 1">
                /{{ record.renewPeriod
                }}{{ getAutoRenewUnit(record.renewUnit) }}
              </span> -->
            </div>
          </div>
          <span slot="period" slot-scope="text, record">
            {{ text }}{{ record.priceUnit === "Month" ? "个月" : "年" }}
          </span>
          <span slot="discountAmount" style="color: #ff6600" slot-scope="text">
            {{ text }}元
          </span>
        </a-table>
      </div>
      <!-- 应付金额 -->
      <div class="should-pay">
        <span class="pay-left">应付金额:</span>
        ¥
        <span class="price-one">{{ price.toString().split(".")[0] }}</span
        >.
        <span class="price-other">{{ price.toString().split(".")[1] }}</span>
      </div>
    </div>
    <!-- 用户信息 -->
    <!-- <div class="channel">
      <p>用户信息</p>
      <ul>
        <li>
          <span>会员ID:</span>
          <span>{{ data[0].corporationCode }}</span>
        </li>
        <li>
          <span>姓名:</span>
          <span>{{ data[0].realName }} </span>
        </li>
        <li>
          <span>实名认证:</span>
          <span>{{ data[0].remark }}</span>
        </li>
        <li>
          <span>联系电话:</span>
          <span>{{ data[0].phoneNumber }}</span>
        </li>
        <li>
          <span>电子邮箱:</span>
          <span>{{ data[0].email }}</span>
        </li>
        <li>
          <span>qq账号:</span>
          <span>{{ data[0].qq }}</span>
        </li>
      </ul>
    </div> -->
    <!-- 业务信息 -->
    <!-- <div class="channel">
      <p>业务信息</p>
      <ul>
        <li>
          <span>业务ID:</span>
          <span>{{ data[0].id }}</span>
        </li>
        <li>
          <span>产品类型:</span>
          <span>{{ data[0].tradeType }} </span>
        </li>
        <li>
          <span>IP地址:</span>
          <span>{{ data[0].outIp }}</span>
        </li>
        <li>
          <span>创建时间:</span>
          <span>{{ data[0].createTime | formatDate }}</span>
        </li>
        <li>
          <span>到期时间:</span>
          <span>{{ data[0].stockEndTime | formatDate }}</span>
        </li>
      </ul>
    </div> -->
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
import {
  tradeTypeEnum,
  regionDataEnum,
  tradeType
} from "@/utils/enum";
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
      tradeTypeEnum,
      regionDataEnum,
      tradeType,
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
          dataIndex: "chargingType"
        },
        {
          title: "原价",
          dataIndex: "quantity"
        },
        {
          title: "推广优惠",
          dataIndex: "discountAmount",
          key:1
        },
        {
          title: "折扣",
          dataIndex: "discountRate"
        },
        {
          title: "成交价",
          dataIndex: "actualAmount"
        },
        {
          title: "退款金额",
          dataIndex: "discountAmount",
          scopedSlots: { customRender: "discountAmount" },
          key:2

        }
      ],
      countDownTime: "--时--分--秒",
      time: null,
      payTime: null,
      endTime: "",
      price: 11.234
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
    // 获取详情
    getDetail() {
      this.$store
        .dispatch("income/getOne", this.$route.query.id)
        .then((res) => {
          this.orderInfo = { ...res.data };
          this.data = [{ ...res.data }];
          if (res.data.tradeStatus === 1) {
            this.startCountDown(res.data.orderCreateTime);
          }
        });
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
    .should-pay {
      float: right;
      margin-top: 10px;
      .pay-left {
        margin-right: 20px;
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
</style>
