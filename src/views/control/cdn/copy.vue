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
            rowKey="configId"
            :pagination="false"
            :row-selection="rowSelection"
          >
          </a-table>
        </div>
        <!-- 选择域名 -->
        <div v-if="current === 1" class="transfer">
          <a-transfer
            :titles="['域名', '已选域名']"
            :rowKey="(record) => record.id"
            :selected-keys="selectedKeys"
            :data-source="domainData"
            :list-style="{
              width: '400px',
              minHeight: '500px'
            }"
            show-search
            :filter-option="filterOption"
            :target-keys="targetKeys"
            :render="(item) => item.domain"
            @change="handleChange"
          />
        </div>
        <!-- 完成 -->
        <a-result v-if="showSuccess" status="success" title="复制配置完成">
          <template #extra>
            <a-button type="primary" @click="handleCancel">
              返回域名管理
            </a-button>
          </template>
        </a-result>
        <!-- 按钮 -->
        <div v-if="!showSuccess" class="btn-box">
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
  computed: {
    rowSelection() {
      const _this = this;
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: (record) => ({
          props: {
            // 全部默认禁止选中
            disabled: record.disabled,
            // 某几项默认选中(R: 当state等于1时)
            defaultChecked: record.state == 1
          }
        })
      };
    }
  },
  data() {
    return {
      current: 0,
      // 穿梭框
      domainData: [],
      targetKeys: [],
      showSuccess: false,
      selectedKeys: ["1"], //默认选择域名
      copyType: undefined, //复制类型：sourceInfo:复制源站信息；other:其他配置信息
      // 表格
      tableLoading: false,
      columns: [
        {
          title: "配置项",
          dataIndex: "functionNameCn"
        },
        {
          title: "当前配置",
          dataIndex: "configEnable"
        }
      ],
      data: [],
      selectedRowKeys: [],
      loading: false,
      targetDomains: "", //目标配置
      listQuery: {
        key: undefined,
        search: "",
        startTime: undefined,
        endTime: undefined,
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      defaultConfigId: ""
    };
  },
  created() {
    this.getConfig();
    this.getList();
  },
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
    // 提交下一步
    handleNext() {
      this.current += 1;
      if (this.current == 2) {
        this.$confirm({
          title:
            "您确定要批量复制配置项吗?域名配置复制后，操作不可逆，请务必确认您的域名复制选择无误",
          onOk: () => {
            this.$store
              .dispatch("cdn/copyConfig", {
                copyType: this.copyType, //复制类型：sourceInfo:复制源站信息；other:其他配置信息
                sourceDomain: this.$route.query.domain,
                targetDomains: this.targetDomains,
                functionNames: this.functionName
              })
              .then((res) => {
                this.showSuccess = true;
                this.$message.success("复制成功");
                // this.getConfig();
                // this.current = 1
              });
          }
        });
      }
    },
    // 取消
    handleCancel() {
      this.$router.back();
    },
    getConfig() {
      this.$store
        .dispatch("cdn/getCdnConfig", { domainName: this.$route.query.domain })
        .then((res) => {
          let obj = [
            {
              functionNameCn: "回源信息",
              configEnable: "已设置",
              id: 0
            }
          ];
          const newData = res.data.domainConfigs.domainConfig;
          this.data = newData.map((ele) => {
            return {
              ...ele,
              disabled: false
            };
          });
          this.defaultConfigId = newData.length > 1 ? newData[0].configId : "";
        });
    },
    //查询列表
    getList() {
      this.$getListQp("cdn/getDomainList", this.listQuery)
        .then((res) => {
          this.domainData = res.data.list;
          let newArr = [];
          this.domainData.forEach((element) => {
            if (element.domain !== this.$route.query.domain) {
              newArr.push(element.domain);
            }
          });
          this.targetDomains = newArr.toString();
        })
        .finally(() => {});
    },
    onSelectChange(selectedRowKeys) {
      const newData = [...this.data];
      if (selectedRowKeys.length === 0) {
        this.data = newData.map((ele) => {
          return {
            ...ele,
            disabled: false
          };
        });
        this.selectedRowKeys = selectedRowKeys;
        return;
      }
      const flag = selectedRowKeys.indexOf(this.defaultConfigId) !== -1;
      this.data = newData.map((ele, index) => {
        let disabled = false;
        if (flag) {
          disabled = index === 0 ? false : true;
        } else {
          disabled = index !== 0 ? false : true;
        }
        return {
          ...ele,
          disabled
        };
      });
      this.selectedRowKeys = selectedRowKeys;
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
