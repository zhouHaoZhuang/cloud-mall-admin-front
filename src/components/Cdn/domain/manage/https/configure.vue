<template>
  <div class="cdn-basic-container">
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">HTTPS证书</div>
        <div class="value">
          <a-button type="link" @click="handleChangeHttps"> 修改配置 </a-button>
        </div>
      </div>
      <div class="content-row">
        <div class="label">HTTPS证书</div>
        <div class="value">
          {{ sslForm.enable ? "已开启" : "已关闭" }}
          <div class="txt">
            提供全链路HTTPS安全加速方案, 支持证书上传和状态管理。
          </div>
        </div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">HTTP/2设置</div>
        <div class="value"></div>
      </div>
      <div class="content-row">
        <div class="label">HTTP/2设置</div>
        <div class="value">
          <a-switch v-model="http2Form.http2" @change="handleChangeHttp2">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
          <div class="txt">
            HTTP/2是最新的HTTP协议, 开启前您需要先配置HTTPS证书。
          </div>
        </div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">强制跳转</div>
        <div class="value">
          <a-button type="link" @click="handleChangeConfig(1)">
            修改配置
          </a-button>
        </div>
      </div>
      <div class="content-row">
        <div class="label">跳转类型</div>
        <div class="value">
          {{ httpForm.type }}
          <div class="txt">同时支持HTTP和HTTPS方式的请求。</div>
        </div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">TLS版本控制</div>
        <div class="value"></div>
      </div>
      <div class="content-row">
        <div class="label"></div>
        <div class="value">
          <div class="txt">
            TPS协议版本开启或关闭后，您的加速域名也将开启或关闭TLS握手。
          </div>
        </div>
      </div>
      <div class="content-row">
        <div class="label">TLSv1.0</div>
        <div class="value">
          <a-switch v-model="tlsForm.tls10" @change="handleChangeTls">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
        </div>
      </div>
      <div class="content-row">
        <div class="label">TLSv1.1</div>
        <div class="value">
          <a-switch v-model="tlsForm.tls11" @change="handleChangeTls">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
        </div>
      </div>
      <div class="content-row">
        <div class="label">TLSv1.2</div>
        <div class="value">
          <a-switch v-model="tlsForm.tls12" @change="handleChangeTls">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
        </div>
      </div>
      <div class="content-row">
        <div class="label">TLSv1.3</div>
        <div class="value">
          <a-switch v-model="tlsForm.tls13" @change="handleChangeTls">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
        </div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">HSTS</div>
        <div class="value">
          <a-button type="link" @click="handleChangeConfig(2)">
            修改配置
          </a-button>
        </div>
      </div>
      <div class="content-row">
        <div class="label">HSTS开关</div>
        <div class="value">
          {{ hstsForm.enabled ? "开启" : "关闭" }}
          <div class="txt">
            开启HSTS后，可以减少第一次访问被劫持的风险，CDN将响应HSTS头部：Strict-Transport-Security。
          </div>
        </div>
      </div>
    </div>
    <!-- https设置弹窗 -->
    <DomainHttps
      v-model="domainHttpsVisible"
      :domain="domain"
      @success="modalSuccess"
    />
    <!-- 回源配置弹窗 -->
    <UpdateHttpsModal
      v-model="visible"
      :type="modalType"
      :modalMap="modalMap"
      @success="modalSuccess"
    />
  </div>
</template>

<script>
import DomainHttps from "@/components/Cdn/domain/manage/https/domainHttps";
import UpdateHttpsModal from "@/components/Cdn/domain/manage/https/UpdateHttpsModal";
import { getParameter, getForm } from "@/utils/index";
export default {
  props: {
    tabsKey: {
      type: Number,
      default: 1
    }
  },
  components: { DomainHttps, UpdateHttpsModal },
  watch: {
    tabsKey: {
      handler(newVal) {
        if (newVal === 4) {
          this.getDomainHttps();
          this.getForceConfig();
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
      // https设置弹窗
      domainHttpsVisible: false,
      visible: false,
      modalType: 1,
      modalMap: {
        1: {
          title: "强制跳转",
          isBeforeDel: "cdn/delAloneConfig",
          functionName: "https_force",
          form: { enable: false }
        },
        2: {
          title: "HSTS 设置",
          functionName: "HSTS",
          form: {
            enabled: false,
            https_hsts_max_age: "",
            https_hsts_include_subdomains: false
          }
        },
        3: {
          title: "HTTP/2设置",
          functionName: "https_option",
          form: { http2: false }
        },
        4: {
          title: "TLS版本控制",
          functionName: "https_tls_version",
          form: { tls10: false, tls11: false, tls12: false, tls13: false }
        }
      },
      sslForm: {
        enable: false
      },
      http2Form: {
        http2: false
      },
      httpForm: {
        type: ""
      },
      tlsForm: { tls10: false, tls11: false, tls12: false, tls13: false },
      hstsForm: {
        enabled: false,
        https_hsts_max_age: "",
        https_hsts_include_subdomains: false
      }
    };
  },
  methods: {
    // 获取https配置
    getDomainHttps() {
      this.$store
        .dispatch("cdn/getDomainHttps", { domainName: this.domain })
        .then((res) => {
          const newData = res.data.certInfos.certInfo[0];
          this.sslForm = {
            enable: newData.enable === "on" ? true : false
          };
        });
    },
    // 获取强制跳转配置
    getForceConfig() {
      this.$store
        .dispatch("cdn/getDomainConfig", {
          functionNames: "http_force,https_force",
          domainName: this.domain
        })
        .then((res) => {
          const data = res.data.domainConfigs.domainConfig;
          if (data.length > 0) {
            this.httpForm.type =
              data[0].functionName === "http_force"
                ? "HTTPS -> HTTP"
                : "HTTP -> HTTPS";
          } else {
            this.httpForm.type = "默认";
          }
        });
    },
    // 批量查询配置信息
    getBatchConfig() {
      Object.keys(this.modalMap).forEach((ele, index) => {
        if (index + 1 !== 1) {
          this.getConfig(index + 1);
        }
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
            if (type === 2) {
              this.hstsForm = {
                ...getForm(data[0], newForm)
              };
            }
            if (type === 3) {
              this.http2Form = {
                ...getForm(data[0], newForm)
              };
            }
            if (type === 4) {
              this.tlsForm = {
                ...getForm(data[0], newForm)
              };
            }
          }
        });
    },
    // 弹窗成功回调
    modalSuccess(type) {
      if (type === -1) {
        this.getDomainHttps();
        return;
      }
      if (type === 1) {
        this.getForceConfig();
        return;
      }
      this.getConfig(type);
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
    // 开启/关闭HTTP/2设置
    handleChangeHttp2() {
      const tempForm = { http2: this.http2Form.http2 };
      const newForm = {
        ...getParameter(tempForm, "https_option", this.domain)
      };
      this.$store.dispatch("cdn/saveConfig", newForm).then((res) => {
        this.$message.success(`设置成功`);
        this.getConfig(3);
      });
    },
    handleChangeTls() {
      const tempForm = { ...this.tlsForm };
      const newForm = {
        ...getParameter(tempForm, "https_tls_version", this.domain)
      };
      this.$store.dispatch("cdn/saveConfig", newForm).then((res) => {
        this.$message.success(`设置成功`);
        this.getConfig(4);
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "@/components/Cdn/domain/manage/common.less";
</style>
