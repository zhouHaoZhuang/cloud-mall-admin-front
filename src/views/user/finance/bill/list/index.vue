<template>
  <div>
    <h1 class="font-weight600">发票列表</h1>
    <div class="title-info">
      <div class="title-left">
        <a-row :gutter="16">
          <a-col :span="4">
            <a-statistic
              :value="1128"
              style="margin-right: 50px"
              class="font-weight600"
              :value-style="{ color: '#02A7F0', 'white-space': 'nowrap' }"
              groupSeparator=""
            >
              <div style="white-space: nowrap" slot="title">可开票金额</div>
              <template #prefix> ￥ </template>
            </a-statistic>
          </a-col>
          <a-col :span="2"> <div class="calculate">=</div> </a-col>
          <a-col :span="4">
            <a-statistic :value="93" class="demo-class font-weight600">
              <div style="white-space: nowrap" slot="title">总计消费可开票</div>
              <template #prefix> ￥ </template>
            </a-statistic>
          </a-col>
          <a-col :span="2">
            <div class="calculate">-</div>
          </a-col>
          <a-col :span="4">
            <a-statistic
              title="历史已开票"
              :value="100"
              class="demo-class font-weight600"
            >
              <template #prefix> ￥ </template>
            </a-statistic>
          </a-col>
          <a-col :span="2"> <div class="calculate">-</div> </a-col>
          <a-col :span="4">
            <a-statistic
              title="本月不可开"
              :value="300"
              class="demo-class font-weight600"
            >
              <template #prefix> ￥ </template>
            </a-statistic>
          </a-col>
        </a-row>
        <a-button
          @click="$router.push('/user/finance/bill/apply')"
          type="primary"
          style="margin: 20px 0"
          >申请开票</a-button
        >
        <div class="bill-info">
          <div>
            <a-descriptions title="默认发票信息" :column="2">
              <a-descriptions-item label="开票类型"> 企业 </a-descriptions-item>
              <a-descriptions-item label="发票类型">
                增值税专用发票
              </a-descriptions-item>
              <a-descriptions-item label="发票抬头">
                上海XX公司
              </a-descriptions-item>
              <a-descriptions-item label="税务登记号">
                9100001111
              </a-descriptions-item>
              <a-descriptions-item label=""> </a-descriptions-item>
              <a-descriptions-item label="">
                <a @click="$router.push('/user/finance/bill/billmanage')"
                  >管理发票信息→</a
                >
              </a-descriptions-item>
            </a-descriptions>
          </div>
          <div>
            <a-descriptions title="默认地址信息" :column="2">
              <a-descriptions-item label="收件人"> 王富贵 </a-descriptions-item>
              <a-descriptions-item label="联系电话">
                1810000000
              </a-descriptions-item>
              <a-descriptions-item label="地址"> 上海 </a-descriptions-item>
              <a-descriptions-item label="详细地址">
                红海桥
              </a-descriptions-item>
              <a-descriptions-item label=""> </a-descriptions-item>
              <a-descriptions-item label="">
                <a href="">管理常用地址→</a>
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </div>
      </div>
      <div class="title-right">
        <h1 class="font-weight600" style="margin-left: 0; white-space: nowrap">
          <span>欠票未冲抵总金额：</span>
          <span style="color: #d9001b">￥100</span>
        </h1>
        <div>
          <p>明细</p>
          <div>
            <a-table :columns="columnsDetails" :data-source="dataDetails">
            </a-table>
          </div>
        </div>
      </div>
    </div>
    <p>开票记录</p>
    <div style="margin: 20px 0">
      <a-input style="width: 200px" placeholder="请输入发票ID进行搜索" />
      <a-button style="margin-left: 10px" type="primary">查询</a-button>
    </div>
    <div>
      <a-table :columns="columns" :data-source="data">
        <div slot="companyName" slot-scope="text">{{ text }}</div>
        <div slot="action">
          <a-button type="link">详情</a-button>
          <a-button type="link">修改地址</a-button>
          <a-button type="link">取消</a-button>
          <a-button type="link">申请退票</a-button>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      columns: [
        {
          title: "发票ID",
          dataIndex: "id",
          scopedSlots: { customRender: "id" }
        },
        {
          title: "发票抬头",
          dataIndex: "title"
        },
        {
          title: "开票金额",
          dataIndex: "amount"
        },
        {
          title: "申请状态",
          dataIndex: "status"
        },
        {
          title: "申请时间",
          dataIndex: "createTime"
        },
        {
          title: "反馈时间",
          dataIndex: "updateTime"
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      dataDetails: [],
      columnsDetails: [
        {
          title: "订单ID",
          dataIndex: "id",
          width: "100px"
        },
        {
          title: " 退款金额",
          dataIndex: "amount",
          width: "100px"
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
h1 {
  margin: 20px;
  margin-top: 0;
}
.calculate {
  margin-top: 15px;
}
.font-weight600 {
  font-weight: 600;
}
.title-info {
  display: flex;
  .title-left {
    width: 70%;
    .bill-info {
      display: flex;
    }
  }
  .title-right {
    width: 30%;
    padding: 10px;
  }
}
/deep/.ant-table {
  min-width: 0 !important;
}
</style>
