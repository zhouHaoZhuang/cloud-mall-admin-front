<template>
  <div class="list">
    <h1 class="ny-panel-title">发票列表</h1>
    <div class="title-info">
      <div class="title-left">
        <div class="title-lefttop">
          <a-row class="title-topleft" :gutter="16">
            <a-col :span="4">
              <a-statistic
                :value="dataAmount.totalAmount"
                class="demo-class font-weight600"
              >
                <div style="white-space: nowrap" slot="title">
                  总计消费可开票
                </div>
                <template #prefix> ￥ </template>
              </a-statistic>
            </a-col>
            <a-col :span="2">
              <div class="calculate" style="color: #3b77e3">减</div>
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
            <a-col :span="2">
              <div class="calculate" style="color: #3b77e3">减</div>
            </a-col>
            <a-col :span="4">
              <a-statistic
                title="本月不可开"
                :value="dataAmount.invisibleAmount"
                class="demo-class font-weight600"
              >
                <template #prefix> ￥ </template>
              </a-statistic>
            </a-col>
            <a-col :span="2">
              <div class="calculate" style="color: #3b77e3">等于</div>
            </a-col>
            <a-col :span="4">
              <a-statistic
                :value="dataAmount.canInvoiceAmount"
                style="margin-right: 50px"
                class="font-weight600"
                :value-style="{ color: '#3B77E3', 'white-space': 'nowrap' }"
                groupSeparator=""
              >
                <div style="white-space: nowrap" slot="title">可开票金额</div>
                <template #prefix> ￥ </template>
              </a-statistic>
            </a-col>
          </a-row>
          <a-button
            @click="$router.push('/user/finance/bill/apply')"
            type="primary"
            style="margin: 20px"
          >
            申请开票
          </a-button>
        </div>
        <div class="bill-info">
          <div>
            <a-descriptions title="默认发票信息" :column="1">
              <a-descriptions-item label="开票类型">
                <a>{{ issueTypeMap[invoiceInfo.issueType] }}</a>
              </a-descriptions-item>
              <a-descriptions-item label="发票类型">
                <a>{{ invoiceTypeMap[invoiceInfo.invoiceType] }}</a>
              </a-descriptions-item>
              <a-descriptions-item label="发票抬头">
                <a>{{ invoiceInfo.invoiceTitle }}</a>
              </a-descriptions-item>
              <a-descriptions-item label="税务登记号">
                <a>{{ invoiceInfo.registerNo }}</a>
              </a-descriptions-item>
              <a-descriptions-item label="">
                <a-button
                  @click="$router.push('/user/finance/bill/managebill')"
                  type="primary"
                >
                  管理发票信息
                </a-button>
              </a-descriptions-item>
            </a-descriptions>
          </div>
          <div>
            <a-descriptions title="默认地址信息" :column="1">
              <a-descriptions-item label="收件人">
                <a>{{ addressInfo.addressee }}</a>
              </a-descriptions-item>
              <a-descriptions-item label="联系电话">
                <a>{{ addressInfo.concatPhone }}</a>
              </a-descriptions-item>
              <a-descriptions-item label="地址">
                <a>
                  {{ addressInfo.province }} {{ addressInfo.city }}
                  {{ addressInfo.county }}
                </a>
              </a-descriptions-item>
              <a-descriptions-item label="详细地址">
                <a>{{ addressInfo.address }}</a>
              </a-descriptions-item>
              <a-descriptions-item label="">
                <a-button
                  @click="$router.push('/user/finance/manageadress')"
                  type="primary"
                >
                  管理常用地址
                </a-button>
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </div>
      </div>
      <div class="title-right">
        <h1 class="font-weight600" style="margin-left: 0; white-space: nowrap">
          <span>欠票未冲抵总金额：</span>
          <span style="color: #d9001b">-￥{{ dataAmount.negativeAmount }}</span>
        </h1>
        <div>
          <p>(明细)</p>
          <div>
            <a-table
              :columns="columnsDetails"
              :data-source="dataDetails"
              rowKey="id"
              :pagination="false"
              :scroll="{ y: 200 }"
            >
            </a-table>
          </div>
        </div>
      </div>
    </div>
    <!-- <p class="ny-panel-title">开票记录</p> -->
    <div class="bottom-list">
      <div style="margin: 20px 0; background-color: #fff">
        <a-input
          style="width: 200px"
          placeholder="请输入发票ID进行搜索"
          v-model="listQuery.invoiceNo"
          allowClear
        />
        <a-button style="margin-left: 10px" type="primary" @click="getList">
          查询
        </a-button>
      </div>
      <div style="background-color: #fff">
        <a-table
          :columns="columns"
          :data-source="data"
          :pagination="paginationProps"
          rowKey="id"
          :scroll="{ y: 200 }"
        >
          <div slot="companyName" slot-scope="text">{{ text }}</div>
          <div v-if="text" slot="createTime" slot-scope="text">
            {{ text | formatDate }}
          </div>
          <div v-if="text" slot="feedbackTime" slot-scope="text">
            {{ text | formatDate }}
          </div>
          <div slot="status" slot-scope="text">
            {{ invoiceStatusEnum[text] }}
          </div>
          <div slot="action" slot-scope="text, record">
            <a-button
              type="link"
              @click="$router.push('/user/finance/bill/info?id=' + record.id)"
              >详情</a-button
            >
            <a-button
              type="link"
              :disabled="record.status !== 1"
              @click="
                $router.push('/user/finance/bill/address?id=' + record.id)
              "
            >
              修改地址
            </a-button>
            <a-button
              type="link"
              :class="{ 'del-red': record.status === 1 }"
              :disabled="record.status !== 1"
              @click="cancelInvoice(record.id)"
            >
              取消
            </a-button>
            <a-button
              type="link"
              style="color: #d9001b"
              v-show="record.status === 5"
              @click="
                $router.push('/user/finance/bill/resubmit?id=' + record.id)
              "
            >
              申请退票
            </a-button>
          </div>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import { invoiceStatusEnum } from "@/utils/enum.js";
