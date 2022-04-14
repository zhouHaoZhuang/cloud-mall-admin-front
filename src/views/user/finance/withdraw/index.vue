<template>
  <div>
    <div class="channel-list-container">
      <h2 class="ny-panel-title">提现申请</h2>

      <div class="public-header-wrap">
        <a-form-model layout="inline" :model="listQuery">
          <a-form-model-item>
            <a-button type="primary" @click="toAdd"> 新建申请 </a-button>
          </a-form-model-item>
          <a-form-model-item>
            <a-input
              v-model="listQuery['qp-orderNo-eq']"
              placeholder="请输入申请单号"
            />
          </a-form-model-item>
          <a-form-model-item>
            <a-range-picker
              :show-time="{
                hideDisabledOptions: true,
                defaultValue: [
                  moment('00:00:00', 'HH:mm:ss'),
                  moment('11:59:59', 'HH:mm:ss')
                ]
              }"
              format="YYYY-MM-DD HH:mm:ss"
              :placeholder="['创建开始时间', '创建结束时间']"
              @change="datePickerOnOk"
            />
          </a-form-model-item>
          <a-form-model-item>
            <a-select
              style="width: 120px"
              allowClear
              v-model="listQuery['qp-status-eq']"
              placeholder="请选择状态"
            >
              <a-select-option
                v-for="(item, keyIndex) in applyStatus"
                :key="item"
                :value="keyIndex"
              >
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item>
            <a-button type="primary" @click="search"> 查询 </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div class="public-table-wrap">
        <a-table
          :loading="tableLoading"
          :columns="columns"
          :data-source="data"
          rowKey="id"
          :pagination="paginationProps"
        >
          <span slot="orderNo" style="color: #00aaff" slot-scope="text">
            {{ text }}
          </span>
          <span slot="status" slot-scope="text">
            <a-tag
              :color="
                text == 1
                  ? '#87d068'
                  : text == 2
                  ? '#2db7f5'
                  : text == 3
                  ? 'red'
                  : text == 4
                  ? 'orange'
                  : text == 5
                  ? 'blue'
                  : 'gray'
              "
              >{{ applyStatus[text] }}</a-tag
            >
          </span>
          <div slot="createTime" slot-scope="text">
            {{ text | formatDate }}
          </div>
          <span slot="action" slot-scope="text, record">
            <a-space>
              <a-button type="link" @click="goDetail(record)"> 详情 </a-button>

              <a-button
                type="link"
                @click="goUpdate(record)"
                v-if="record.status == 0"
              >
                编辑
              </a-button>

              <a-button
                type="danger"
                @click="delOrder(record)"
                v-if="record.status == 0"
              >
                删除
              </a-button>

              <a-button
                type="link"
                @click="cancelOrder(record)"
                :disabled="record.status !== 2"
              >
                取消
              </a-button>
            </a-space>
          </span>
        </a-table>
      </div>
    </div>
    <!-- 新增,编辑申请 -->
    <add-apply
      v-if="visible"
      v-model="visible"
      @success="getList"
      :detailInfo="detailInfos"
      :apply="apply"
      :balance="balance"
    />
    <!-- 申请详情 -->
    <applyOption
      v-model="visibleDetail"
      :detailInfo="detailInfo"
      @success="getList"
      :title="1"
      :type="1"
    />
  </div>
</template>

