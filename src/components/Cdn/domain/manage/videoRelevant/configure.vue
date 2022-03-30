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
          <span v-if="rangeForm.enable === 'on'">开启</span>
          <span v-if="rangeForm.enable === 'off'">关闭</span>
          <span v-if="rangeForm.enable === 'force'">强制开启</span>
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
          <a-switch
            v-model="dragForm.enable"
            @change="handleChange(3, 'dragForm')"
          >
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
          <a-switch
            v-model="hearForm.enable"
            @change="handleChange(4, 'hearForm')"
          >
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
          <a-switch
            v-model="lookForm.enable"
            @change="handleChange(5, 'lookForm')"
          >
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
      :modalMap="modalMap"
      @success="modalSuccess"
    />
  </div>
</template>

<script>
import UpdateVideoModal from "@/components/Cdn/domain/manage/videoRelevant/UpdateVideoModal";
import { getParameter, getForm } from "@/utils/index";
export default {
  props: {
    tabsKey: {
      type: Number,
      default: 1
    }
  },
  components: { UpdateVideoModal },
  computed: {
    domain() {
      return this.$route.query.domain;
    }
  },
  watch: {
    tabsKey: {
      handler(newVal) {
        if (newVal === 7) {
          this.getBatchConfig();
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      visible: false,
      modalType: 1,
      modalMap: {
        1: {
          title: "Range回源设置",
          functionName: "range",
          form: {
            enable: "off"
          }
        },
        2: {
          title: "音视频试看",
          functionName: "ali_video_preview",
          form: {
            enable: false,
            ali_video_preview_argument: ""
          }
        },
        3: {
          title: "拖拽播放",
          functionName: "video_seek"
        },
        4: {
          title: "听视频",
          functionName: "ali_video_split"
        },
        5: {
          title: "视频试看",
          functionName: "ali_video_preview"
        }
      },
      rangeForm: {
        enable: "off"
      },
      dragForm: {
        enable: false
      },
      hearForm: {
        enable: false
      },
      lookForm: {
        enable: false,
        ali_video_preview_argument: "fds"
      }
    };
  },
  methods: {
    // 批量查询配置信息
    getBatchConfig() {
      Object.keys(this.modalMap).forEach((ele, index) => {
        this.getConfig(index + 1);
      });
    },
    // 查询配置信息
    getConfig(type) {
      this.$store
        .dispatch("cdn/getDomainConfig", {
          functionNames: this.modalMap[type].functionName,
          domainName: this.domain
        })
        .then((res) => {
          const data = res.data.domainConfigs.domainConfig;
          if (data.length > 0) {
            const newForm = { ...this.modalMap[type].form };
            if (type === 1) {
              this.rangeForm = {
                ...getForm(data[0], newForm, ["enable"])
              };
            }
            if (type === 3) {
              this.dragForm = {
                ...getForm(data[0], newForm)
              };
            }
            if (type === 4) {
              this.hearForm = {
                ...getForm(data[0], newForm)
              };
            }
            if (type === 2 || type === 5) {
              this.lookForm = {
                ...getForm(data[0], newForm)
              };
            }
          } else {
            // if (type === 2) {
            //   this.removeForm.typeName = "已关闭";
            // }
          }
        });
    },
    // 弹窗成功回调
    modalSuccess(type) {
      this.getConfig(type);
    },
    // 修改配置
    handleChangeConfig(type) {
      this.modalType = type;
      this.visible = true;
    },
    // 页面开关事件
    handleChange(type, formName) {
      const tempForm = { ...this[formName] };
      const newForm = {
        ...getParameter(tempForm, this.modalMap[type].functionName, this.domain)
      };
      this.$store.dispatch("cdn/saveConfig", newForm).then((res) => {
        this.$message.success(`设置成功`);
        this.getConfig(type);
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "@/components/Cdn/domain/manage/common.less";
</style>
