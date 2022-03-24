<template>
  <div class="record">
    <div class="search">
      <a-input-group compact enterButton="true">
        <a-select v-model="listQuery.detailType" style="width: 250px">
          <a-select-option value=""> 充值方式 </a-select-option>
          <a-select-option
            :value="index"
            v-for="(item, index) in rechargeTypeMap"
            :key="index"
          >
            {{ item }}
          </a-select-option>
        </a-select>
        <a-button type="primary" @click="onSearch">查询</a-button>
      </a-input-group>
    </div>
    <div>
      <a-table
        :columns="columns"
        :data-source="data"
        @change="handleChange"
        row-key="id"
        :pagination="paginationProps"
      >
        <div slot-scope="text" slot="createTime" v-if="text">
          {{ text | formatDate }}
        </div>
        <div slot-scope="text" slot="payTime">
          <span v-if="text">{{ text | formatDate }}</span>
          <span v-else>-----</span>
        </div>
        <div slot="detailType" slot-scope="text">
          {{ rechargeTypeMap[text] }}
        </div>
        <span slot="status" slot-scope="text">
          {{ detailTypeMapData[text] }}
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import { rechargeTypeMap, detailTypeMapData } from "@/utils/enum";
export default {
  data() {
    return {
      data: [],
      rechargeTypeMap,
      detailTypeMapData,
      columns: [
        {
          title: "支付ID",
          dataIndex: "payNo",
          key: "payNo"
        },
        {
          title: "充值金额",
          dataIndex: "dealAmount",
          key: "dealAmount",
          sorter: (a, b) => a.dealAmount - b.dealAmount
        },
        {
          title: "充值方式",
          dataIndex: "detailType",
          key: "detailType",
          scopedSlots: {
            customRender: "detailType"
          }
        },
        {
          title: "支付状态",
          dataIndex: "status",
          key: "status",
          scopedSlots: {
            customRender: "status"
          }
        },
        {
          title: "到账日期",
          dataIndex: "payTime",
          key: "payTime",
          sorter: (a, b) => {
            return (
              new Date(a.payTime).getTime() - new Date(b.payTime).getTime()
            );
          },
          scopedSlots: {
            customRender: "payTime"
          }
        },
        {
          title: "充值日期",
          dataIndex: "createTime",
          scopedSlots: {
            customRender: "createTime"
          },
          sorter: (a, b) => {
            return (
              new Date(a.createTime).getTime() -
              new Date(b.createTime).getTime()
            );
          }
        }
      ],
      listQuery: {
        key: "detailType",
        search: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
        sorter: "",
        detailType: ""
      },
      paginationProps: {
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total, range) =>
          `共 ${total} 条记录 第 ${this.listQuery.currentPage} / ${Math.ceil(
            total / this.listQuery.pageSize
          )} 页`,
        onChange: this.quickJump,
        onShowSizeChange: this.onShowSizeChange
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    onSearch() {
      console.log(this.listQuery);
      this.getList();
    },
    // 排序的回调
    handleChange(pagination, filters, sorter) {
      if (sorter) {
        if (sorter.columnKey == "memo") {
          // sorter.order = sorter.order.replace('end', '') + '-' + sorter.columnKey
          console.log(sorter, "这是充值方式");
        } else if (sorter.columnKey == "payTime") {
          console.log(sorter, "这是充值日期");
        }
      }
    },
    getList() {
      this.$store.dispatch("pay/getList", this.listQuery).then((res) => {
        this.data = res.data.list;
        this.paginationProps.total = res.data.totalCount * 1;
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
.record {
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
}
</style>
