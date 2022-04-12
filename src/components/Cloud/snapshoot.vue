<template>
  <div class="cloud-container">
    <!-- 按钮操作 -->
    <div class="btns">
      <div class="left">
        <a-space>
          <a-button type="primary" @click="toAdd">创建快照</a-button>
          <a-button
            type="danger"
            @click="handleDel(multipleSelection)"
            :disabled="multipleSelection.length === 0"
            >删除快照</a-button
          >
        </a-space>
      </div>
    </div>
    <div class="table">
      <a-table
        rowKey="id"
        :loading="tableLoading"
        :columns="columns"
        :data-source="data"
        :scroll="{ x: 600 }"
        :pagination="paginationProps"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
      >
        <div slot="instantType" slot-scope="text">
          {{ text == "true" ? "极速快照" : "普通快照" }}
        </div>
        <div slot="snapshotName" slot-scope="text, record">
          {{ record.snapshotInnerId }} / {{ text }}
        </div>
        <div slot="snapshotType" slot-scope="text">
          {{ snapshotType[text] }}
        </div>
        <div slot="instantAccess" slot-scope="text, record">
          {{ record.instantAccess == "true" ? "已开启" : "未开启" }}
        </div>
        <div slot="sourceDiskSize" slot-scope="text">{{ text }}GiB</div>
        <div slot="encrypted" slot-scope="text">
          {{ text == "false" ? "未加密" : "已加密" }}
        </div>
        <div slot="sourceDiskType" slot-scope="text">
          {{ sourceDiskType[text] }}
        </div>
        <div v-if="text" slot="createTime" slot-scope="text">
          {{ text | formatDate }}
        </div>
        <div slot="retentionDays" slot-scope="text">
          <div v-if="text">{{ text | formatDate }}</div>
          <div v-else>{{ "持续保留" }}</div>
        </div>
        <!-- 操作 -->
        <div slot="action" slot-scope="text, record">
          <div>
            <a-button type="link" size="small" @click="toRollback(record)">
              回滚磁盘
            </a-button>
          </div>
        </div>
      </a-table>
    </div>
    <!-- 创建快照 -->
    <CreateSnapshoot
      v-model="addVisible"
      :diskData="diskData"
      :innerId="innerId"
      @success="getList"
    />
    <!-- 删除快照 -->
    <a-modal v-model="delVisible" title="删除快照" @ok="toDel">
      <p>
        您所选的{{ multipleSelection.length }}个快照
        将执行删除快照操作，您是否确定操作？
      </p>
      <div v-for="(item, index) in snapshotIds" :key="index">
        <div class="snapshotId">
          <span>{{ item }}</span>
        </div>
      </div>
    </a-modal>
    <!-- 回滚磁盘 -->
    <a-modal
      v-model="rollbackVisible"
      title="回滚磁盘"
      @cancel="rollbackVisible = false"
    >
      <p>{{ rollbackText }}</p>
      <template slot="footer">
        <a-button
          type="primary"
          :disabled="detail.runningStatus !== 2"
          @click="toResetDisk"
          >确认</a-button
        >
        <a-button @click="rollbackVisible = false">取消</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment";
