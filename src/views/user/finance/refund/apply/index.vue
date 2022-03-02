<template>
  <div>
    <h1>退款列表</h1>
    <div class="top-menu">
      <span
        :class="{ 'top-menu-item': true, cutover: item.key == cutover }"
        v-for="item in topList"
        :key="item.key"
      >
        {{ item.title }}
      </span>
    </div>
    <div class="alert-warn">
      您已成功退订0台云服务器，目前只能选择不超过1台的云服务器进行退订操作。
    </div>
    <div>
      <a-table
        :columns="columns"
        :data-source="data"
        :loading="loading"
        :pagination="paginationProps"
      >
        <a slot="name" slot-scope="text">{{ text }}</a>
      </a-table>
    </div>
    <div class="alert-warn-lg margin-top-70 margin-bottom-20">
      <div class="tip-title">5天无理由退款说明：</div>
      <ul class="ny-panel-list">
        <li>1. {{ companyInfo.companyName }}承诺自购买之日起，5天无理由退款</li>
        <li>2. 每个用户限退云服务器1台</li>
        <li>3. 退还实付金额，已使用代金券不退还</li>
        <li>
          4.
          活动购买的云服务器申请5天无理由退款后，赠品（代金券、延长服务期等）将作废清零
        </li>
        <li>5. 活动规则中说明“不支持5天无理由退款”无法申请退款</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      companyInfo: (state) => state.dashboard.companyInfo
    })
  },
  data() {
    return {
      cutover: "0",
      topList: [
        {
          title: "云服务器",
          key: "0"
        }
      ],
      loading: false,
      data: [],
      columns: [
        {
          title: "关联订单",
          key: "name"
        },
        {
          title: "IP",
          key: "type"
        },
        {
          title: "购买日期",
          key: "amount"
        },
        {
          title: "到期日期",
          key: "applydate"
        },
        {
          title: "可退金额",
          key: "status"
        },
        {
          title: "操作",
          key: "action"
        }
      ],
      listQuery: {
        key: "",
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      paginationProps: {
        showSizeChanger: true,
        total: 1,
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
    // this.getList();
  },
  methods: {
    //查询数据表格
    getList() {
      this.loading = true;
      this.$getList("refund/getRefundList", this.listQuery)
        .then((res) => {
          this.data = [...res.data.list];
          this.paginationProps.total = res.data.totalCount * 1;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 表格分页快速跳转n页
    quickJump(currentPage) {
      this.listQuery.currentPage = currentPage;
      this.getList();
    },
    // 表格分页每页显示条数改变
    onShowSizeChange(current, pageSize) {
      this.listQuery.currentPage = current;
      this.listQuery.pageSize = pageSize;
      this.getList();
    }
  }
};
</script>

<style lang="less" scoped>
.top-menu {
  margin-bottom: 25px;
  background-color: #f0f3f5;
  // border-bottom: 1px solid #e1e4e6;
  .top-menu-item {
    display: inline-block;
    height: 100%;
    line-height: 50px;
    padding: 0 50px;
    margin-left: 1px;
  }
  .cutover {
    background-color: #fff;
    color: #0af;
    border-top: 4px solid #0af;
  }
}
.alert-warn {
  padding: 7px 22px 5px 37px;
  background: #fff3eb url(../../../../../assets/img/pay/ExclamationMark.png)
    no-repeat 10px 8px;
  min-height: 32px;
  border: 1px solid #ffdac2;
  border-radius: 2px;
  color: #f60;
  font-size: 13px;
  margin-bottom: 20px;
}
.margin-top-70 {
  margin-top: 70px;
}
.margin-bottom-20 {
  margin-bottom: 20px;
}
.alert-warn-lg .tip-title {
  position: relative;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  padding-left: 10px;
  margin-bottom: 10px;
  font-weight: bold;
  color: #ff6600;
  font-size: 14px;
}
.alert-warn-lg .tip-title:after {
  position: absolute;
  bottom: -1px;
  left: 0;
  content: "";
  width: 80px;
  height: 2px;
  background: #ff6600;
}
.ny-panel-list {
  line-height: 2.5;
  padding: 10px;
  li {
    list-style: none;
    color: #4d4d4d;
  }
}
</style>
