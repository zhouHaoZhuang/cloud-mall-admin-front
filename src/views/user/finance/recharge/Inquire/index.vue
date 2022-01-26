<template>
  <div class="record-content">
    <p class="record-title">
      <span>
        温馨提示：线下汇款后，您的款项具体到账时间依赖于银行系统，请耐心等待。常见问题可查看充值说明
      </span>
    </p>
    <div class="search">
      <a-input-group compact enterButton="true">
        <a-select v-model="listQuery.key">
          <a-select-option value="accountBankName"> 汇款银行 </a-select-option>
          <a-select-option value="accountCode"> 汇款账号 </a-select-option>
          <a-select-option value="accountName"> 汇款户名 </a-select-option>
        </a-select>
        <a-input-search
          style="width: 250px"
          placeholder="请输入搜索关键词"
          enter-button
          @search="onSearch"
        />
        <span class="refresh" @click="getList()">
          <a-icon type="reload" />
        </span>
      </a-input-group>
    </div>
    <div>
      <a-table
        rowKey="id"
        :columns="columns"
        :data-source="data"
        :pagination="paginationProps"
      >
        <div slot="createTime" slot-scope="text" v-if="text">
          {{ text | formatDate }}
        </div>
        <div slot="action" slot-scope="text, record">
          <a-button type="link" @click="seeDetails(record.id)"
            >查看详情</a-button
          >
        </div>
        <div slot-scope="text" slot="status">
          {{ offlineRemittance[text] }}
        </div>
      </a-table>
    </div>
    <div class="modal-details" v-show="isinfo">
      <div class="modal-details-info">
        <div class="modal-details-title">
          <span>线下汇款详情</span>
          <span @click="isinfo = false">
            <a-icon type="close" />
          </span>
        </div>
        <div class="modal-details-type" v-if="dataInfo">
          <div
            class="modal-details-type-info"
            v-if="dataInfo.ccCompanyInfoResDto"
          >
            <h1>收款方信息</h1>
            <div class="modal-details-type-list">
              <div>
                <span class="modal-details-key">汇款账户名称:</span>
                <span class="modal-details-value">
                  {{ dataInfo.ccCompanyInfoResDto.companyName }}
                </span>
              </div>
              <div>
                <span class="modal-details-key">银行账户:</span>
                <span class="modal-details-value">
                  {{ dataInfo.ccCompanyInfoResDto.bankAccount }}
                </span>
              </div>
              <div>
                <span class="modal-details-key">开户银行:</span>
                <span class="modal-details-value">
                  {{ dataInfo.ccCompanyInfoResDto.openBank }}
                </span>
              </div>
              <!-- <div>
                <span class="modal-details-key">汇款备注:</span>
                <span class="modal-details-value">
                  {{ dataInfo.ccCompanyInfoResDto.memo }}
                </span>
              </div> -->
            </div>
          </div>
          <div class="modal-details-type-info">
            <h1>充值信息</h1>
            <div class="modal-details-type-list">
              <div>
                <span class="modal-details-key">汇款人ID:</span>
                <span class="modal-details-value">
                  {{ dataInfo.applyUserCode }}
                </span>
              </div>
              <!-- <div>
                <span class="modal-details-key">汇款人手机:</span
                ><span class="modal-details-value">33322233----</span>
              </div> -->
              <div>
                <span class="modal-details-key">汇款金额:</span>
                <span class="modal-details-value">
                  {{ dataInfo.amount }}
                </span>
              </div>
              <div>
                <span class="modal-details-key">汇款户名:</span>
                <span class="modal-details-value">
                  {{ dataInfo.accountName }}
                </span>
              </div>
              <div>
                <span class="modal-details-key">汇款账号:</span>
                <span class="modal-details-value">
                  {{ dataInfo.accountCode }}
                </span>
              </div>
              <div>
                <span class="modal-details-key">汇款银行:</span>
                <span class="modal-details-value">
                  {{ dataInfo.accountBankName }}
                </span>
              </div>
              <div>
                <span class="modal-details-key"></span
                ><span class="modal-details-value"></span>
              </div>
              <div>
                <span class="modal-details-key">汇款凭证:</span>
                <p class="img-url">
                  <img :src="dataInfo.voucher" alt="" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { offlineRemittance } from "@/utils/enum";
