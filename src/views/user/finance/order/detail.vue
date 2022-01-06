<template>
  <div class="orderInfo">
    <!-- 订单信息 -->
    <div v-if="orderInfo" class="channel">
      <DetailHeader title="订单信息" back="/user/finance/trash" />
      <!-- 状态为未支付时的提示文字 -->
      <div v-if="orderInfo.payStatus === 0" class="unpaid-box">
        <a-icon class="icon" type="exclamation-circle" />
        请于
        <span class="time">
          {{ endTime }}
        </span>
        前完成订单。若未及时支付，系统将自动取消订单，该订单将无法再次发起支付。
      </div>
      <ul class="detail-box">
        <li>
          <span>订单ID:</span>
          <span>{{ orderInfo.orderNo }}</span>
        </li>
        <li>
          <span>订单类型:</span>
          <span>{{ tradeTypeEnum[orderInfo.tradeType] }} </span>
        </li>
        <li>
          <span>关联订单:</span>
          <span>{{ orderInfo.mergeOrderNo || "--" }}</span>
        </li>
        <li>
          <span>创建时间:</span>
          <span>{{ orderInfo.orderCreateTime | formatDate }}</span>
        </li>
        <li v-if="orderInfo.payStatus === 0">
          <span>支付剩余时间:</span>
          <span class="strong">{{ countDownTime }}</span>
        </li>
        <li>
          <span>支付状态:</span>
          <span
            :class="{
              green: orderInfo.payStatus === 1,
              blue: orderInfo.payStatus !== 1
            }"
          >
            {{ payStatusEnum[orderInfo.payStatus] }}
          </span>
        </li>
        <li v-if="orderInfo.payStatus === 0" class="cancelOrder-btn">
          <a-button @click="cancelOrder">取消订单</a-button>
        </li>
      </ul>
      <div class="config">
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
          <div slot="productConfig" slot-scope="text">
            <div>线路:{{ text.regionId }}</div>
            <div>CPU:{{ text.cpu }}</div>
            <div>内存:{{ text.memory }}</div>
            <div>带宽:{{ text.internetMaxBandwidthOut }}</div>
            <div>防御:{{ "20G" }}</div>
            <div>镜像:{{ text.osName }}</div>
            <div>系统盘:{{ text.dataDiskSize }}</div>
            <div>数据盘:{{ text.systemDiskSize }}</div>
            <div>自动续费:否</div>
          </div>
        </a-table>
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
      v-if="orderInfo.payStatus === 0"
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
import { payStatusEnum, tradeTypeEnum } from "@/utils/enum";
export default {
  components: { DetailHeader, PaySelect },
  data() {
    return {
      payStatusEnum,
      tradeTypeEnum,
      orderInfo: {},
      data: [],
      columns: [
        {
          title: "产品名称",
          dataIndex: "productName",
          key: "productName",
          width: 100
        },
        {
          title: "类型",
          dataIndex: "tradeType",
          key: "tradeType",
          scopedSlots: { customRender: "tradeType" }
        },
        {
          title: "配置信息",
          key: "productConfig",
          scopedSlots: { customRender: "productConfig" }
        },
        {
          title: "时长",
          dataIndex: "period",
          key: "period"
        },
        {
          title: "数量",
          dataIndex: "quantity",
          key: "quantity"
        },
        {
          title: "费用",
          dataIndex: "discountAmount",
          key: "discountAmount"
        }
      ],
      countDownTime: "--时--分--秒",
      time: null,
      payTime: null,
      endTime: ""
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
          if (res.data.payStatus === 0) {
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
            .dispatch("income/cancelOrder", { id: this.orderInfo.id })
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
          if (res.data.payStatus !== 0) {
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
    > p {
      font-size: 16px;
      padding: 16px;
      padding-left: 30px;
      font-weight: 650;
      margin: 0;
      color: rgba(0, 0, 0, 0.847);
      border-bottom: 1px solid rgb(233, 233, 233);
    }
    .detail-box {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      padding: 20px;
      padding-bottom: 0;
      background-color: #f7f9fa;
      border: 1px solid #ebeced;
      font-size: 12px;
      margin-top: 20px;
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
