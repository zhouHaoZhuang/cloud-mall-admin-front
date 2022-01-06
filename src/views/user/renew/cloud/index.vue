<template>
  <div class="cloud-container">
    <!-- 云服务器管理 -->
    <div class="cloud-top">
      <div class="left">
        <div class="title">云服务器续费管理</div>
      </div>
    </div>
    <!-- 按钮操作 -->
    <div class="btns">
      <div class="left">
        <a-space>
          <a-button :disabled="disabledBtn">批量续费</a-button>
          <span>到期时间:</span>
          <a-select
            v-model="listQuery.residueDay"
            class="select"
            placeholder="30天"
            style="width: 150px"
          >
            <a-select-option value="all"> 全部 </a-select-option>
          </a-select>
          <a-input-group style="width: 400px" compact>
            <a-select v-model="listQuery.key" style="width: 100px">
              <a-select-option value="ip"> IP地址 </a-select-option>
              <a-select-option value="instanceName"> 实例名称 </a-select-option>
            </a-select>
            <a-input-search
              v-model="listQuery.search"
              style="width: 70%"
              placeholder="请输入搜索关键词"
              enter-button
              @search="handleSearch"
            />
          </a-input-group>
        </a-space>
      </div>
      <div class="right">
        <div class="icon-btn" @click="getList()">
          <a-icon type="sync" />
        </div>
      </div>
    </div>
    <div class="table">
      <a-table
        rowKey="id"
        :loading="tableLoading"
        :columns="columns"
        :data-source="data"
        :scroll="{ x: 1000 }"
        :pagination="paginationProps"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
      >
        <!-- 实例名称 -->
        <div slot="instanceName" slot-scope="text">
          {{ text }}
        </div>
        <!-- 地域 -->
        <div slot="regionId" slot-scope="text">
          {{ regionDataEnum[text] }}
        </div>
        <!-- IP地址 -->
        <div slot="ip" slot-scope="text, record">
          <div>
            {{ record.outIp }} (公)
            <a-icon
              class="copy-icon"
              type="copy"
              @click="handleCopy(record.outIp)"
            />
          </div>
          <div>
            {{ record.innerIp }} (私)
            <a-icon
              class="copy-icon"
              type="copy"
              @click="handleCopy(record.innerIp)"
            />
          </div>
        </div>
        <!-- 配置 -->
        <!-- <div slot="setting" slot-scope="text, record">
          <div>规格：{{ record.cpu }}核{{ record.memory }}G</div>
          <div>带宽：{{ record.internetMaxBandwidthOut }}Mbps</div>
        </div> -->
        <!-- 类型/到期时间 -->
        <div slot="endTimeStr" slot-scope="text">
          <div>包年包月</div>
          <div>{{ text }}</div>
        </div>
        <!-- 自动续费/周期 -->
        <div slot="autoRenew" slot-scope="text, record">
          <span v-if="text === 0" style="color: red">未开通</span>
          <span v-if="text === 1" style="color: #2bbe22">已开通</span>
          <span v-if="text === 1">
            /{{ record.renewPeriod }}{{ getAutoRenewUnit(record.renewUnit) }}
          </span>
        </div>
        <!-- 倒计时/天 -->
        <div slot="residueDay" slot-scope="text">
          <span v-if="text === 15">已销毁</span>
        </div>
        <!-- 操作 -->
        <div slot="action" slot-scope="text, record">
          <div>
            <a-button type="link" size="small" @click="handleRenew(record)">
              续费
            </a-button>
            <a-button type="link" size="small" @click="handleAutoRenew(record)">
              自动续费
            </a-button>
          </div>
        </div>
      </a-table>
    </div>
    <!-- 弹窗相关--------start -->
    <!-- 产品续费弹窗 -->
    <RenewModal v-model="renewVisible" :detail="modalDetail" />
    <!-- 自动产品续费弹窗 -->
    <AutoRenewModal
      v-model="autoRenewVisible"
      :detail="modalDetail"
      @success="autoRenewSuccess"
    />
    <!-- 弹窗相关--------end -->
  </div>
</template>