<script>
import moment from "moment";
import applyOption from "@/components/withdraw/applyOption.vue";
import addApply from "@/components/withdraw/addApply.vue";
import { applyStatus } from "@/utils/enum";
export default {
  components: { addApply, applyOption },
  data() {
    return {
      moment,
      applyStatus,
      apply: 1,
      visibleDetail: false, //是否显示申请详情的弹框
      visible: false, //是否显示新增申请申请
      detailInfo: {}, //详情信息
      detailInfos: {},
      balance: undefined,
      overviewData: {},
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: "申请单号",
          dataIndex: "orderNo",
          scopedSlots: { customRender: "orderNo" }
        },
        {
          title: "提现金额",
          dataIndex: "dealAmount",
          scopedSlots: { customRender: "dealAmount" }
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" }
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          scopedSlots: { customRender: "createTime" }
        },
        {
          title: "反馈时间",
          dataIndex: "finishTime"
        },
        {
          title: "备注",
          dataIndex: "memo",
          scopedSlots: { customRender: "memo" }
        },
        {
          title: "反馈信息",
          dataIndex: "feedback",
          scopedSlots: { customRender: "feedback" }
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      data: [],
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
      tableLoading: false
    };
  },
  created() {
    this.getList();
    this.getDashboardData();
  },
  methods: {
    // 查询
    search() {
      this.listQuery.currentPage = 1;
      this.getList();
    },
    // 查询表格数据
    getList() {
      //   this.tableLoading = true;
      this.$store
        .dispatch("withdraw/getRecordList", this.listQuery)
        .then((res) => {
          this.tableLoading = false;
          this.data = res.data.list;
          this.data.forEach((element) => {
            element.finishTime = element.finishTime
              ? moment(element.finishTime).format("YYYY-MM-DD HH:mm:ss")
              : "";
          });
          this.paginationProps.total = res.data.totalCount * 1;
        });
    },
    // 表格分页快速跳转n页
    quickJump(currentPage) {
      this.listQuery.currentPage = currentPage;
      this.getList();
    },
    // 表格分页切换每页条数
    onShowSizeChange(current, pageSize) {
      this.listQuery.currentPage = current;
      this.listQuery.pageSize = pageSize;
      this.getList();
    },
    // 查看
    goDetail(record) {
      this.visibleDetail = true;
      this.$store
        .dispatch("withdraw/getRecordDetail", record.id)
        .then((res) => {
          this.detailInfo = res.data;
        })
        .finally(() => {
          this.visibleDetail = true;
        });
    },
    getDashboardData() {
      this.$store.dispatch("dashboard/getBalanceAndCoupon").then((res) => {
        const newData = {
          balance: {},
          coupon: {
            balance: "0.00"
          }
        };
        res.data.forEach((ele) => {
          if (ele.accountType === 1) {
            newData.balance = { ...ele };
          }
        });
        this.overviewData = { ...newData };
        this.balance = this.overviewData.balance.balance;
        console.log(this.balance, "this.balance");
      });
    },
    //编辑
    goUpdate(record) {
      this.visible = true;
      this.apply = 2;
      this.$store
        .dispatch("withdraw/getRecordDetail", record.id)
        .then((res) => {
          this.detailInfos = res.data;
        })
        .finally(() => {
          this.visible = true;
        });
    },
    //新增
    toAdd() {
      this.apply = 1;
      this.visible = true;
      this.detailInfos = {};
    },
    // 日期选择
    datePickerOnOk(value) {
      if (value.length !== 0) {
        this.listQuery["qp-createTime-ge"] = moment(value[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.listQuery["qp-createTime-le"] = moment(value[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        this.listQuery["qp-createTime-ge"] = "";
        this.listQuery["qp-createTime-le"] = "";
      }
    },
    // 取消申请
    cancelOrder(record) {
      let obj = { id: record.id, status: 4 };
      this.$confirm({
        title: "确认要取消申请吗？",
        onOk: () => {
          console.log("点击了取消");
          this.$store.dispatch("withdraw/editRecord", obj).then((res) => {
            this.$message.success("取消成功");
            this.getList();
          });
        }
      });
    },
    //删除申请
    delOrder(record) {
      this.$confirm({
        title: "确认要删除申请吗？",
        onOk: () => {
          console.log("点击了删除");
          this.$store.dispatch("withdraw/delRecord", record.id).then((res) => {
            this.$message.success("删除成功");
            this.getList();
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.channel-list-container {
  background: #fff;
  .public-table-wrap {
    margin-top: 20px;
    .status {
      display: flex;
      align-items: center;
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: green;
        margin-right: 5px;
      }
      .dot-err {
        background: red;
      }
    }
  }
  /deep/.ant-btn-danger {
    border: none;
    color: red;
    background: none;
    box-shadow: none;
    text-shadow: none;
    padding: 0;
  }
}
</style>
