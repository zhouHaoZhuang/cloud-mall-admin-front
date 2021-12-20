<template>
  <div class="cloud-container">
    <!-- 云服务器管理 -->
    <div class="cloud-top">
      <div class="left">
        <div class="title">云服务器管理</div>
        <a-select
          class="select"
          placeholder="全部线路"
          style="width: 120px"
          @change="handleAddressChange"
        >
          <a-select-option value="jack"> Jack </a-select-option>
          <a-select-option value="lucy"> Lucy </a-select-option>
          <a-select-option value="Yiminghe"> yiminghe </a-select-option>
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
          <a-button type="primary" :disabled="disabledBtn"> 启动 </a-button>
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item key="1" :disabled="disabledBtn"> 关机 </a-menu-item>
              <a-menu-item key="2" :disabled="disabledBtn"> 重启 </a-menu-item>
              <a-menu-item key="3" :disabled="disabledBtn">
                批量续费
              </a-menu-item>
            </a-menu>
            <a-button> 更多操作 <a-icon type="down" /> </a-button>
          </a-dropdown>
          <a-input-group compact>
            <a-select default-value="IP地址" style="width: 80px">
              <a-select-option value="IP地址"> IP地址 </a-select-option>
              <a-select-option value="实例名称"> 实例名称 </a-select-option>
            </a-select>
            <a-input-search
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
        <div class="icon-btn">
          <a-icon type="setting" />
        </div>
      </div>
    </div>
    <div class="table">
      <a-table
        rowKey="id"
        :loading="tableLoading"
        :columns="columns"
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
            状态(全部)
            <a-icon type="caret-down" />
          </div>
          <a-menu slot="overlay">
            <a-menu-item :key="4">全部</a-menu-item>
            <a-menu-item v-for="(value, key) in runningStatusEnum" :key="key">
              {{ value }}
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <!-- 实例名称 -->
        <div class="" slot="" slot-scope="text, record">
          {{ text }}{{ record }}
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
          <div>{{ record.outIp }} (公)</div>
          <div>{{ record.innerIp }} (私)</div>
        </div>
        <!-- 状态 -->
        <div class="" slot="" slot-scope="text, record">
          {{ text }}{{ record }}
        </div>
        <!-- 配置 -->
        <div class="" slot="" slot-scope="text, record">
          <div>{{ record }}</div>
          <div>{{ record }}</div>
        </div>
        <!-- 类型/到期时间 -->
        <div slot="endTimeStr" slot-scope="text, record">
          <div>{{ record }}</div>
          <div>{{ text }}</div>
        </div>
        <!-- 自动续费/周期 -->
        <div slot="autoRenew" slot-scope="text, record">
          <span v-if="text === 0" style="color: red">未开通</span>
          <span v-else>{{ record.renewPeriod }}</span>
        </div>
        <!-- 操作 -->
        <div slot="action" slot-scope="text, record">
          <div>
            <a-button type="link" @click="handleAdminCloud(record)">
              管理
            </a-button>
            <a-button type="link">登录</a-button>
          </div>
          <div>
            <a-button type="link">升级</a-button>
            <a-button type="link">续费</a-button>
            <a-dropdown :trigger="['click']">
              <a-button type="link" @click="(e) => e.preventDefault()">
                更多
                <a-icon type="down" style="margin-left: 2px" />
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item key="3">重启</a-menu-item>
                <a-menu-item key="3">修改信息</a-menu-item>
                <a-menu-item key="3">自动续费</a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import { runningStatusEnum } from "@/utils/enum";
export default {
  computed: {
    disabledBtn() {
      return this.selectedRowKeys.length === 0;
    }
  },
  data() {
    return {
      runningStatusEnum,
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      data: [{}],
      columns: [
        {
          title: "实例名称",
          dataIndex: "id",
          width: 150,
          onFilter: (value, record) => record.name.includes(value),
          sorter: (a, b) => a.name.length - b.name.length,
          scopedSlots: { customRender: "addressProject" }
        },
        {
          title: "监控",
          dataIndex: "monitor",
          scopedSlots: { customRender: "monitor" }
        },
        {
          title: "地域",
          dataIndex: "shortName"
        },
        {
          title: "IP地址",
          dataIndex: "ip",
          scopedSlots: { customRender: "ip" }
        },
        // 状态，头部在上边自定义的
        {
          dataIndex: "runningStatus",
          scopedSlots: {
            title: "statusTitle",
            customRender: "runningStatus"
          }
        },
        {
          title: "配置",
          dataIndex: "",
          scopedSlots: { customRender: "addressProject" }
        },
        {
          title: "类型/到期日期",
          dataIndex: "endTimeStr",
          onFilter: (value, record) => record.name.includes(value),
          sorter: (a, b) => a.name.length - b.name.length,
          scopedSlots: { customRender: "endTimeStr" }
        },
        {
          title: "自动续费/周期",
          dataIndex: "autoRenew",
          onFilter: (value, record) => record.name.includes(value),
          sorter: (a, b) => a.name.length - b.name.length,
          scopedSlots: { customRender: "autoRenew" }
        },
        {
          title: "操作",
          dataIndex: "action",
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
      selectedRowKeys: []
    };
  },
  created() {},
  methods: {
    // 获取服务器列表
    getList() {},
    // 头部线路切换
    handleAddressChange(value) {
      console.log(`selected ${value}`);
    },
    // 点击搜索
    handleSearch(value) {
      console.log(value);
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
      this.$router.push("/control/server/detail");
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
      }
    }
  }
  .table {
    color: #4d4d4d;
  }
}
</style>
