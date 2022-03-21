<template>
  <div class="cdn-basic-container">
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">Range回源</div>
        <div class="value">
          <a-button type="link" @click="handleChangeConfig(1)">
            修改配置
          </a-button>
        </div>
      </div>
      <div class="content-row">
        <div class="label">Range回源</div>
        <div class="value">
          关闭
          <div class="txt">
            指客户端通知源站服务器只返回指定范围的部分内容，
            对于较大文件的分发加速有很大帮助，
            当指定Range回源为强制时，请确保源站支持该参数。
          </div>
        </div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">拖拽播放</div>
        <div class="value"></div>
      </div>
      <div class="content-row">
        <div class="label">拖拽播放</div>
        <div class="value">
          <a-switch @change="handleChangeStatus">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
          <div class="txt">开启即支持视音频点播的随机拖拽播放功能。</div>
        </div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">听视频</div>
        <div class="value"></div>
      </div>
      <div class="content-row">
        <div class="label">听视频</div>
        <div class="value">
          <a-switch @change="handleChangeStatus">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
          <div class="txt">
            开启即支持听视频功能，节省流量，需要配合请求参数使用。支持FLV、MP4格式。
          </div>
        </div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">音视频试看</div>
        <div class="value"></div>
      </div>
      <div class="content-row">
        <div class="label">音视频试看</div>
        <div class="value">
          <a-switch @change="handleChangeStatus">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
          <div class="txt">
            开启即支持音视频试看功能，只返回试看时长的文件内容，支持FLV、TS格式。
          </div>
        </div>
      </div>
      <div class="content-row">
        <div class="label">自定义试看参数名</div>
        <div class="value">
          <a-button type="link" @click="handleChangeConfig(2)">
            修改配置
          </a-button>
        </div>
      </div>
    </div>
    <!-- 视频相关弹窗 -->
    <UpdateVideoModal
      v-model="visible"
      :type="modalType"
      :detail="modalDetail"
      @success="modalSuccess"
    />
  </div>
</template>

<script>
import UpdateVideoModal from "@/components/Cdn/domain/manage/videoRelevant/UpdateVideoModal";
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
  components: { UpdateVideoModal },
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
    // 修改https证书
    handleChangeHttps() {
      this.domainHttpsVisible = true;
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
