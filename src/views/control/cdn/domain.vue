<template>
  <div class="domain-container">
    <div class="top-title">域名管理</div>
    <div class="btn-head">
      <a-space>
        <a-button
          v-permission="'add'"
          type="primary"
          icon="plus"
          @click="handleAddDomain"
        >
          创建域名
        </a-button>
        <a-button
          v-permission="'add'"
          :disabled="!hasSelected"
          :loading="startLoading"
          @click="handleChangeStatus('open')"
        >
          启用
        </a-button>
        <a-button
          v-permission="'add'"
          :disabled="!hasSelected"
          :loading="stopLoading"
          @click="handleChangeStatus('off')"
        >
          停用
        </a-button>
        <a-button
          v-permission="'add'"
          :disabled="!hasSelected"
          :loading="delLoading"
          @click="handleDel"
        >
          删除
        </a-button>
      </a-space>
    </div>
    <div class="public-header-wrap">
      <a-form-model layout="inline" :model="listQuery">
        <a-form-model-item>
          <a-select
            style="width: 150px"
            allowClear
            v-model="listQuery.key"
            placeholder="请选择"
          >
            <a-select-option value="domain"> 域名 </a-select-option>
            <a-select-option value="channelName"> 渠道商名称 </a-select-option>
            <a-select-option value="channelCode"> 渠道商ID </a-select-option>
            <a-select-option value="cnameValue"> cname </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item>
          <a-input
            v-model="listQuery.search"
            allowClear
            placeholder="搜索关键词"
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
            :placeholder="['开始时间', '结束时间']"
            @change="datePickerOnOk"
          />
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="search"> 查询 </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="table-content">
      <a-table
        :loading="tableLoading"
        :columns="columns"
        :data-source="data"
        rowKey="id"
        :pagination="paginationProps"
        :row-selection="rowSelection"
      >
        <div class="status" slot="cdnStatus" slot-scope="text">
          <a-badge :status="cdnStatusEnum[text].dot" />
          {{ cdnStatusEnum[text].name }}
        </div>
        <div slot="httpsStatus" slot-scope="text">
          <a-tag v-if="text === 0"> 未配置 </a-tag>
          <a-tag v-if="text === 1"> 未开启 </a-tag>
          <a-tag v-if="text === 2" color="green"> 已开启 </a-tag>
        </div>
        <div slot="sourceInfo" slot-scope="text">
          <div class="text-overflow">{{ text }}</div>
        </div>
        <span slot="createTime" slot-scope="text">
          {{ text | formatDate }}
        </span>
        <div slot="action" slot-scope="text, record">
          <a-space>
            <a-button
              type="link"
              @click="handleManage(record)"
              :disabled="
                record.corporationLockStatus == 0 ||
                record.systemLockStatus == 0
              "
            >
              管理
            </a-button>
            <a-button
              type="link"
              @click="handleCopy(record)"
              :disabled="
                record.corporationLockStatus == 0 ||
                record.systemLockStatus == 0
              "
            >
              复制配置
            </a-button>
            <a-button
              v-if="record.cdnStatus === 2"
              type="link"
              @click="handleChangeStatus('open', [record.id])"
              :disabled="
                record.corporationLockStatus == 0 ||
                record.systemLockStatus == 0
              "
            >
              启用
            </a-button>
            <a-button
              v-if="record.cdnStatus === 1"
              type="link"
              @click="handleChangeStatus('stop', [record.id])"
              :disabled="
                record.corporationLockStatus == 0 ||
                record.systemLockStatus == 0
              "
            >
              停用
            </a-button>
            <a-button
              type="link"
              @click="handleDel([record.id])"
              :disabled="
                record.corporationLockStatus == 0 ||
                record.systemLockStatus == 0
              "
            >
              删除
            </a-button>
          </a-space>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { cdnStatusEnum } from "@/utils/enum";
