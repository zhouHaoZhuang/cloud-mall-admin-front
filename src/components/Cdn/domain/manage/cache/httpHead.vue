<template>
  <div class="cdn-basic-container">
    <div class="head-info">
      可设置HTTP响应头，目前提供10个HTTP响应头参数可供自行定义取值。
    </div>
    <a-descriptions>
      <a-descriptions-item>
        <a-button type="primary" @click="handleAdd"> 添加 </a-button>
        <a-table
          style="margin-top: 20px"
          :loading="tableLoading"
          :columns="columns"
          :data-source="data"
          :pagination="false"
          rowKey="configId"
        >
          <div slot="action" slot-scope="text, record">
            <a-space>
              <a-button type="link" @click="handleEdit(record)">
                编辑
              </a-button>
              <a-button type="link" @click="handleDel(record)"> 删除 </a-button>
            </a-space>
          </div>
        </a-table>
      </a-descriptions-item>
    </a-descriptions>
    <!-- http头弹窗 -->
    <UpdateHttpHeadModal
      v-model="visible"
      :functionName="functionName"
      :detail="modalDetail"
      @success="modalSuccess"
    />
  </div>
</template>

<script>
import UpdateHttpHeadModal from "@/components/Cdn/domain/manage/cache/UpdateHttpHeadModal";
import { getForm } from "@/utils/index";
export default {
  props: {
    tabsKey: {
      type: Number,
      default: 1
    }
  },
  components: { UpdateHttpHeadModal },
  computed: {
    domain() {
      return this.$route.query.domain;
    }
  },
  watch: {
    tabsKey: {
      handler(newVal) {
        if (newVal === 3) {
          this.getConfig();
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      tableLoading: false,
      columns: [
        {
          title: "参数",
          dataIndex: "key"
        },
        {
          title: "取值",
          dataIndex: "value"
        },
        {
          title: "操作",
          dataIndex: "action",
          fixed: "right",
          scopedSlots: { customRender: "action" }
        }
      ],
      data: [],
      functionName: "set_resp_header",
      tempForm: {
        key: "",
        value: ""
      },
      visible: false,
      modalDetail: {}
    };
  },
  methods: {
    // 查询配置信息
    getConfig() {
      this.tableLoading = true;
      this.$store
        .dispatch("cdn/getDomainConfig", {
          functionNames: this.functionName,
          domainName: this.domain
        })
        .then((res) => {
          const newRes = res.data.domainConfigs.domainConfig;
          this.data = newRes.map((ele) => {
            return {
              ...ele,
              ...getForm(ele, this.tempForm)
            };
          });
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    // 弹窗成功回调
    modalSuccess() {
      this.getConfig();
    },
    // 新增
    handleAdd() {
      this.modalDetail = {};
      this.visible = true;
    },
    // 编辑
    handleEdit(record) {
      this.modalDetail = { ...record };
      this.visible = true;
    },
    // 删除
    handleDel(record) {
      this.$confirm({
        title: "确定要删除吗?",
        onOk: () => {
          this.$store
            .dispatch("cdn/delAloneConfig", {
              functionNames: this.functionName,
              domainName: this.domain,
              configId: record.configId
            })
            .then((res) => {
              this.$message.success("删除成功");
              this.getConfig();
            });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.cdn-basic-container {
  .head-info {
    height: 35px;
    line-height: 35px;
    padding-left: 20px;
    background: #eee;
    margin-bottom: 15px;
  }
  .info-txt {
    color: #aaa;
    line-height: 22px;
    margin-left: 40px;
  }
}
</style>
