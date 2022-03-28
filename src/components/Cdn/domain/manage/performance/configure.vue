<template>
  <div class="cdn-basic-container">
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">页面优化</div>
        <div class="value"></div>
      </div>
      <div class="content-row">
        <div class="label">页面优化</div>
        <div class="value">
          <a-switch
            v-model="pageForm.enable"
            @change="handleChange(3, 'pageForm')"
          >
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
          <div class="txt">
            去除HTML页面页面冗余内容如注释以及重复的空白符,
            若源站文件自身有md5值校验机制，请勿开启此功能。
          </div>
        </div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">智能压缩</div>
        <div class="value"></div>
      </div>
      <div class="content-row">
        <div class="label">智能压缩</div>
        <div class="value">
          <a-switch
            v-model="gzipForm.enable"
            @change="handleChange(4, 'gzipForm')"
          >
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
          <div class="txt">
            对静态文件类型进行Gzip压缩, 有效减少用户传输内容大小,
            若源站文件自身有md5值校验机制，请勿开启此功能。
          </div>
        </div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">Brotli压缩</div>
        <div class="value"></div>
      </div>
      <div class="content-row">
        <div class="label">Brotli压缩</div>
        <div class="value">
          <a-switch
            v-model="brotliForm.enable"
            @change="handleChange(5, 'brotliForm')"
          >
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
          <div class="txt">
            对html、js、css等文本文件进行brotli压缩。当brotli和智能压缩同时开启时，优先选择brotli压缩。
          </div>
        </div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">保留参数</div>
        <div class="value">
          <a-button type="link" @click="handleChangeConfig(1)">
            修改配置
          </a-button>
        </div>
      </div>
      <div class="content-row">
        <div class="label">保留过滤参数</div>
        <div class="value">
          {{ hashkeyForm.disable ? "已开启" : "已关闭" }}
          <div class="txt">
            回源时会去除 URL
            中？之后的参数，有效提高文件缓存命中率，提升分发效率。
          </div>
        </div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">忽略参数</div>
        <div class="value">
          <a-button type="link" @click="handleChangeConfig(2)">
            修改配置
          </a-button>
        </div>
      </div>
      <div class="content-row">
        <div class="label">忽略参数</div>
        <div class="value">
          {{ removeForm.typeName }}
          <div class="txt">
            删除指定的参数，多个参数之间用空格隔开，剩余参数将不会被忽略。
          </div>
        </div>
      </div>
    </div>
    <!-- 回源配置弹窗 -->
    <UpdateFilterModal
      v-model="visible"
      :type="modalType"
      :modalMap="modalMap"
      @success="modalSuccess"
    />
  </div>
</template>

<script>
import UpdateFilterModal from "@/components/Cdn/domain/manage/performance/UpdateFilterModal";
import { getParameter, getForm } from "@/utils/index";
export default {
  props: {
    tabsKey: {
      type: Number,
      default: 1
    }
  },
  components: { UpdateFilterModal },
  watch: {
    tabsKey: {
      handler(newVal) {
        if (newVal === 6) {
          this.getBatchConfig();
        }
      },
      immediate: true
    }
  },
  computed: {
    domain() {
      return this.$route.query.domain;
    }
  },
  data() {
    return {
      visible: false,
      modalType: 1,
      modalMap: {
        1: {
          title: "保留参数",
          functionName: "set_hashkey_args",
          form: {
            disable: false,
            hashkey_args: "",
            keep_oss_args: false
          }
        },
        2: {
          title: "忽略参数",
          functionName: "ali_remove_args",
          form: {
            disable: false,
            ali_remove_args: "",
            keep_oss_args: false
          }
        },
        3: {
          title: "页面优化",
          functionName: "tesla"
        },
        4: {
          title: "智能压缩",
          functionName: "gzip"
        },
        5: {
          title: "Brotli压缩",
          functionName: "brotli"
        }
      },
      hashkeyForm: {
        disable: false,
        hashkey_args: "",
        keep_oss_args: false
      },
      removeForm: {
        typeName: "已关闭",
        ali_remove_args: "",
        keep_oss_args: false
      },
      pageForm: {
        enable: false
      },
      gzipForm: {
        enable: false
      },
      brotliForm: {
        enable: false,
        brotli_level: 1
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
              this.hashkeyForm = {
                ...getForm(data[0], newForm)
              };
            }
            if (type === 2) {
              this.removeForm = {
                ...getForm(data[0], newForm),
                typeName: "已开启"
              };
            }
            if (type === 3) {
              this.pageForm = {
                ...getForm(data[0], newForm)
              };
            }
            if (type === 4) {
              this.gzipForm = {
                ...getForm(data[0], newForm)
              };
            }
            if (type === 5) {
              this.brotliForm = {
                ...getForm(data[0], newForm)
              };
            }
          } else {
            if (type === 1) {
              this.hashkeyForm = {
                disable: false,
                hashkey_args: "",
                keep_oss_args: false
              };
            }
            if (type === 2) {
              this.removeForm.typeName = "已关闭";
            }
          }
        });
    },
    // 弹窗成功回调
    modalSuccess() {
      this.getConfig(1);
      this.getConfig(2);
    },
    // 修改配置
    handleChangeConfig(type) {
      this.modalType = type;
      this.visible = true;
    },
    // 页面优化开关 智能压缩开关 Brotli压缩开关
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