export default {
  data() {
    return {
      moment,
      cdnStatusEnum,
      listQuery: {
        key: undefined,
        search: "",
        startTime: undefined,
        endTime: undefined,
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      tableLoading: false,
      columns: [
        {
          title: "域名",
          dataIndex: "domain"
        },
        {
          title: "CNAME",
          dataIndex: "cnameValue"
        },
        {
          title: "状态",
          dataIndex: "cdnStatus",
          scopedSlots: { customRender: "cdnStatus" }
        },
        {
          title: "HTTPS",
          dataIndex: "httpsStatus",
          scopedSlots: { customRender: "httpsStatus" }
        },
        {
          title: "源站信息",
          dataIndex: "sourceInfo",
          scopedSlots: { customRender: "sourceInfo" }
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          scopedSlots: { customRender: "createTime" }
        },
        {
          title: "操作",
          dataIndex: "action",
          fixed: "right",
          scopedSlots: { customRender: "action" }
        }
      ],
      data: [],
      selectedRowKeys: [],
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
      startLoading: false,
      stopLoading: false,
      delLoading: false
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys) => {
          this.selectedRowKeys = selectedRowKeys;
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled:
              record.corporationLockStatus === 0 ||
              record.systemLockStatus === 0
          }
        })
      };
    }
  },
  created() {
    this.getList();
  },
  methods: {
    // 搜索
    search() {
      this.listQuery.currentPage = 1;
      this.getList();
    },
    //查询列表
    getList() {
      this.tableLoading = true;
      this.$getListQp("cdn/getDomainList", this.listQuery)
        .then((res) => {
          this.data = res.data.list.map((ele) => {
            const newSourceInfo = ele.sourceInfo.sourceModel.map(
              (item) => item.content
            );
            return {
              ...ele,
              sourceInfo: newSourceInfo.slice(0, 2).join(',')
            };
          });
          console.log(this.data);
          this.paginationProps.total = res.data.totalCount * 1;
        })
        .finally(() => {
          this.tableLoading = false;
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
    },
    // 日期选择
    datePickerOnOk(value) {
      if (value.length !== 0) {
        this.listQuery.startTime = moment(value[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.listQuery.endTime = moment(value[1]).format("YYYY-MM-DD HH:mm:ss");
      } else {
        this.listQuery.startTime = undefined;
        this.listQuery.endTime = undefined;
      }
    },
    // 跳转新建域名
    handleAddDomain() {
      this.$router.push("/control/cdn/createDomain");
    },
    // 跳转管理
    handleManage(record) {
      this.$router.push({
        path: "/control/cdn/manageDomain",
        query: {
          domain: record.domain
        }
      });
    },
    // 复制配置
    handleCopy(record) {
      this.$router.push({
        path: "/control/cdn/copy",
        query: {
          domain: record.domain
          // id: record.id,
          // monitor: true
        }
      });
    },
    // 停用/启用+批量
    handleChangeStatus(type, ids) {
      const statusTxt = type === "open" ? "启用" : "停用";
      const newIds = ids ? [...ids] : [...this.selectedRowKeys];
      const result = this.data.map((ele) => {
        if (newIds.includes(ele.id)) {
          return ele.domain;
        }
      });
      const req =
        type === "open" ? "cdn/changeDomainOpen" : "cdn/changeDomainOff";
      if (!ids) {
        if (type === "open") {
          this.startLoading = true;
        }
        if (type === "off") {
          this.stopLoading = true;
        }
      }
      this.$confirm({
        title: `确认要${statusTxt}吗？`,
        onOk: () => {
          this.$store
            .dispatch(req, { domainNames: result.join(",") })
            .then((res) => {
              this.$message.success(`${statusTxt}成功`);
              this.getList();
            })
            .finally(() => {
              this.startLoading = false;
              this.stopLoading = false;
            });
        }
      });
    },
    // 删除+批量
    handleDel(ids) {
      const newIds = ids ? [...ids] : [...this.selectedRowKeys];
      if (!ids) {
        this.delLoading = true;
      }
      this.$confirm({
        title: "确定要删除吗?",
        onOk: () => {
          this.$store
            .dispatch("cdn/delDomain", { ids: newIds })
            .then((res) => {
              this.$message.success("删除成功");
              this.getList();
            })
            .finally(() => {
              this.delLoading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.domain-container {
  .top-title {
    height: 40px;
    line-height: 40px;
    font-size: 22px;
    color: #272829;
    margin-bottom: 10px;
  }
  .btn-head {
    display: flex;
    margin-bottom: 15px;
  }
  .public-header-wrap {
    margin-bottom: 20px;
  }
  .table-content {
    .txt-btn {
      padding: 0;
      display: inline-block;
    }
  }
}
</style>
