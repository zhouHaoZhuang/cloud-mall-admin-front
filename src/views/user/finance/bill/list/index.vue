<template>
  <div>
    <h1 class="font-weight600">发票列表</h1>
    <div class="title-info">
      <div class="title-left">
        <a-row :gutter="16">
          <a-col :span="4">
            <a-statistic
              :value="dataAmount.canInvoiceAmount"
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
            <a-statistic
              :value="dataAmount.totalAmount"
              class="demo-class font-weight600"
            >
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
              :value="dataAmount.invoiceAmount"
              class="demo-class font-weight600"
            >
              <template #prefix> ￥ </template>
            </a-statistic>
          </a-col>
          <a-col :span="2"> <div class="calculate">-</div> </a-col>
          <a-col :span="4">
            <a-statistic
              title="本月不可开"
              :value="dataAmount.invisibleAmount"
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
              <a-descriptions-item label="开票类型">
                {{ invoiceInfo.issueType }}
              </a-descriptions-item>
              <a-descriptions-item label="发票类型">
                {{ invoiceInfo.invoiceType }}
              </a-descriptions-item>
              <a-descriptions-item label="发票抬头">
                {{ invoiceInfo.invoiceTitle }}
              </a-descriptions-item>
              <a-descriptions-item label="税务登记号">
                {{ invoiceInfo.registerNo }}
              </a-descriptions-item>
              <a-descriptions-item label=""> </a-descriptions-item>
              <a-descriptions-item label="">
                <a @click="$router.push('/user/finance/bill/billmanage')">
                  管理发票信息→
                </a>
              </a-descriptions-item>
            </a-descriptions>
          </div>
          <div>
            <a-descriptions title="默认地址信息" :column="2">
              <a-descriptions-item label="收件人">
                {{ addressInfo.addressee }}
              </a-descriptions-item>
              <a-descriptions-item label="联系电话">
                {{ addressInfo.concatPhone }}
              </a-descriptions-item>
              <a-descriptions-item label="地址">
                {{ addressInfo.province }} {{ addressInfo.city }}
                {{ addressInfo.county }}
              </a-descriptions-item>
              <a-descriptions-item label="详细地址">
                {{ addressInfo.address }}
              </a-descriptions-item>
              <a-descriptions-item label=""> </a-descriptions-item>
              <a-descriptions-item label="">
                <a @click="$router.push('/user/finance/bill/manageadress')">
                  管理常用地址→
                </a>
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </div>
      </div>
      <div class="title-right">
        <h1 class="font-weight600" style="margin-left: 0; white-space: nowrap">
          <span>欠票未冲抵总金额：</span>
          <span style="color: #d9001b">￥{{ dataAmount.negativeAmount }}</span>
        </h1>
        <div>
          <p>明细</p>
          <div>
            <a-table
              :columns="columnsDetails"
              :data-source="dataDetails"
              :pagination="paginationProps"
              rowKey="id"
            >
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
        <div slot="status" slot-scope="text">{{ invoiceStatusEnum[text] }}</div>
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
import { invoiceStatusEnum } from "@/utils/enum.js";
export default {
  data() {
    return {
      dataAmount: {},
      invoiceStatusEnum,
      data: [],
      columns: [
        {
          title: "发票ID",
          dataIndex: "invoiceInfoId",
          scopedSlots: { customRender: "invoiceInfoId" }
        },
        {
          title: "发票抬头",
          dataIndex: "invoiceTitle"
        },
        {
          title: "开票金额",
          dataIndex: "taxAmount"
        },
        {
          title: "申请状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" }
        },
        {
          title: "申请时间",
          dataIndex: "bizTime"
        },
        {
          title: "反馈时间",
          dataIndex: "feedbackTime"
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
          dataIndex: "orderNo",
          width: "100px"
        },
        {
          title: " 退款金额",
          dataIndex: "debtAmount",
          width: "100px"
        }
      ],
      listQuery: {
        key: "",
        search: "",
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      invoiceInfo: {},
      addressInfo: {},
      paginationProps: {
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total, range) =>
          `共 ${total} 条记录 第 ${this.listQuery.currentPage} / ${Math.ceil(
            total / this.listQuery.pageSize
          )} 页`,
        onChange: this.quickJump,
        onShowSizeChange: this.onShowSizeChange
      }
    };
  },
  created() {
    this.getList();
    this.getAmount();
    this.getDetailsList();
    this.getInvoiceInfo();
    this.getAddressInfo();
  },
  methods: {
    //查询数据表格 开票记录
    getList() {
      this.$getList("billlist/getList", this.listQuery).then((res) => {
        console.log(res);
        this.data = [...res.data.list];
        this.paginationProps.total = res.data.totalCount * 1;
      });
    },
    // 明细
    getDetailsList() {
      this.$store.dispatch("billlist/getDetails").then((res) => {
        console.log(res);
        this.dataDetails = [...res.data.list];
      });
    },
    // 金额
    getAmount() {
      this.$store.dispatch("billlist/getAmount").then((res) => {
        console.log(res);
        this.dataAmount = res.data;
      });
    },
    // 获取发票信息
    getInvoiceInfo() {
      this.$store
        .dispatch("billnews/getList", { currentPage: 1, pageSize: 999 })
        .then((res) => {
          console.log(res);
          this.invoiceInfo = res.data.list.filter((item) => {
            return item.defaultStatus === 1;
          })[0];
        });
    },
    // 地址信息
    getAddressInfo() {
      this.$store
        .dispatch("mangeaddress/getList", { currentPage: 1, pageSize: 5 })
        .then((res) => {
          console.log(res);
          this.addressInfo = res.data.filter((item) => {
            return item.defaultSign === 1;
          })[0];
          console.log(this.addressInfo,'----');
        });
    },
    //表格分页跳转
    quickJump(currentPage) {
      this.listQuery.currentPage = currentPage;
      this.getList();
    },
    //表格分页切换每页条数
    onShowSizeChange(current, pageSize) {
      this.listQuery.currentPage = current;
      this.listQuery.pageSize = pageSize;
      this.getList();
    }
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
