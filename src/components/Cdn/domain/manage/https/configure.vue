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
          已关闭
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
          <a-switch @change="handleChangeStatus">
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
          默认
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
          <a-switch @change="handleChangeStatus">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
        </div>
      </div>
      <div class="content-row">
        <div class="label">TLSv1.1</div>
        <div class="value">
          <a-switch @change="handleChangeStatus">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
        </div>
      </div>
      <div class="content-row">
        <div class="label">TLSv1.2</div>
        <div class="value">
          <a-switch @change="handleChangeStatus">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
        </div>
      </div>
      <div class="content-row">
        <div class="label">TLSv1.3</div>
        <div class="value">
          <a-switch @change="handleChangeStatus">
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
          关闭
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
          this.getBatchConfig();
        }
      }
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
          title: "回源SNI",
          functionName: "https_origin_sni",
          form: { enabled: true, https_origin_sni: "" }
        },
        4: {
          title: "回源请求超时时间",
          functionName: "forward_timeout",
          form: { forward_timeout: 30 }
        }
      },
      httpForm: {
        enable: false
      },
      httpsForm: {
        enable: false
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
              this.httpsForm = {
                ...getForm(data[0], newForm)
              };
              this.hostForm.type =
                this.hostForm.domain_name === this.domain ? 1 : 3;
              this.hostForm.enable = true;
            }
            if (type === 2) {
              this.agreementForm = {
                ...getForm(data[0], newForm)
              };
            }
            if (type === 3) {
              this.sniForm = {
                ...getForm(data[0], newForm)
              };
            }
            if (type === 4) {
              this.timeoutForm = {
                ...getForm(data[0], newForm)
              };
            }
          } else {
            // if (type === 1) {
            //   this.hostForm.enable = false;
            //   this.hostForm.domain_name = this.domain;
            // }
          }
        });
    },
    // 弹窗成功回调
    modalSuccess(type) {
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
