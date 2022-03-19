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
        <div v-if="current === 1" class="select">
          <div class="info">
            选择复制源站信息时，无法同时复制其他配置项，若您还需要复制其他配置项，请在源站信息复制成功后，再次复制。
          </div>
        </div>
        <!-- 选择域名 -->
        <div v-if="current === 2" class="transfer">
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
      current: 1,
      // 穿梭框
      domainData: [],
      targetKeys: []
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
      .select{}
      .transfer {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
