<template>
  <div>
    <DetailHeader title="发票申请" />
    <div class="title-hint">
      <a-steps :current="current">
        <a-step>
          <template slot="title"> 选择开票明细 </template>
          <div slot="description"></div>
        </a-step>
        <a-step title="选择发票及收货信息" />
      </a-steps>
    </div>
    <!-- 选择开票明细 -->
    <div v-show="current === 0">
      <div class="top-select">
        <a-input
          style="width: 150px; margin-left: 10px"
          placeholder="请输入订单ID"
        />
        <a-date-picker
          style="margin-left: 10px"
          v-model="startValue"
          :disabled-date="disabledStartDate"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="创建开始时间"
          @openChange="handleStartOpenChange"
        />
        --
        <a-date-picker
          v-model="endValue"
          :disabled-date="disabledEndDate"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="创建结束时间"
          :open="endOpen"
          @openChange="handleEndOpenChange"
        />
        <a-button style="margin-left: 10px" type="primary">查询</a-button>
      </div>
      <div>
        <a-table
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange
          }"
          :columns="columns"
          :data-source="data"
        >
          <div slot="companyName" slot-scope="text">{{ text }}</div>
          <div slot="action">
            <a-button type="link">申请开票</a-button>
            <a-button type="link">查看详情</a-button>
          </div>
        </a-table>
      </div>
      <div style="width: 100%">
        <p style="margin: 20px 0">
          <span>已选择发票金额：</span>
          <b style="color: #02a7f0">￥{{ 500 }}.00</b>
          <span>
            元，您选取了
            {{
              5
            }}条单据开具发票(若选中多条订单，填写开票金额将合并开具到一张票据中)
          </span>
        </p>
        <a-button class="next" type="primary" @click="current = 1">
          下一步
        </a-button>
      </div>
    </div>
    <div v-show="current === 1">
      <div class="table-type">
        <span>*</span>
        请选择发票抬头：
      </div>
      <div>
        <a-table
          :row-selection="{
            selectedRowKeys: selectedRowKeysTitle,
            onChange: onSelectChange
          }"
          :columns="columnsTitle"
          :data-source="dataTitle"
        >
          <div slot="companyName" slot-scope="text">{{ text }}</div>
          <div slot="action">
            <a-button type="link">编辑</a-button>
          </div>
        </a-table>
      </div>
      <a-button type="link" icon="plus">新增开票信息</a-button>
      <div class="table-type">
        <span>*</span>
        请选择收货信息：
      </div>
      <div>
        <a-table
          :row-selection="{
            selectedRowKeys: selectedRowKeysAddress,
            onChange: onSelectChangeAddress
          }"
          :columns="columnsAddress"
          :data-source="dataAddress"
        >
          <div slot="companyName" slot-scope="text">{{ text }}</div>
          <div slot="action">
            <a-button type="link">申请开票</a-button>
            <a-button type="link">查看详情</a-button>
          </div>
        </a-table>
      </div>
      <a-button type="link" icon="plus">新增常用地址</a-button>
      <div style="text-align: center">
        <a-button type="primary">提交申请</a-button>
        <a-button style="margin-left: 20px"  @click="current = 0">
          返回上一步
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import DetailHeader from "@/components/Common/detailHeader.vue";

export default {
  components: {
    DetailHeader
  },
  data() {
    return {
      current: 0,
      startValue: null,
      endValue: null,
      endOpen: false,
      // 选择开票明细
      data: [],
      selectedRowKeys: [], // Check here to configure the default column
      columns: [
        {
          title: "订单ID",
          dataIndex: "id",
          scopedSlots: { customRender: "id" }
        },
        {
          title: "产品名称",
          dataIndex: "name"
        },
        {
          title: "可开票金额",
          dataIndex: "amount"
        },
        {
          title: "订单创建时间",
          dataIndex: "createTime"
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      // 选择发票抬头
      dataTitle: [],
      selectedRowKeysTitle: [], // Check here to configure the default column
      columnsTitle: [
        {
          title: "发票抬头",
          dataIndex: "title",
          scopedSlots: { customRender: "title" }
        },
        {
          title: "开具类型",
          dataIndex: "issueType",
        },
        {
          title: "发票类型",
          dataIndex: "billType",
        },
        {
          title: "税务登记号",
          dataIndex: "taxRegistrationNumber",
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      // 选择收货信息
      dataAddress: [],
      selectedRowKeysAddress: [], // Check here to configure the default column
      columnsAddress: [
        {
          title: "收货人",
          dataIndex: "name",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "联系电话",
          dataIndex: "phone",
        },
        {
          title: "地址",
          dataIndex: "address",
        },
        {
          title: "详细地址",
          dataIndex: "detailAddress",
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ]
    };
  },
  watch: {
    startValue(val) {
      console.log("startValue", val);
    },
    endValue(val) {
      console.log("endValue", val);
    }
  },
  methods: {
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    // 选择发票抬头
    onSelectChangeTitle(selectedRowKeysTitle) {
      console.log("selectedRowKeysTitle changed: ", selectedRowKeysTitle);
      this.selectedRowKeysTitle = selectedRowKeysTitle;
    },
    // 选择收货信息
    onSelectChangeAddress(selectedRowKeysAddress) {
      console.log("selectedRowKeysAddress changed: ", selectedRowKeysAddress);
      this.selectedRowKeysAddress = selectedRowKeysAddress;
    }
  }
};
</script>

<style lang="less" scoped>
.title-hint {
  width: 80%;
  margin: 30px auto;
}
.top-select {
  margin: 20px 0;
}
.next {
  width: 120px;
  margin: 0px calc(50% - 60px);
}
.table-type {
  margin: 20px 0;
  span {
    color: #f00;
  }
}
</style>
