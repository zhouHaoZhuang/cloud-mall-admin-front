<template>
  <div class="container" @click="exportData">
    <template v-if="$slots.view">
      <slot name="view"></slot>
    </template>
    <template v-else>
      <!-- 默认样式  -->
      <a-button :disabled="btnDisabled" type="primary"> 导出 </a-button>
    </template>
  </div>
</template>

<script>
import XLSX from "xlsx"; //"xlsx": "^0.16.0"(插件版本号)
export default {
  props: {
    // 表格的表头
    columns: {
      type: Array,
      default: []
    },
    // 表格中的数据
    tableList: {
      type: Array,
      default: []
    },
    // 设置(默认)导出按钮的禁用状态
    btnDisabled: {
      type: Boolean,
      default: false
    },
    // fileName导出数据的文件名
    fileName: {
      type: String,
      default: "导出表格"
    }
  },
  methods: {
    transData(columns, tableList) {
      const obj = columns.reduce((acc, cur) => {
        if (!acc.titles && !acc.keys) {
          acc.titles = [];
          acc.keys = [];
        }
        acc.titles.push(cur.title);
        acc.keys.push(cur.dataIndex);
        return acc;
      }, {});
      const tableBody = tableList.map((item) => {
        return obj.keys.map((key) => item[key]);
      });
      return [obj.titles, ...tableBody];
    },
    exportData() {
      this.columns = Array.isArray(this.columns) ? this.columns : [];
      this.tableList = Array.isArray(this.tableList) ? this.tableList : [];
      if (this.columns.length === 0) {
        this.$message.warning("请设置表头");
        return;
      }
      if (this.tableList.length === 0) {
        this.$message.warning("请设置表格数据");
        return;
      }
      const tableData = this.transData(this.columns, this.tableList);
      // 将一组 JS 数据数组转换为工作表
      const ws = XLSX.utils.aoa_to_sheet(tableData);
      // 创建 workbook
      const wb = XLSX.utils.book_new();
      // 将 工作表 添加到 workbook
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      // 将 workbook 写入文件
      XLSX.writeFile(wb, `${this.fileName}.xlsx`);
    }
  }
};
</script>

<style></style>
