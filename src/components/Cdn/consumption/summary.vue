<template>
  <div class="cdn-summary-container">
    <div class="top-search">
      <a-space>
        <a-select
          style="width: 100px"
          allowClear
          v-model="listQuery.a"
          placeholder="请选择"
        >
          <a-select-option value="1"> 按日查询 </a-select-option>
          <a-select-option value="2"> 按月查询 </a-select-option>
        </a-select>
        <a-date-picker @change="onChange" />
        <a-month-picker @change="onChange" />
        <a-button type="primary" @click="handleSearch"> 查询 </a-button>
      </a-space>
    </div>
    <div class="table-box">
      <div class="top">
        <div class="title">按流量计费</div>
        <div class="title">2022-03-16 00:00:00至2022-03-16 23:59:59</div>
      </div>
      <div class="content">
        <a-table
          :columns="columns"
          :data-source="data"
          rowKey="id"
          :pagination="false"
        >
        </a-table>
      </div>
    </div>
    <div class="table-box">
      <div class="top">
        <div class="title">按增值服务计费</div>
        <div class="title">2022-03-16 00:00:00至2022-03-16 23:59:59</div>
      </div>
      <div class="content">
        <a-table
          :columns="plusColumns"
          :data-source="plusData"
          rowKey="id"
          :pagination="false"
        >
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    tabsKey: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      moment,
      listQuery: {
        a: "1",
        b: "1",
        c: "1",
        startTime: "",
        endTime: ""
      },
      columns: [
        {
          title: "时间",
          dataIndex: "domain"
        },
        {
          title: "中国内地",
          dataIndex: "domaina"
        },
        {
          title: "境外",
          dataIndex: "cnameStatus"
        }
      ],
      data: [{}],
      plusColumns: [
        {
          title: "时间",
          dataIndex: "domain"
        },
        {
          title: "静态HTTPS请求次数",
          dataIndex: "domaina"
        }
      ],
      plusData: [{}]
    };
  },
  created() {},
  methods: {
    // 日期选择
    onChange(date, dateString) {
      console.log(date, dateString);
    },
    // 搜索
    handleSearch() {},
    handleRadioChange() {}
  }
};
</script>

<style lang="less" scoped>
.cdn-summary-container {
  .top-search {
    display: flex;
  }
  .table-box {
    border: 1px solid #ddd;
    margin-top: 20px;
    .top {
      padding: 20px 24px;
      height: 60px;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-bottom: 1px solid #ddd;
      .title {
        font-size: 14px;
        font-weight: 600;
      }
    }
    .content {
      padding: 20px 24px;
    }
  }
}
</style>
<style lang="less">
.cdn-summary-container {
  .ant-table {
    min-width: 100px;
  }
}
</style>
