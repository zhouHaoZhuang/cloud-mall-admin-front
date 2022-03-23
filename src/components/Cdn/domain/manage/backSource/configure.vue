<template>
  <div class="cdn-basic-container">
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">回源HOST</div>
        <div class="value">
          <a-button type="link" @click="handleChangeConfig(1)">
            修改配置
          </a-button>
        </div>
      </div>
      <div class="content-row">
        <div class="label">回源HOST</div>
        <div class="value">
          未开启
          <div class="txt">
            自定义在CDN节点回源过程中所需访问的WEB服务器域名。
          </div>
        </div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">回源协议</div>
        <div class="value">
          <a-button type="link" @click="handleChangeConfig(2)">
            修改配置
          </a-button>
        </div>
      </div>
      <div class="content-row">
        <div class="label">回源协议</div>
        <div class="value">
          <a-switch @change="handleChangeStatus">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
          <div class="txt">
            该功能可以配置回源的协议。开启该功能后，将根据指定的协议回源到您源站的80或443端口（自定义端口的配置将失效）。
          </div>
        </div>
      </div>
      <div class="content-row">
        <div class="label">协议类型</div>
        <div class="value">未设置</div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">回源SNI</div>
        <div class="value">
          <a-button type="link" @click="handleChangeConfig(3)">
            修改配置
          </a-button>
        </div>
      </div>
      <div class="content-row">
        <div class="label">状态</div>
        <div class="value">
          已关闭
          <div class="txt">
            如果您的源站IP绑定了多个域名，则CDN节点以HTTPS协议访问您的源站时，必须设置访问具体哪个域名（即SNI）。
          </div>
        </div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">回源请求超时时间</div>
        <div class="value">
          <a-button type="link" @click="handleChangeConfig(4)">
            修改配置
          </a-button>
        </div>
      </div>
      <div class="content-row">
        <div class="label">回源请求超时时间</div>
        <div class="value">
          当前回源请求超时时间为：30秒
          <div class="txt">回源请求超时时间。</div>
        </div>
      </div>
    </div>
    <!-- 回源配置弹窗 -->
    <UpdateBackSourceModal
      v-model="visible"
      :type="modalType"
      :detail="modalDetail"
      @success="modalSuccess"
    />
  </div>
</template>

<script>
import UpdateBackSourceModal from "@/components/Cdn/domain/manage/backSource/UpdateBackSourceModal";
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
  components: { UpdateBackSourceModal },
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
      visible: false,
      modalType: 1,
      modalDetail: {}
    };
  },
  created() {},
  methods: {
    // 弹窗成功回调
    modalSuccess(type, val) {
      this.modalDetail = {};
    },
    // 修改配置
    handleChangeConfig(type) {
      this.modalType = type;
      this.visible = true;
    },
    // 开启/关闭回源协议
    // 修改角色状态
    handleChangeStatus(record) {
      const statusTxt = !record.status ? "开启" : "关闭";
      this.$confirm({
        title: `确认要${statusTxt}当前角色吗？`,
        onOk: () => {
          this.$store
            .dispatch("organization/editRole", {
              id: record.id,
              status: record.status ? 0 : 1
            })
            .then((res) => {
              this.$message.success(`${statusTxt}成功`);
            });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "@/components/Cdn/domain/manage/common.less";
</style>