<script>
import {
  runningStatusEnum,
  runningStatusSelect,
  regionDataEnum
} from "@/utils/enum";
import RenewModal from "@/components/Cloud/CloudModal/renewModal";
import AutoRenewModal from "@/components/Cloud/CloudModal/autoRenewModal";
import moment from "moment";
export default {
  components: {
    RenewModal,
    AutoRenewModal
  },
  computed: {
    // 按钮是否禁用
    disabledBtn() {
      return this.selectedRowKeys.length === 0;
    },
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
      runningStatusEnum,
      runningStatusSelect,
      regionDataEnum,
      listQuery: {
        key: "ip",
        search: "",
        residueDay: undefined,
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      data: [],
      columns: [
        {
          title: "实例名称",
          dataIndex: "instanceName",
          width: 150,
          scopedSlots: { customRender: "instanceName" }
        },
        {
          title: "地域",
          dataIndex: "regionId",
          scopedSlots: { customRender: "regionId" },
          width: 120
        },
        {
          title: "IP地址",
          dataIndex: "ip",
          width: 150,
          scopedSlots: { customRender: "ip" }
        },
        {
          title: "类型/到期日期",
          dataIndex: "endTimeStr",
          width: 150,
          sorter: (a, b) => moment(a.endTimeStr) - moment(b.endTimeStr),
          scopedSlots: { customRender: "endTimeStr" }
        },
        {
          title: "倒计时",
          dataIndex: "residueDay",
          width: 120,
          scopedSlots: { customRender: "residueDay" }
        },
        {
          title: "自动续费/周期",
          dataIndex: "autoRenew",
          width: 130,
          sorter: (a, b) => a.renewPeriod - b.renewPeriod,
          scopedSlots: { customRender: "autoRenew" }
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 170,
          fixed: "right",
          scopedSlots: { customRender: "action" }
        }
      ],
      paginationProps: {
        showSizeChanger: true,
        total: 1,
        showTotal: (total, range) =>
          `共 ${total} 条记录 第 ${this.listQuery.currentPage} / ${Math.ceil(
            total / this.listQuery.pageSize
          )} 页`,
        onShowSizeChange: this.onShowSizeChange
      },
      tableLoading: false,
      selectedRowKeys: [],
      // 弹窗相关------start
      // 产品续费弹窗
      renewVisible: false,
      // 自动产品续费弹窗
      autoRenewVisible: false,
      modalDetail: {}
      // 弹窗相关------end
    };
  },
  created() {
    this.getList();
  },
  activated() {
    this.getList();
  },
  methods: {
    // 获取服务器列表
    getList() {
      this.tableLoading = true;
      this.$store
        .dispatch("renewcloud/cloudList", {
          ...this.listQuery,
          [this.listQuery.key]: this.listQuery.search
        })
        .then((res) => {
          this.data = [...res.data.list];
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    // 点击搜索
    handleSearch() {
      this.getList();
    },
    // 表格多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 弹窗相关------start
    // 点击产品续费
    handleRenew(record) {
      this.modalDetail = record;
      this.renewVisible = true;
    },
    // 点击自动产品续费
    handleAutoRenew(record) {
      this.modalDetail = record;
      this.autoRenewVisible = true;
    },
    // 自动续费成功回调
    autoRenewSuccess(data) {
      this.modalDetail.autoRenew = data.autoRenew;
      this.modalDetail.renewPeriod = data.renewPeriod;
      this.modalDetail.renewUnit = data.renewUnit;
    },
    // 弹窗相关------end
    // 点击复制
    handleCopy(txt) {
      this.$copyText(txt)
        .then(() => {
          this.$message.success("已成功复制到剪切板");
        })
        .catch(() => {
          this.$message.warning("复制失败");
        });
    }
  }
};
</script>

<style lang="less" scoped>
.cloud-container {
  background-color: #fff;
  .cloud-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      .title {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        font-size: 22px;
        color: #272829;
        margin-right: 30px;
      }
    }
    .help {
      color: #40a9ff;
      cursor: pointer;
      display: flex;
      align-items: center;
      .icon {
        margin-right: 8px;
        font-size: 18px;
      }
    }
  }
  .btns {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    .right {
      color: #4d4d4d;
      font-size: 18px;
      display: flex;
      .icon-btn {
        width: 32px;
        height: 32px;
        border: 1px solid #ddd;
        margin: 0 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }
  }
  .table {
    color: #4d4d4d;
    .copy-icon {
      color: #00aaff;
      cursor: pointer;
    }
    .status {
      color: #29cc7a;
      display: flex;
      align-items: center;
      .dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #29cc7a;
        margin-right: 5px;
      }
    }
    .start {
      color: #29cc7a;
      .dot {
        background: #29cc7a;
      }
    }
    .stop {
      color: red;
      .dot {
        background: red;
      }
    }
    .hole {
      color: #000;
      .dot {
        background: #000;
      }
    }
    .overdue {
      color: #666;
      .dot {
        background: #666;
      }
    }
  }
}
</style>
