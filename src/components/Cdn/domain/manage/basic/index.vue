<template>
  <div class="cdn-basic-container">
    <a-descriptions title="基本信息">
      <a-descriptions-item label="域名">
        {{ form.domainName }}
      </a-descriptions-item>
      <a-descriptions-item label="CNAME">
        {{ form.cname }}
      </a-descriptions-item>
      <a-descriptions-item label="加速区域">
        {{ scopeAreaEnum[form.scope] }}
        <a-button type="link" @click="handleUpdate"> 修改 </a-button>
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions title="源站信息">
      <a-descriptions-item>
        <a-button
          type="primary"
          :disabled="form.sourceModels.sourceModel.length === 20"
          @click="handleAddSource"
        >
          新增源站信息
        </a-button>
        <a-table
          style="margin-top: 20px"
          :loading="tableLoading"
          :columns="columns"
          :data-source="form.sourceModels.sourceModel"
          :pagination="false"
          rowKey="content"
        >
          <div slot="type" slot-scope="text">
            {{ cdnTypeEnum[text] }}
          </div>
          <div slot="priority" slot-scope="text">
            {{ cdnPriorityEnum[text] }}
          </div>
          <div slot="action" slot-scope="text, record">
            <a-space>
              <a-button type="link" @click="handleEditSource(record)">
                编辑
              </a-button>
              <a-button type="link" @click="handleDelSource(record)">
                删除
              </a-button>
            </a-space>
          </div>
        </a-table>
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions title="IPv6开关" :column="1">
      <a-descriptions-item label="状态">
        <a-switch v-model="ipv6Form.switch" @change="handleIpv6Change">
          <a-icon slot="checkedChildren" type="check" />
          <a-icon slot="unCheckedChildren" type="close" />
        </a-switch>
      </a-descriptions-item>
      <a-descriptions-item>
        <div class="info-txt">
          开启后，IPv6的客户端请求将支持以ipv6协议访问CDN，CDN也将携带ipv6的客户端IP信息访问您的源站。
        </div>
      </a-descriptions-item>
    </a-descriptions>
    <!-- 新增源站信息弹窗 -->
    <UpdateSourceStationModal
      v-model="visible"
      :isLocal="false"
      :detail="modalDetail"
      @success="modalSuccess"
    />
    <!-- 修改加速区域弹窗 -->
    <UpdateRegionModal
      v-model="regionVisible"
      :domain="domain"
      :scope="form.scope"
      @success="regionModalSuccess"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UpdateSourceStationModal from "@/components/Cdn/domain/updateSourceStationModal";
import UpdateRegionModal from "@/components/Cdn/domain/manage/basic/updateRegionModal";
import { cdnTypeEnum, cdnPriorityEnum, scopeAreaEnum } from "@/utils/enum";
import { getParameter, getForm } from "@/utils/index";
export default {
  props: {
    tabsKey: {
      type: Number,
      default: 1
    },
    domain: {
      type: String,
      default: ""
    }
  },
  components: { UpdateSourceStationModal, UpdateRegionModal },
  watch: {
    tabsKey: {
      handler(newVal) {
        if (newVal === 1) {
          this.getBasicConfig();
          this.getConfig();
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(["productCode"])
  },
  data() {
    return {
      cdnTypeEnum,
      cdnPriorityEnum,
      scopeAreaEnum,
      form: {
        sourceModels: {
          sourceModel: []
        }
      },
      columns: [
        {
          title: "源站类型",
          dataIndex: "type",
          scopedSlots: { customRender: "type" }
        },
        {
          title: "域名",
          dataIndex: "content"
        },
        {
          title: "优先级",
          dataIndex: "priority",
          scopedSlots: { customRender: "priority" }
        },
        {
          title: "权重",
          dataIndex: "weight"
        },
        {
          title: "端口",
          dataIndex: "port"
        },
        {
          title: "操作",
          dataIndex: "action",
          fixed: "right",
          scopedSlots: { customRender: "action" }
        }
      ],
      tableLoading: false,
      visible: false,
      modalDetail: {},
      regionVisible: false,
      ipv6Form: {
        switch: false,
        region: "*"
      }
    };
  },
  methods: {
    // 查询基础配置信息
    getBasicConfig() {
      this.$store
        .dispatch("cdn/getDomainBasicConfig", {
          domainName: this.domain,
          productCode: this.productCode
        })
        .then((res) => {
          this.form = { ...res.data };
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    // 查询ipv6配置信息
    getConfig() {
      this.$store
        .dispatch("cdn/getDomainConfig", {
          functionNames: "ipv6",
          domainName: this.domain
        })
        .then((res) => {
          const data = res.data.domainConfigs.domainConfig;
          if (data.length > 0) {
            const tempForm = { ...this.ipv6Form };
            this.ipv6Form = {
              ...getForm(data[0], tempForm)
            };
          }
        });
    },
    // 修改加速区域
    handleUpdate() {
      this.regionVisible = true;
    },
    // 修改加速成功回调
    regionModalSuccess() {
      this.getBasicConfig();
    },
    // 弹窗成功回调
    modalSuccess(type, val) {
      this.modalDetail = {};
      if (type === "add") {
        this.form.sourceModels.sourceModel.push({
          id: this.getId(),
          ...val
        });
        this.saveSourceInfo();
        return;
      }
      const index = this.form.sourceModels.sourceModel.findIndex(
        (ele) => ele.id === val.id
      );
      this.form.sourceModels.sourceModel.splice(index, 1, { ...val });
      this.saveSourceInfo();
    },
    // 生成id
    getId() {
      const newId =
        this.form.sourceModels.sourceModel.length === 0
          ? -1
          : this.form.sourceModels.sourceModel[
              this.form.sourceModels.sourceModel.length - 1
            ].id - 1;
      return newId;
    },
    // 新增源站信息
    handleAddSource() {
      this.visible = true;
    },
    // 编辑源站信息
    handleEditSource(record) {
      this.modalDetail = { ...record };
      this.visible = true;
    },
    // 删除源站信息
    handleDelSource(record) {
      this.$confirm({
        title: "确定要删除吗?",
        onOk: () => {
          const index = this.form.sourceModels.sourceModel.findIndex(
            (ele) => ele.id === record.id
          );
          this.form.sourceModels.sourceModel.splice(index, 1);
          this.saveSourceInfo(true);
        }
      });
    },
    // 新增+编辑+删除源站信息
    saveSourceInfo(showMessage) {
      this.$store
        .dispatch("cdn/updateSourceInfo", {
          domainName: this.domain,
          sourcesList: {
            sourceModel: [...this.form.sourceModels.sourceModel]
          }
        })
        .then((res) => {
          this.tableLoading = true;
          if (showMessage) {
            this.$message.success(`删除成功`);
          }
          setTimeout(() => {
            this.getBasicConfig();
          }, 1000);
        })
        .catch(() => {
          setTimeout(() => {
            this.getBasicConfig();
          }, 1000);
        });
    },
    // ipv6 change
    handleIpv6Change() {
      const newForm = {
        ...getParameter(this.ipv6Form, "ipv6", this.domain)
      };
      this.$store.dispatch("cdn/saveConfig", newForm).then((res) => {
        this.$message.success(`设置成功`);
        this.getConfig();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.cdn-basic-container {
  width: 100%;
  .info-txt {
    color: #aaa;
    line-height: 22px;
    margin-left: 40px;
  }
}
</style>
