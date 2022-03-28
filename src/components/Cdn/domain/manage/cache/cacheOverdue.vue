<template>
  <div class="cdn-basic-container">
    <div class="head-info">
      支持配置自定义资源的缓存过期时间规则，支持指定路径或者文件名后缀方式。
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
          <div slot="ttl" slot-scope="text">
            {{ getTime(text) }}
          </div>
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
    <!-- 缓存过期弹窗 -->
    <UpdateCacheOverdueModal
      v-model="visible"
      :functionName="functionName"
      :detail="modalDetail"
      @success="modalSuccess"
    />
  </div>
</template>

<script>
import UpdateCacheOverdueModal from "@/components/Cdn/domain/manage/cache/UpdateCacheOverdueModal";
import { getForm } from "@/utils/index";
import { overdueTimeEnum } from "@/utils/enum";
export default {
  props: {
    tabsKey: {
      type: Number,
      default: 1
    }
  },
  components: { UpdateCacheOverdueModal },
  computed: {
    domain() {
      return this.$route.query.domain;
    }
  },
  watch: {
    tabsKey: {
      handler(newVal) {
        if (newVal === 1) {
          this.getConfig();
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      overdueTimeEnum,
      tableLoading: false,
      columns: [
        {
          title: "地址",
          dataIndex: "address"
        },
        {
          title: "类型",
          dataIndex: "type"
        },
        // {
        //   title: "过期时间",
        //   dataIndex: "ttl",
        //   scopedSlots: { customRender: "ttl" }
        // },
        {
          title: "权重",
          dataIndex: "weight"
        },
        {
          title: "操作",
          dataIndex: "action",
          fixed: "right",
          scopedSlots: { customRender: "action" }
        }
      ],
      data: [],
      functionName: "path_based_ttl_set,filetype_based_ttl_set",
      tempForm: {
        file_type: "",
        path: "",
        ttl: "",
        weight: ""
      },
      visible: false,
      modalDetail: {}
    };
  },
  methods: {
    getTime(num) {
      const timeType = Object.keys(this.overdueTimeEnum).find(
        (ele) => num % ele === 0 && num >= ele
      );
      return timeType;
    },
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
            const newData = getForm(ele, this.tempForm);
            return {
              ...ele,
              ...newData,
              address: newData.file_type || newData.path,
              type: newData.file_type ? "文件后缀名" : "目录"
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
