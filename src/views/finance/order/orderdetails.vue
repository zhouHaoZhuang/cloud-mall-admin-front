<template>
  <div class="orderInfo" v-if="data[0]">
    <!-- 订单信息 -->
    <div v-if="orderInfo" class="channel">
      <p>订单信息</p>
      <ul>
        <li>
          <span>订单ID:</span>
          <span>{{ orderInfo.orderNo }}</span>
        </li>
        <li>
          <span>订单类型:</span>
          <span>{{ orderInfo.tradeType === 1 ? "新购" : "销售" }} </span>
        </li>
        <li>
          <span>创建时间:</span>
          <span>{{ orderInfo.createTime | formatDate }}</span>
        </li>
        <li>
          <span>状态:</span>
          <span
            :class="{
              green: orderInfo.payStatus === 1,
              blue: orderInfo.payStatus !== 1
            }"
            >{{ orderInfo.payStatus === 1 ? "已支付" : "未支付" }}</span
          >
        </li>
        <li>
          <span>支付时间:</span>
          <span>{{ orderInfo.payTime | formatDate }}</span>
        </li>
      </ul>
      <div class="config">
        <div>
          <span>价格备注:</span>
          <span>{{ orderInfo.priceRemark }}</span>
        </div>
        <div>
          <span>订单备注:</span>
          <span>{{ orderInfo.orderRemarks }}</span>
        </div>
        <div>
          <span>配置信息</span>
        </div>
        <a-table
          :columns="columns"
          :data-source="data"
          rowKey="corporationCode"
          :scroll="{ x: 1300 }"
        >
          <a slot="name" slot-scope="text">{{ text }}</a>
          <div slot="tradeType" slot-scope="text">
            <span v-if="text === 1">新购</span>
            <span v-if="text === 5">升配</span>
            <span v-if="text === 10">降配</span>
            <span v-if="text === 15">续费</span>
            <span v-if="text === 20">退费</span>
          </div>
          <div slot="productConfig" slot-scope="text">
            <div>CPU:{{ text.cpu }}</div>
            <div>内存:{{ text.memory }}</div>
            <div>磁盘:{{ text.disk }}</div>
            <div>带宽:{{ text.internetMaxBandwidthOut }}</div>
            <div>防御:{{ "20G" }}</div>
            <div>操作系统:{{ text.osName }}</div>
            <div>所在区:{{ text.regionId }}</div>
          </div>
          <div slot="">

          </div>
        </a-table>
      </div>
    </div>
    <!-- 用户信息 -->
    <div class="channel">
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
    </div>
    <!-- 业务信息 -->
    <div class="channel">
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderInfo: null,
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
          title: "数量",
          dataIndex: "quantity",
          key: "quantity"
        },
        {
          title: "付费方式",
          dataIndex: "chargeModel",
          key: "chargeModel"
        },
        {
          title: "原价",
          dataIndex: "originAmount",
          key: "originAmount"
        },
        {
          title: "订单金额",
          dataIndex: "actualAmount",
          key: "actualAmount"
        },
        {
          title: "推广优惠",
          key: "promotionPreference",
          dataIndex: "promotionPreference"
        },
        {
          title: "代金券抵扣",
          key: "deduction",
          dataIndex: "deduction"
        },
        {
          title: "现金实付",
          key: "cashActualPay",
          dataIndex: "cashActualPay"
        }
      ]
    };
  },
  activated() {
    let id = this.$route.query.id;
    // console.log(id);
    this.$store.dispatch("financialOrder/getOne", id).then(res => {
      console.log(res);
      // let dataDisk = res.data.ecsPrice.dataDisk;
      // let dataDiskSize = 0;
      // if (dataDisk) {
      //   for (let index = 0; index < dataDisk.length; index++) {
      //     dataDiskSize += dataDisk[index].size;
      //   }
      //   res.data.ecsPrice.dataDiskSize = dataDiskSize;
      // }
      // console.log(dataDisk);
      this.orderInfo = res.data;
      this.data = [res.data];
    });
  }
};
</script>

<style lang="less" scoped>
.orderInfo {
  // background-color: #fff;
  margin: 0 24px;
  // padding: 16px;
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
    > ul {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      padding-left: 10px;
      > li {
        list-style: none;
        width: 32%;
        > span:nth-child(1) {
          display: inline-block;
          width: 80px;
          text-align: right;
          padding-right: 8px;
          font-size: 14px;
          font-weight: 400;
          line-height: 65px;
          color: rgba(0, 0, 0, 0.847);
        }
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
      width: 52px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      border-radius: 2px;
    }
    .blue {
      display: inline-block;

      background-color: rgb(64, 169, 255);
      color: rgb(255, 255, 255);
      font-size: 12px;
      width: 52px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      border-radius: 2px;
    }
  }
}
</style>