import CreateSnapshoot from "@/components/Cloud/CloudModal/createSnapshoot.vue";
import { snapshotType, sourceDiskType } from "@/utils/enum.js";
export default {
  components: {
    CreateSnapshoot
  },
  props: {
    // 实例详情
    detail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      snapshotType,
      sourceDiskType,
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      data: [],
      diskData: [], // 云盘数据
      multipleSelection: [],
      snapshotIds: [],
      columns: [
        {
          title: "快照ID/名称",
          dataIndex: "snapshotName",
          scopedSlots: { customRender: "snapshotName" },
          width:160
        },
        {
          title: "快照类型",
          dataIndex: "instantAccess",
          scopedSlots: { customRender: "instantType" },
          width:100
        },
        {
          title: "快照来源",
          dataIndex: "snapshotType",
          scopedSlots: { customRender: "snapshotType" },
          width:100
        },
        {
          title: "快照极速可用",
          dataIndex: "instantAccess1",
          scopedSlots: { customRender: "instantAccess" },
          width:120
        },
        {
          title: "云盘ID",
          dataIndex: "sourceDiskId",
           width:150
        },
        {
          title: "云盘容量",
          dataIndex: "sourceDiskSize",
          scopedSlots: { customRender: "sourceDiskSize" },
           width:100
        },
        {
          title: "云盘属性",
          dataIndex: "sourceDiskType",
          scopedSlots: { customRender: "sourceDiskType" },
          width:100
        },
        {
          title: "已加密/未加密",
          dataIndex: "encrypted",
          scopedSlots: { customRender: "encrypted" },
          width:100
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          sorter: (a, b) => moment(a.createTime) - moment(b.createTime),
          scopedSlots: { customRender: "createTime" },
          width:120
        },
        {
          title: "保留时间",
          dataIndex: "retentionDays",
          sorter: (a, b) => moment(a.retentionDays) - moment(b.retentionDays),
          scopedSlots: { customRender: "retentionDays" },
          width:120
        },
        {
          title: "进度",
          dataIndex: "progress",
          width:60
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
          width:60
        },
        {
          title: "操作",
          dataIndex: "action",
          fixed: "right",
          scopedSlots: { customRender: "action" },
          width:80
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
      innerId: undefined,
      delVisible: false,
      rollbackVisible: false,
      rollbackText: "",
      modalDetail: {}
      // 弹窗相关------end
    };
  },
  created() {
    this.getList();
    this.getDescribeDisks();
  },
  activated() {
    this.getList();
  },
  methods: {
    // 获取服务器列表
    getList() {
      this.tableLoading = true;
      this.$store
        .dispatch("snapshoot/getList", {
          ...this.listQuery,
          "qp-innerInstanceId-eq": this.detail.instanceId
        })
        .then((res) => {
          this.data = [...res.data.list];
          this.paginationProps.total = res.data.totalCount * 1;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    //查询云盘数据
    getDescribeDisks() {
      this.$store
        .dispatch("snapshoot/getDescribeDisks", {
          instanceId: this.detail.instanceId,
          regionId: this.detail.regionId
        })
        .then((res) => {
          this.diskData = res.data.disk;
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
    onSelectChange(selectedRowKeys, record) {
      this.selectedRowKeys = selectedRowKeys;
      this.multipleSelection = record.map((item) => {
        console.log(item, "item");
        return item.id;
      });
      this.snapshotIds = record.map((item) => {
        return item.snapshotInnerId;
      });
    },
    //点击创建快照
    toAdd() {
      this.addVisible = true;
      this.innerId = this.detail.instanceId;
      console.log(this.detail, "dddddddddd");
    },
    // 点击回滚磁盘
    toRollback(record) {
      this.modalDetail = record;
      this.rollbackVisible = true;
      if (this.detail.runningStatus == 2) {
        let newTime = moment(record.createTime).format("YYYY-MM-DD HH:mm:ss");
        this.rollbackText = `对于云盘${record.sourceDiskId}将进行回滚操作，回滚至${newTime}快照数据，您是否确定操作？`;
      } else {
        this.rollbackText = `只有已停止的实例才可以回滚云盘，当前实例${this.detail.instanceName} 的状态未停止。`;
      }
    },
    // 点击删除快照
    handleDel(record) {
      this.modalDetail = record;
      this.delVisible = true;
    },
    //确认删除
    toDel() {
      let newStr = "";
      newStr = this.multipleSelection.toString();
      this.$store.dispatch("snapshoot/del", newStr).then((res) => {
        this.$message.success("删除成功");
        this.getList();
        this.delVisible = false;
      });
    },
    //确认回滚
    toResetDisk() {
      this.$store
        .dispatch("snapshoot/resetDisk", {
          diskId: this.modalDetail.sourceDiskId,
          snapshotId: this.modalDetail.snapshotInnerId
        })
        .then((res) => {
          this.$message.success("操作成功");
          this.getList();
          this.rollbackVisible = false;
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
.snapshotId {
  border: 1px solid #ccc;
  padding: 5px 15px;
}
</style>
