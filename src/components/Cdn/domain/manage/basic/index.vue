<template>
  <div class="cdn-basic-container">
    <a-descriptions title="基本信息">
      <a-descriptions-item label="域名"> Zhou Maomao </a-descriptions-item>
      <a-descriptions-item label="CNAME"> 1810000000 </a-descriptions-item>
      <a-descriptions-item label="加速区域">
        仅中国大陆
        <a-button type="link" @click="handleUpdate"> 修改 </a-button>
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions title="源站信息">
      <a-descriptions-item>
        <a-button type="primary" @click="handleAddSource">
          新增源站信息
        </a-button>
        <a-table
          style="margin-top: 20px"
          :columns="columns"
          :data-source="form.data"
          :pagination="false"
          rowKey="id"
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
        <a-switch>
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
      :detail="modalDetail"
      @success="modalSuccess"
    />
    <!-- 修改加速区域弹窗 -->
    <UpdateRegionModal
      v-model="regionVisible"
      :domain="domain"
      @success="regionModalSuccess"
    />
  </div>
</template>

<script>
import UpdateSourceStationModal from "@/components/Cdn/domain/updateSourceStationModal";
import UpdateRegionModal from "@/components/Cdn/domain/manage/basic/updateRegionModal";
import { cdnTypeEnum, cdnPriorityEnum } from "@/utils/enum";
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
        if (newVal === "1") {
          //   this.getData();
        }
      }
    }
  },
  computed: {},
  data() {
    return {
      cdnTypeEnum,
      cdnPriorityEnum,
      form: {
        domain: "",
        type: 1,
        address: 1,
        data: [],
        status: true
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
      visible: false,
      modalDetail: {},
      regionVisible: false,
      abc: {
        Functions: [
          {
            functionArgs: [
              {
                argName: "switch",
                argValue: "on"
              },
              {
                argName: "region",
                argValue: "*"
              }
            ],
            functionName: "ipv6"
          }
        ],
        DomainNames: "example.com"
      }
    };
  },
  created() {},
  methods: {
    // 修改加速区域
    handleUpdate() {
      this.regionVisible = true;
    },
    // 修改加速成功回调
    regionModalSuccess() {},
    // 弹窗成功回调
    modalSuccess(type, val) {
      this.modalDetail = {};
      if (type === "add") {
        this.form.data.push({
          id: this.getId(),
          ...val
        });
        return;
      }
      const index = this.form.data.findIndex((ele) => ele.id === val.id);
      this.form.data.splice(index, 1, { ...val });
    },
    // 生成id
    getId() {
      const newId =
        this.form.data.length === 0
          ? -1
          : this.form.data[this.form.data.length - 1].id - 1;
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
          const index = this.form.data.findIndex((ele) => ele.id === record.id);
          this.form.data.splice(index, 1);
          this.$message.success("删除成功");
        }
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
