<template>
  <div class="cdn-basic-container">
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">鉴权URL设置</div>
        <div class="value">
          <a-button type="link" @click="handleChangeConfig('urlVisible', 1)">
            修改配置
          </a-button>
        </div>
      </div>
      <div class="content-row">
        <div class="label">URL鉴权</div>
        <div class="value">
          {{ aliauthForm.enable ? "已设置" : "未设置" }}
          <div class="txt">
            高级防盗链功能设置鉴权KEY对URL进行加密保护源站资源。
          </div>
        </div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">生成鉴权URL</div>
        <div class="value"></div>
      </div>
      <div class="content-row">
        <div class="label">原始URL</div>
        <div class="value">
          <a-input
            v-model="form.type"
            style="width: 250px"
            placeholder="请输入完成的URL"
          />
        </div>
      </div>
      <div class="content-row">
        <div class="label">鉴权类型</div>
        <div class="value">
          <a-radio-group v-model="form.type">
            <a-radio :value="1"> A方式 </a-radio>
            <a-radio :value="2"> B方式 </a-radio>
            <a-radio :value="3"> C方式 </a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="content-row">
        <div class="label">鉴权KEY</div>
        <div class="value">
          <a-input
            v-model="form.type"
            style="width: 250px"
            placeholder="请输入鉴权KEY"
          />
        </div>
      </div>
      <div class="content-row">
        <div class="label">有效时间</div>
        <div class="value">
          <a-input
            v-model="form.type"
            style="width: 250px"
            placeholder="请输入有效时间"
          />
        </div>
      </div>
      <div class="content-row">
        <div class="label"></div>
        <div class="value">
          <a-button type="primary" style="padding: 5px 10px">开始生成</a-button>
        </div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">Refer防盗链</div>
        <div class="value">
          <a-button type="link" @click="handleChangeConfig('referVisible', 2)">
            修改配置
          </a-button>
        </div>
      </div>
      <div class="content-row">
        <div class="label">Refer防盗链类型</div>
        <div class="value">
          未设置
          <div class="txt">
            通过黑/白名单来对访问者身份进行识别和过滤，支持IPV6地址填写。
          </div>
        </div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">IP黑/白名单</div>
        <div class="value">
          <a-button type="link" @click="handleChangeConfig('ipVisible', 3)">
            修改配置
          </a-button>
        </div>
      </div>
      <div class="content-row">
        <div class="label">IP黑/白名单类型</div>
        <div class="value">未设置</div>
      </div>
    </div>
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">UA黑/白名单</div>
        <div class="value">
          <a-button type="link" @click="handleChangeConfig('uaVisible', 4)">
            修改配置
          </a-button>
        </div>
      </div>
      <div class="content-row">
        <div class="label">名单类型</div>
        <div class="value">未设置</div>
      </div>
    </div>
    <!-- 鉴权url弹窗 -->
    <UpdateUrlModal
      v-model="urlVisible"
      :type="modalType"
      :modalMap="modalMap"
      @success="modalSuccess"
    />
    <!-- Refer弹窗 -->
    <UpdateReferModal
      v-model="referVisible"
      :type="modalType"
      :modalMap="modalMap"
      @success="modalSuccess"
    />
    <!-- ip弹窗 -->
    <UpdateIpModal
      v-model="ipVisible"
      :type="modalType"
      :modalMap="modalMap"
      @success="modalSuccess"
    />
    <!-- ua弹窗 -->
    <UpdateUaModal
      v-model="uaVisible"
      :type="modalType"
      :modalMap="modalMap"
      @success="modalSuccess"
    />
  </div>
</template>

<script>
import UpdateUrlModal from "@/components/Cdn/domain/manage/accessControl/UpdateUrlModal";
import UpdateReferModal from "@/components/Cdn/domain/manage/accessControl/UpdateReferModal";
import UpdateIpModal from "@/components/Cdn/domain/manage/accessControl/UpdateIpModal";
import UpdateUaModal from "@/components/Cdn/domain/manage/accessControl/UpdateUaModal";
import { getParameter, getForm } from "@/utils/index";
export default {
  props: {
    tabsKey: {
      type: Number,
      default: 1
    }
  },
  components: {
    UpdateUrlModal,
    UpdateReferModal,
    UpdateIpModal,
    UpdateUaModal
  },
  watch: {
    tabsKey: {
      handler(newVal) {
        if (newVal === 5) {
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
      form: {
        type: 1
      },
      urlVisible: false,
      referVisible: false,
      ipVisible: false,
      uaVisible: false,
      modalType: 1,
      modalMap: {
        1: {
          title: "鉴权URL设置",
          functionName: "aliauth",
          form: {
            auth_type: "type_a",
            auth_key1: "",
            auth_key2: "",
            ali_auth_delta: 1800
          }
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
      aliauthForm: {
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
              this.aliauthForm = {
                enable:
                  getForm(data[0], newForm).auth_type === "no_auth"
                    ? false
                    : true
              };
            }
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
      this.getConfig(type);
    },
    // 修改配置
    handleChangeConfig(type, modalType) {
      this[type] = true;
      this.modalType = modalType;
    },
    // 生成鉴权url
    handleCreateUrl() {
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