export default {
  data() {
    return {
      issueTypeMap: {
        1: "个人",
        2: "企业"
      },
      invoiceTypeMap: {
        1: "增值税普通发票",
        2: "增值税专用发票"
      },
      dataAmount: {},
      invoiceStatusEnum,
      data: [],
      columns: [
        {
          title: "发票ID",
          dataIndex: "invoiceNo",
          scopedSlots: { customRender: "invoiceNo" }
        },
        {
          title: "发票抬头",
          dataIndex: "invoiceTitle"
        },
        {
          title: "开票金额",
          dataIndex: "invoiceAmount"
        },
        {
          title: "申请状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" }
        },
        {
          title: "申请时间",
          dataIndex: "createTimeShow"
        },
        {
          title: "反馈时间",
          dataIndex: "feedbackTimeShow"
        },
        {
          title: "操作",
          key: "action",
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
        invoiceNo: undefined,
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
        this.data = [...res.data.list];
        this.paginationProps.total = res.data.totalCount * 1;
      });
    },
    // 取消发票记录
    cancelInvoice(id) {
      this.$confirm({
        title: "确定要取消吗?",
        onOk: () => {
          this.$store.dispatch("billlist/del", id).then((res) => {
            this.$message.success("取消成功");
            this.getList();
          });
        }
      });
    },
    // 明细
    getDetailsList() {
      this.$store.dispatch("billlist/getDetails").then((res) => {
        console.log(res, "明细");
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
          console.log(this.addressInfo, "----");
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
.list {
  background-color: #f5f7fd;
}
.calculate {
  margin-top: 15px;
}
.font-weight600 {
  font-weight: 400;
}
.del-red {
  color: #d9001b;
}
.title-info {
  display: flex;
  .title-left {
    width: 70%;
    margin-bottom: 20px;
    .bill-info {
      display: flex;
      height: 300px;
      > div {
        padding: 10px;
        height: 106%;
        margin-right: 20px;
        background-color: #fff;
        box-shadow: 0px 0px 13px 7px #bdc0fd3b;
      }
    }
    .title-lefttop {
      display: flex;
      justify-content: space-between;
      background-color: #fff;
      box-shadow: 0px 0px 13px 7px #bdc0fd3b;
      padding: 20px;
      margin: 0 20px 20px 0;
      .title-topleft {
        flex: 1;
      }
      .bill-info {
        width: 100px;
      }
    }
  }
  .title-right {
    width: 30%;
    padding: 10px;
    background-color: #fff;
  }
}
/deep/.ant-table {
  min-width: 0 !important;
}
.bottom-list {
  margin: 20px 0;
  padding: 20px;
  background-color: #fff;
}
// ::v-deep .ant-table-tbody{
//   height: 200px!important;
//   overflow-y: scroll!important;
// }
</style>