export default {
  data() {
    return {
      isinfo: false,
      data: [],
      offlineRemittance,
      listQuery: {
        key: "accountBankName",
        search: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
        sorter: ""
      },
      columns: [
        {
          title: "汇款账户",
          dataIndex: "accountCode"
        },
        {
          title: "账户名称",
          dataIndex: "accountName"
        },
        {
          title: "汇款金额",
          dataIndex: "amount",
          key: "amount",
          sorter: (a, b) => a.amount - b.amount
        },
        {
          title: "汇款日期",
          dataIndex: "createTime",
          key: "createTime",
          scopedSlots: {
            customRender: "createTime"
          },
          sorter: (a, b) =>
            new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
        },
        {
          title: "审核状态",
          dataIndex: "status",
          key: "status",
          scopedSlots: {
            customRender: "status"
          }
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: {
            customRender: "action"
          }
        }
      ],
      paginationProps: {
        showQuickJumper: true,
        showSizeChanger: true,
        total: 1,
        showTotal: (total, range) =>
          `共 ${total} 条记录 第 ${this.listQuery.currentPage} / ${Math.ceil(
            total / this.listQuery.pageSize
          )} 页`,
        onChange: this.quickJump,
        onShowSizeChange: this.onShowSizeChange
      },
      tableLoading: false,
      dataInfo: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    onSearch(value) {
      // console.log(value,'ghasgha');
      this.listQuery.search = value;
      this.getList();
    },
    seeDetails(id) {
      this.isinfo = true;
      console.log(id, this.isinfo, "是否显示");
      this.$store.dispatch("inquire/getOne", id).then((res) => {
        console.log(res);
        this.dataInfo = res.data;
      });
    },
    getList() {
      this.$getList("inquire/getList", this.listQuery).then((res) => {
        this.data = res.data.list;
        this.paginationProps.total = res.data.totalCount * 1;
        console.log(res);
      });
    },
    // 排序的回调
    // handleChange(pagination, filters, sorter) {
    //   console.log("Various parameters", pagination, filters, sorter);
    //   this.filteredInfo = filters;
    //   this.sortedInfo = sorter;
    // },
    quickJump(current) {
      this.listQuery.currentPage = current;
      this.getList();
    },
    onShowSizeChange(current, pageSize) {
      this.listQuery.pageSize = pageSize;
      this.listQuery.currentPage = current;
      this.getList();
    }
  }
};
</script>

<style lang="less" scoped>
.table-operations {
  margin-bottom: 16px;
}
.table-operations > button {
  margin-right: 8px;
}
.record-content {
  .record-title {
    padding: 7px 22px 5px 37px;
    background: #fff3eb url(../../../../../assets/img/pay/ExclamationMark.png)
      no-repeat 10px 8px;
    min-height: 32px;
    border: 1px solid #ffda95;
    border-radius: 2px;
    color: #ff6600;
    font-size: 12px;
  }
  .search {
    margin-bottom: 20px;
  }
  .refresh {
    float: right;
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    border: 1px solid #d9d9d9;
    font-size: 17px;
  }
  .img-url {
    display: inline-block;
    width: 100px;
    margin-left: 20px;
    img {
      width: 100%;
    }
  }
  .modal-details {
    position: absolute;
    top: -56px;
    left: -328px;
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.466);
    .modal-details-info {
      background-color: #fff;
      width: 63%;
      height: 70%;
    }
    .modal-details-title {
      font-family: "Arial Normal", "Arial";
      font-weight: 400;
      font-style: normal;
      font-size: 20px;
      padding: 20px;
      display: flex;
      color: #333;
      justify-content: space-between;
      background-color: #f2f2f2;
    }
    .modal-details-type {
      padding: 30px;
    }
    .modal-details-type-info {
      h1 {
        font-size: 15px;
        padding: 10px;
      }
      .modal-details-type-list {
        display: flex;
        flex-wrap: wrap;
        padding-left: 45px;
        font-size: 13px;
        color: #333333;
        div {
          width: 32%;
          line-height: 50px;
          display: flex;
          align-items: center;
          .modal-details-key {
            display: inline-block;
            width: 81px;
            text-align: right;
          }
          .modal-details-value {
            margin-left: 2%;
            display: block;
            line-height: 20px;
            word-wrap: break-word;
            width: 63%;
            // height: 50px;
            // background-color: rgb(255, 108, 108);
          }
        }
      }
    }
  }
}
</style>
