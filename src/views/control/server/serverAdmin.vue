<template>
  <div class="cloud-container">
    <!-- 云服务器管理 -->
    <div class="cloud-top">
      <div class="left">
        <div class="title">云服务器管理</div>
        <a-select
          v-model="listQuery.regionId"
          class="select"
          placeholder="全部线路"
          style="width: 150px"
          @change="handleAddressChange"
        >
          <a-select-option value="all"> 全部线路 </a-select-option>
          <a-select-option
            v-for="item in addressList"
            :key="item.regionId"
            :value="item.regionId"
          >
            {{ item.localName }}
          </a-select-option>
        </a-select>
      </div>
      <div class="help">
        <a-icon type="folder-open" class="icon" />
        <span>云服务器帮助文档</span>
      </div>
    </div>
    <!-- 按钮操作 -->
    <div class="btns">
      <div class="left">
        <a-space>
          <a-button type="primary">+新建</a-button>
          <a-button type="primary" :disabled="disabledBtn" @click="handleStart">
            启动
          </a-button>
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item
                key="1"
                :disabled="disabledBtn"
                @click="handleCloudAction('stop')"
              >
                关机
              </a-menu-item>
              <a-menu-item
                key="2"
                :disabled="disabledBtn"
                @click="handleCloudAction('restart')"
              >
                重启
              </a-menu-item>
              <a-menu-item key="3" :disabled="disabledBtn">
                批量续费
              </a-menu-item>
            </a-menu>
            <a-button> 更多操作 <a-icon type="down" /> </a-button>
          </a-dropdown>
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
        <div class="icon-btn">
          <a-icon type="sync" />
        </div>
        <div class="icon-btn" @click="handleCustomColumns">
          <a-icon type="setting" />
        </div>
      </div>
    </div>
    <div class="table">
      <a-table
        rowKey="id"
        :loading="tableLoading"
        :columns="newColumns"
        :data-source="data"
        :pagination="paginationProps"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
      >
        <!-- 自定义表格头部状态字段 -->
        <a-dropdown
          slot="statusTitle"
          :trigger="['click']"
          style="cursor: pointer"
        >
          <div>
            状态({{ columnsStatusTxt }})
            <a-icon type="caret-down" />
          </div>
          <a-menu slot="overlay">
            <a-menu-item :key="4" @click="handleStatusFilter(4)">
              全部
            </a-menu-item>
            <a-menu-item
              v-for="(value, key) in runningStatusEnum"
              :key="key"
              @click="handleStatusFilter(key)"
            >
              {{ value }}
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <!-- 实例名称 -->
        <div slot="instanceName" slot-scope="text">
          {{ text }}
        </div>
        <!-- 监控 -->
        <div slot="monitor" slot-scope="text, record">
          <a-icon
            type="bar-chart"
            style="font-size: 20px"
            @click="handleMonitor(record)"
          />
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
        <!-- 状态 -->
        <div slot="runningStatus" slot-scope="text">
          <div :class="getStatusClassName(text)">
            <div class="dot"></div>
            {{ runningStatusEnum[text] }}
          </div>
        </div>
        <!-- 配置 -->
        <div slot="setting" slot-scope="text, record">
          <div>规格：{{ record.cpu }}核{{ record.memory }}G</div>
          <div>带宽：{{ record.internetMaxBandwidthOut }}Mbps</div>
        </div>
        <!-- 类型/到期时间 -->
        <div slot="endTimeStr" slot-scope="text">
          <div>包年包月</div>
          <div>{{ text }}</div>
        </div>
        <!-- 自动续费/周期 -->
        <div slot="autoRenew" slot-scope="text, record">
          <span v-if="text === 0" style="color: red">未开通</span>
          <span v-else>{{ record.renewPeriod }}{{ record.durationUnit }}</span>
        </div>
        <!-- 操作 -->
        <div slot="action" slot-scope="text, record">
          <div>
            <a-button
              type="link"
              size="small"
              @click="handleAdminCloud(record)"
            >
              管理
            </a-button>
            <a-button type="link" size="small">登录</a-button>
          </div>
          <div>
            <a-button type="link" size="small">升级</a-button>
            <a-button type="link" size="small" @click="handleRenew(record)">
              续费
            </a-button>
            <a-dropdown :trigger="['click']">
              <a-button
                type="link"
                size="small"
                @click="(e) => e.preventDefault()"
              >
                更多
                <a-icon type="down" style="margin-left: 2px" />
              </a-button>
              <a-menu class="table-dropdown" slot="overlay">
                <a-menu-item key="1" @click="handleCloudAction('restart')">
                  重启
                </a-menu-item>
                <a-menu-item key="2" @click="handleUpdateName">
                  修改信息
                </a-menu-item>
                <a-menu-item key="3" @click="handleAutoRenew(record)">
                  自动续费
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
      </a-table>
    </div>
    <!-- 弹窗相关--------start -->
    <!-- 修改实例名称弹窗 -->
    <UpdateNameModal v-model="updateNameVisible" />
    <!-- 产品续费弹窗 -->
    <RenewModal v-model="renewVisible" :detail="modalDetail" />
    <!-- 自动产品续费弹窗 -->
    <AutoRenewModal
      v-model="autoRenewVisible"
      :detail="modalDetail"
      @success="autoRenewSuccess"
    />
    <!-- 重启/关机弹窗 -->
    <CloudActionModal v-model="cloudActionVisible" :type="cloudActionType" />
    <!-- 自定义列表项弹窗 -->
    <CustomColumnsModal
      v-model="customColumnsVisible"
      :list="columns"
      @change="customColumnsChange"
    />
    <!-- 弹窗相关--------end -->
  </div>
</template>

