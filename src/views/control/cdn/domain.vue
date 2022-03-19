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
          @click="handleBatchChangeStatus(true)"
        >
          启用
        </a-button>
        <a-button
          v-permission="'add'"
          :disabled="!hasSelected"
          :loading="stopLoading"
          @click="handleBatchChangeStatus(false)"
        >
          停用
        </a-button>
        <a-button
          v-permission="'add'"
          :disabled="!hasSelected"
          :loading="delLoading"
          @click="handleBatchDel"
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
            <a-select-option value="title"> 域名 </a-select-option>
            <a-select-option value="workOrderNo"> 渠道商名称 </a-select-option>
            <a-select-option value="workOrderNo"> 渠道商ID </a-select-option>
            <a-select-option value="workOrderNo"> cname </a-select-option>
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
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
      >
        <div class="status" slot="cdnStatus" slot-scope="text">
          <a-badge :status="cdnStatusEnum[text].dot" />
          {{ cdnStatusEnum[text].name }}
        </div>
        <div slot="httpsStatus" slot-scope="text">
          <a-tag v-if="text"> 未开启 </a-tag>
          <a-tag v-else color="green"> 已开启 </a-tag>
        </div>
        <span slot="createTime" slot-scope="text">
          {{ text | formatDate }}
        </span>
        <div slot="action" slot-scope="text, record">
          <a-button type="link" @click="handleDomainHttps(record)">
            管理
          </a-button>
          <a-button type="link" @click="handleDomainHttps(record)">
            复制配置
          </a-button>
          <a-button type="link" @click="handleChangeStatus(record)">
            {{ record.status === 1 ? "停用" : "启用" }}
          </a-button>
          <a-space>
            <a-button type="link" @click="handleDelDomain(record)">
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
        startTime: "",
        endTime: "",
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
          dataIndex: "cnameStatus",
          scopedSlots: { customRender: "cnameStatus" }
        },
        {
          title: "状态",
          dataIndex: "cname111Status",
          scopedSlots: { customRender: "cnameStatus" }
        },
        {
          title: "HTTPS",
          dataIndex: "cnameStasstus",
          scopedSlots: { customRender: "cnameStatus" }
        },
        {
          title: "源站信息",
          dataIndex: "type",
          scopedSlots: { customRender: "type" }
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
      data: [{}],
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
    }
  },
  created() {
    // this.getList();
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
      this.$store
        .dispatch("domain/getList", this.listQuery)
        .then((res) => {
          this.data = [...res.data.list];
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
        this.listQuery.startTime = "";
        this.listQuery.endTime = "";
      }
    },
    // 表格多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 跳转新建域名
    handleAddDomain() {
      this.$router.push("/control/cdn/manageDomain");
    },
    // 跳转管理
    handleManage(record) {
      this.$router.push({
        path: "/control/cdn/manageDomain",
        query: {
          id: record.id,
          monitor: true
        }
      });
    },
    // 复制配置
    handleCopy(record) {
      this.$router.push({
        path: "/control/cdn/copy",
        query: {
          id: record.id,
          monitor: true
        }
      });
    },
    // 批量停用/启用
    handleBatchChangeStatus(type) {
      const statusTxt = !type ? "停用" : "启用";
      this.$confirm({
        title: `确认要${statusTxt}当前域名吗？`,
        onOk: () => {
          this.$store
            .dispatch("organization/editRole", {
              status: type ? 0 : 1
            })
            .then((res) => {
              this.$message.success(`批量${statusTxt}成功`);
              this.getList();
            });
        }
      });
    },
    // 停用/启用
    handleChangeStatus(record) {
      const statusTxt = !record.status ? "停用" : "启用";
      this.$confirm({
        title: `确认要${statusTxt}当前域名吗？`,
        onOk: () => {
          this.$store
            .dispatch("organization/editRole", {
              id: record.id,
              status: record.status ? 0 : 1
            })
            .then((res) => {
              this.$message.success(`${statusTxt}成功`);
              this.getList();
            });
        }
      });
    },
    // 批量删除
    handleBatchDel() {
      this.$confirm({
        title: "确定要删除吗?",
        onOk: () => {
          this.$store.dispatch("domain/del").then((res) => {
            this.$message.success("批量删除成功");
            this.getList();
          });
        }
      });
    },
    //删除
    handleDelDomain(record) {
      this.$confirm({
        title: "确定要删除吗?",
        onOk: () => {
          this.$store.dispatch("domain/del", record.id).then((res) => {
            this.$message.success("操作成功");
            this.getList();
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
