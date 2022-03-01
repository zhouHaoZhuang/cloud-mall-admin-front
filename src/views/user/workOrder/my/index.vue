<template>
  <div class="work-my-container">
    <!-- 头部标题 -->
    <div class="top">
      <div class="title">我的工单</div>
      <!-- <div class="help">
        <a-button type="link" icon="folder-open"> 工单帮助文档 </a-button>
      </div> -->
    </div>
    <!-- 按钮操作 -->
    <div class="btns">
      <div class="left">
        <a-space>
          <a-button type="primary" @click="handleJumpWorkOrder" icon="plus">
            提交工单
          </a-button>
          <a-input-group style="width: 400px" compact>
            <a-select v-model="listQuery.key" style="width: 100px">
              <a-select-option value="workOrderNo"> 工单编号 </a-select-option>
              <a-select-option value="title"> 问题标题 </a-select-option>
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
    <!-- 表格 -->
    <div class="table">
      <a-table
        rowKey="workOrderNo"
        :loading="tableLoading"
        :columns="columns"
        :data-source="data"
        :scroll="{ x: 1000 }"
        :pagination="paginationProps"
      >
        <!-- 工单编号 -->
        <div slot="workOrderNo" slot-scope="text, record">
          <a-button
            class="btn-link"
            type="link"
            @click="handleSelectWorkOrder(record)"
          >
            <div class="btn-link-txt">
              {{ text }}
            </div>
          </a-button>
        </div>
        <!-- 问题标题 -->
        <div slot="titleSlot" slot-scope="text, record">
          <a-button
            class="btn-link"
            type="link"
            @click="handleSelectWorkOrder(record)"
          >
            <div class="btn-link-txt">
              {{ text }}
            </div>
          </a-button>
        </div>
        <!-- 创建时间 -->
        <div slot="createTime" slot-scope="text">
          {{ text | formatDate }}
        </div>
        <!-- 状态 -->
        <div slot="status" slot-scope="text">
          <!-- 待接单 -->
          <div v-if="text === 1" class="wait status">
            <Iconfont class="icon" type="icon-daichuli" />
            {{ workOrderStatusEnum[text] }}
          </div>
          <!-- 处理中 -->
          <div v-if="text === 2" class="center status">
            <Iconfont class="icon" type="icon-ic_wait" />
            {{ workOrderStatusEnum[text] }}
          </div>
          <!-- 处理完成 -->
          <div v-if="text === 3" class="ok status">
            <Iconfont class="icon" type="icon-wancheng" />
            {{ workOrderStatusEnum[text] }}
          </div>
        </div>
        <!-- 操作 -->
        <div slot="action" slot-scope="text, record">
          <a-button type="link" @click="handleSelectWorkOrder(record)">
            查看
          </a-button>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { workOrderStatusEnum } from "@/utils/enum";
export default {
  data() {
    return {
      workOrderStatusEnum,
      listQuery: {
        key: "workOrderNo",
        search: "",
        submitTimeSort: "desc",
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      data: [],
      columns: [
        {
          title: "工单编号",
          dataIndex: "workOrderNo",
          width: 150,
          sorter: (a, b) => moment(a.workOrderNo) - moment(b.workOrderNo),
          scopedSlots: { customRender: "workOrderNo" }
        },
        {
          title: "问题标题",
          dataIndex: "title",
          width: 150,
          scopedSlots: { customRender: "titleSlot" }
        },
        {
          title: "问题类型",
          dataIndex: "questionCategoryName",
          width: 150
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          width: 150,
          sorter: (a, b) => moment(a.createTime) - moment(b.createTime),
          scopedSlots: { customRender: "createTime" }
        },
        {
          title: "状态",
          dataIndex: "status",
          width: 100,
          scopedSlots: { customRender: "status" }
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 80,
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
      tableLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取我的工单列表
    getList() {
      this.tableLoading = true;
      this.$getList("workorder/workOrderList", {
        ...this.listQuery
      })
        .then((res) => {
          this.data = res.data.list;
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
    // 跳转新建工单
    handleJumpWorkOrder() {
      this.$router.push("/user/workOrder/submit");
    },
    // 点击搜索
    handleSearch() {
      this.getList();
    },
    // 查看工单详情
    handleSelectWorkOrder(record) {
      this.$router.push({
        path: "/user/workOrder/detail",
        query: {
          workOrderNo: record.workOrderNo
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.work-my-container {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      font-size: 22px;
      color: #272829;
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
  .btn-link {
    padding: 0;
  }
  .btn-link-txt {
    width: 150px;
    text-align: left;
    word-break: break-all;
    white-space: normal;
  }
  .status {
    display: flex;
    align-items: center;
    .icon {
      margin-right: 3px;
    }
  }
  .wait {
    color: #262829;
    .icon {
      color: #00aaff;
      font-size: 18px;
    }
  }
  .center {
    color: #faad14;
    .icon {
      color: #faad14;
      font-size: 16px;
    }
  }
  .ok {
    color: #2bbe22;
    .icon {
      color: #2bbe22;
      font-size: 16px;
    }
  }
}
</style>
