<template>
  <div class="cdn-copy-container">
    <div class="header">
      <DetailHeader title="复制配置" />
      <div class="info">
        复制配置允许将一个域名的配置项复制到多个域名，帮助您对域名进行批量配置。
      </div>
    </div>
    <div class="content">
      <!-- 步骤 -->
      <a-steps :current="current">
        <a-step title="选择配置项" />
        <a-step title="选择域名" />
        <a-step title="完成" />
      </a-steps>
      <div class="box">
        <!-- 选择配置项 -->
        <div v-if="current === 0" class="select">
          <div class="info">
            选择复制源站信息时，无法同时复制其他配置项，若您还需要复制其他配置项，请在源站信息复制成功后，再次复制。
          </div>
          <a-table
            style="margin-top: 20px"
            :loading="tableLoading"
            :columns="columns"
            :data-source="data"
            rowKey="id"
            :pagination="false"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange
            }"
          >
          </a-table>
        </div>
        <!-- 选择域名 -->
        <div v-if="current === 1" class="transfer">
          <a-transfer
            :rowKey="(record) => record.id"
            :data-source="domainData"
            :list-style="{
              width: '400px',
              minHeight: '500px'
            }"
            show-search
            :filter-option="filterOption"
            :target-keys="targetKeys"
            :render="(item) => item.username"
            @change="handleChange"
          />
        </div>
        <!-- 完成 -->
        <a-result v-if="current === 2" status="success" title="复制配置完成">
          <template #extra>
            <a-button type="primary" @click="handleCancel">
              返回域名管理
            </a-button>
          </template>
        </a-result>
        <!-- 按钮 -->
        <div v-if="current !== 2" class="btn-box">
          <a-space>
            <a-button type="primary" :loading="loading" @click="handleNext">
              下一步
            </a-button>
            <a-button @click="handleCancel"> 取消 </a-button>
          </a-space>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DetailHeader from "@/components/Common/detailHeader";
export default {
  components: { DetailHeader },
  computed: {},
  data() {
    return {
      current: 0,
      // 穿梭框
      domainData: [],
      targetKeys: [],
      // 表格
      tableLoading: false,
      columns: [
        {
          title: "配置项",
          dataIndex: "domain"
        },
        {
          title: "当前配置",
          dataIndex: "cnameStatus"
        }
      ],
      data: [{}],
      selectedRowKeys: [],
      loading: false
    };
  },
  created() {},
  methods: {
    // 穿梭框
    // 搜索过滤函数
    filterOption(inputValue, option) {
      return option.username.indexOf(inputValue) > -1;
    },
    // 穿梭框change事件
    handleChange(targetKeys, direction, moveKeys) {
      this.targetKeys = [...targetKeys];
    },
    // 表格多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 提交下一步
    handleNext() {
      this.current += 1;
      // this.loading = true;
      // this.$store
      //   .dispatch("domain/add", this.form)
      //   .then((res) => {})
      //   .finally(() => {
      //     this.loading = false;
      //   });
    },
    // 取消
    handleCancel() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
.cdn-copy-container {
  .header {
    display: flex;
    flex-direction: column;
    font-weight: 500;
    font-size: 22px;
    color: #272829;
    .info {
      font-size: 16px;
      margin-left: 55px;
      margin-top: 20px;
    }
  }
  .content {
    padding: 34px;
    .box {
      margin-top: 30px;
      .transfer {
        display: flex;
        justify-content: center;
      }
      .btn-box {
        margin-top: 30px;
      }
    }
  }
}
</style>
