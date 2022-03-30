<template>
  <div class="cloud-container">
    <!-- 按钮操作 -->
    <div class="btns">
      <div class="left">
        <a-space>
          <a-button type="" @click="toAdd">创建快照</a-button>
          <a-button type="danger">删除快照</a-button>
        </a-space>
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
        <!-- 操作 -->
        <div slot="action" slot-scope="text, record">
          <div>
            <a-button type="link" size="small" @click="toRollback(record)">
              回滚磁盘
            </a-button>
            <a-button type="link" size="small" @click="handleDel(record)">
              删除快照
            </a-button>
          </div>
        </div>
      </a-table>
    </div>
    <!-- 创建快照 -->
    <CreateSnapshoot v-model="addVisible" />
    <!-- 删除快照 -->
    <!-- 回滚磁盘 -->
    <a-modal v-model="rollbackVisible" title="回滚磁盘" @ok="hideModal">
      <p>{{ rollbackText }}</p>
      <template>
        <a-button>确认</a-button>
        <a-button>取消</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment";
import CreateSnapshoot from "@/components/Cloud/CloudModal/createSnapshoot.vue";
export default {
  components: {
    CreateSnapshoot
  },
  data() {
    return {
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
          title: "快照ID/名称",
          dataIndex: "instanceName",
          width: 200,
          scopedSlots: { customRender: "instanceName" }
        },
        {
          title: "快照类型",
          dataIndex: "regionId",
          scopedSlots: { customRender: "regionId" },
          width: 120
        },
        {
          title: "快照来源",
          dataIndex: "ip",
          width: 150,
          scopedSlots: { customRender: "ip" }
        },
        {
          title: "快照极速可用",
          dataIndex: "ips",
          width: 150,
          scopedSlots: { customRender: "ips" }
        },
        {
          title: "云盘ID",
          dataIndex: "ipa",
          width: 150,
          scopedSlots: { customRender: "ipa" }
        },
        {
          title: "云盘容量",
          dataIndex: "ipas",
          width: 150,
          scopedSlots: { customRender: "ipas" }
        },
        {
          title: "云盘属性",
          dataIndex: "ipasx",
          width: 150,
          scopedSlots: { customRender: "ipasx" }
        },
        {
          title: "已加密/未加密",
          dataIndex: "password",
          width: 150,
          scopedSlots: { customRender: "password" }
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          width: 150,
          sorter: (a, b) => moment(a.createTime) - moment(b.createTime),
          scopedSlots: { customRender: "createTime" }
        },
        {
          title: "保留时间",
          dataIndex: "endTimeStr",
          width: 150,
          sorter: (a, b) => moment(a.endTimeStr) - moment(b.endTimeStr),
          scopedSlots: { customRender: "endTimeStr" }
        },
        {
          title: "进度",
          dataIndex: "process",
          width: 120,
          scopedSlots: { customRender: "process" }
        },
        {
          title: "状态",
          dataIndex: "status",
          width: 130
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
        onChange: this.quickJump,
        onShowSizeChange: this.onShowSizeChange
      },
      tableLoading: false,
      selectedRowKeys: [],
      // 弹窗相关------start
      addVisible: false,
      delVisible: false,
      rollbackVisible: false,
      rollbackText: "",
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
          this.paginationProps.total = res.data.totalCount * 1;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    quickJump(current) {
      this.listQuery.currentPage = current;
      this.getList();
    },
    onShowSizeChange(current, pageSize) {
      this.listQuery.pageSize = pageSize;
      this.listQuery.currentPage = current;
      this.getList();
    },
    // 表格多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //点击创建快照
    toAdd() {
      this.addVisible = true;
    },
    // 点击回滚磁盘
    toRollback(record) {
      this.modalDetail = record;
      this.rollbackText = `对于云盘YP2022022800001将进行回滚操作，回滚至2022年3月29日 16：03快照数据，您是否确定操作？`;
      //  this.rollbackText = `只有已停止的实例才可以回滚云盘，当前实例 i-bp1aowywz67oqml38nek 的状态未停止。`
    },
    // 点击删除快照
    handleDel(record) {
      this.modalDetail = record;
      this.delVisible = true;
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