<script>
import { runningStatusEnum } from "@/utils/enum";
import UpdateNameModal from "@/components/Cloud/CloudModal/updateNameModal";
import RenewModal from "@/components/Cloud/CloudModal/renewModal";
import AutoRenewModal from "@/components/Cloud/CloudModal/autoRenewModal";
import CloudActionModal from "@/components/Cloud/CloudModal/cloudActionModal";
import CustomColumnsModal from "@/components/Cloud/CloudModal/customColumnsModal";
export default {
  components: {
    UpdateNameModal,
    RenewModal,
    AutoRenewModal,
    CloudActionModal,
    CustomColumnsModal
  },
  computed: {
    // 按钮是否禁用
    disabledBtn() {
      return this.selectedRowKeys.length === 0;
    },
    // 返回表格状态类名
    getStatusClassName() {
      return function (status) {
        if (status === 0) {
          return "status hole";
        }
        if (status === 1) {
          return "status start";
        }
        if (status === 2) {
          return "status stop";
        }
        if (status === 3) {
          return "status overdue";
        }
      };
    }
  },
  data() {
    return {
      runningStatusEnum,
      listQuery: {
        key: "ip",
        search: "",
        regionId: undefined,
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
          scopedSlots: { customRender: "instanceName" },
          select: true
        },
        {
          title: "监控",
          dataIndex: "monitor",
          scopedSlots: { customRender: "monitor" },
          select: true
        },
        {
          title: "地域",
          dataIndex: "regionId",
          select: true
        },
        {
          title: "IP地址",
          dataIndex: "ip",
          scopedSlots: { customRender: "ip" },
          select: true
        },
        // 状态，头部在上边自定义的
        {
          dataIndex: "runningStatus",
          scopedSlots: {
            title: "statusTitle",
            customRender: "runningStatus"
          },
          select: true
        },
        {
          title: "配置",
          dataIndex: "setting",
          scopedSlots: { customRender: "setting" },
          select: true
        },
        {
          title: "类型/到期日期",
          dataIndex: "endTimeStr",
          sorter: (a, b) => a.endTimeStr - b.endTimeStr,
          scopedSlots: { customRender: "endTimeStr" },
          select: true
        },
        {
          title: "自动续费/周期",
          dataIndex: "autoRenew",
          sorter: (a, b) => a.renewPeriod - b.renewPeriod,
          scopedSlots: { customRender: "autoRenew" },
          select: true
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          select: true
        }
      ],
      newColumns: [],
      columnsStatusTxt: "全部",
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
      // 修改实例名称弹窗
      updateNameVisible: false,
      // 产品续费弹窗
      renewVisible: false,
      // 自动产品续费弹窗
      autoRenewVisible: false,
      modalDetail: {},
      // 重启/关机弹窗
      cloudActionVisible: false,
      cloudActionType: "",
      // 启动服务器
      startLoading: false,
      // 自定义名称弹窗
      customColumnsVisible: false,
      // 弹窗相关------end
      addressList: []
    };
  },
  created() {
    // 动态设置表格列显示/隐藏
    this.newColumns = this.columns.filter((ele) => ele.select);
    this.getAddressList();
    this.getList();
  },
  methods: {
    // 获取地域列表
    getAddressList() {
      this.$store.dispatch("cloud/addressList").then((res) => {
        this.addressList = [...res.data];
      });
    },
    // 获取服务器列表
    getList(status) {
      this.tableLoading = true;
      this.$getList("cloud/cloudList", this.listQuery)
        .then((res) => {
          if (status) {
            const newData = res.data.list.filter(
              (ele) => ele.runningStatus === status * 1
            );
            this.data = [...newData];
          } else {
            this.data = [...res.data.list];
          }
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    // 头部线路切换
    handleAddressChange(value) {
      if (value === "all") {
        this.listQuery.regionId = undefined;
      }
      this.getList();
    },
    // 点击搜索
    handleSearch() {
      this.getList();
    },
    // 表格多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 表格
    // 点击查看监控
    handleMonitor(record) {},
    // 跳转服务器实例详情管理
    handleAdminCloud(record) {
      this.$router.push({
        path: "/control/server/detail",
        query: {
          id: record.id
        }
      });
    },
    // 弹窗相关------start
    // 点击修改实例名称
    handleUpdateName() {
      this.updateNameVisible = true;
    },
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
    autoRenewSuccess(autoRenew) {
      this.modalDetail.autoRenew = autoRenew;
    },
    // 重启/关机弹窗
    handleCloudAction(type) {
      this.cloudActionType = type;
      this.cloudActionVisible = true;
    },
    // 启动服务器
    handleStart() {
      this.$confirm({
        width: "500px",
        centered: true,
        title: "你所选的1台云服务器将执行启动操作。",
        content: "是否确定启动？",
        confirmLoading: this.startLoading,
        onOk: () => {
          return new Promise((resolve, reject) => {
            resolve();
          });
        }
      });
    },
    // 点击自定义列表项
    handleCustomColumns() {
      this.customColumnsVisible = true;
    },
    // 自定义列表项change事件
    customColumnsChange(value) {
      value.forEach((item) => {
        const index = this.columns.findIndex(
          (ele) => ele.dataIndex === item.dataIndex
        );
        this.columns.splice(index, 1, {
          ...this.columns[index],
          select: item.select
        });
      });
      this.newColumns = this.columns.filter((ele) => ele.select);
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
    },
    // 表格头部状态筛选
    handleStatusFilter(status) {
      if (status !== 4) {
        this.columnsStatusTxt = this.runningStatusEnum[status];
        this.getList(status);
      } else {
        this.columnsStatusTxt = "全部";
        this.getList();
      }
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
