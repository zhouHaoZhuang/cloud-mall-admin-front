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
          :columns="columns"
          :data-source="data"
          :pagination="false"
          rowKey="id"
        >
          <!-- <div slot="priority" slot-scope="text">
            {{ cdnPriorityEnum[text] }}
          </div> -->
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
      :detail="modalDetail"
      @success="modalSuccess"
    />
  </div>
</template>

<script>
import UpdateCacheOverdueModal from "@/components/Cdn/domain/manage/cache/UpdateCacheOverdueModal";
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
  components: { UpdateCacheOverdueModal },
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
      columns: [
        {
          title: "地址",
          dataIndex: "type"
        },
        {
          title: "类型",
          dataIndex: "content"
        },
        {
          title: "过期时间",
          dataIndex: "priority",
          scopedSlots: { customRender: "priority" }
        },
        {
          title: "权重",
          dataIndex: "priority"
        },
        {
          title: "状态",
          dataIndex: "priority",
          scopedSlots: { customRender: "priority" }
        },
        {
          title: "操作",
          dataIndex: "action",
          fixed: "right",
          scopedSlots: { customRender: "action" }
        }
      ],
      data: [{}],
      visible: false,
      modalDetail: {}
    };
  },
  methods: {
    // 弹窗成功回调
    modalSuccess(type, val) {
      this.modalDetail = {};
    },
    // 新增
    handleAdd() {
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
          this.$store.dispatch("domain/add", this.form).then((res) => {
            this.$message.success("删除成功");
            this.$emit("success");
            this.$emit("changeVisible", false);
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
