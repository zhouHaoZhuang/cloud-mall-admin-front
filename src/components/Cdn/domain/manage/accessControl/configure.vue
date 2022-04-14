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
    <div v-if="false" class="public-manage-box">
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
          {{ referForm.typeName }}
          <div class="txt">
            通过黑/白名单来对访问者身份进行识别和过滤，支持IPV6地址填写。
          </div>
        </div>
      </div>
      <div class="content-row">
        <div class="label">黑名单/白名单</div>
        <div class="value">
          <span v-for="item in referForm.list"> {{ item }}<br /> </span>
        </div>
      </div>
      <div class="content-row">
        <div class="label"></div>
        <div class="value">
          <a-button
            :disabled="referForm.list.length === 0"
            type="link"
            @click="delRefer(referForm.configId)"
          >
            删除设置
          </a-button>
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
        <div class="value">
          {{ ipForm.typeName }}
          <div class="txt">
            通过黑/白名单来对用户的身份进行识别和过滤，支持IPv4和IPv6地址。
          </div>
        </div>
      </div>
      <div class="content-row">
        <div class="label">IP黑/白名单</div>
        <div class="value">
          <span v-for="item in ipForm.list"> {{ item }}<br /> </span>
        </div>
      </div>
      <div class="content-row">
        <div class="label"></div>
        <div class="value">
          <a-button
            :disabled="ipForm.list.length === 0"
            type="link"
            @click="delRefer(ipForm.configId)"
          >
            删除设置
          </a-button>
        </div>
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
        <div class="value">
          <span v-if="!uaForm.type">未设置</span>
          <span v-if="uaForm.type === 'black'">黑名单</span>
          <span v-if="uaForm.type === 'white'">白名单</span>
          <div class="txt">
            通过UserAgent字段设置黑/白名单对访问者进行访问控制。
          </div>
        </div>
      </div>
      <div class="content-row">
        <div class="label">IP黑/白名单</div>
        <div class="value">
          <span v-for="item in uaForm.list"> {{ item }}<br /> </span>
        </div>
      </div>
      <div class="content-row">
        <div class="label"></div>
        <div class="value">
          <a-button
            :disabled="uaForm.list.length === 0"
            type="link"
            @click="delRefer(uaForm.configId)"
          >
            删除设置
          </a-button>
        </div>
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
      @success="modalSuccess"
    />
    <!-- ip弹窗 -->
    <UpdateIpModal
      v-model="ipVisible"
      :type="modalType"
      @success="modalSuccess"
    />
    <!-- ua弹窗 -->
    <UpdateUaModal
      v-model="uaVisible"
      :type="modalType"
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
          title: "Refer防盗链",
          functionName: "referer_black_list_set,referer_white_list_set"
        },
        3: {
          title: "IP黑/白名单",
          functionName: "ip_black_list_set,ip_allow_list_set"
        },
        4: {
          title: "UA黑/白名单",
          functionName: "ali_ua"
        }
      },
      aliauthForm: {
        enable: false
      },
      referForm: {
        typeName: "未设置",
        list: [],
        configId: ""
      },
      ipForm: {
        typeName: "未设置",
        list: [],
        configId: ""
      },
      uaForm: {
        ua: "",
        type: "",
        list: [],
        configId: ""
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
    // 删除设置
    delRefer(configId) {
      this.$confirm({
        title: `确定要删除该配置吗？`,
        centered: true,
        onOk: () => {
          this.$store
            .dispatch("cdn/delDomainConfig", {
              configId,
              domainName: this.domain
            })
            .then((res) => {
              this.$message.success("删除成功");
              this.getBatchConfig();
            });
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
            if (type === 1) {
              // 鉴权url
              console.log(data, "鉴权url");
              this.aliauthForm = {
                enable:
                  getForm(data[0], newForm).auth_type === "no_auth"
                    ? false
                    : true
              };
            }
            if (type === 2) {
              // 防盗链
              console.log(data, "防盗链");
              let list = data[0].functionArgs.functionArg
                .filter((item) => {
                  if (data[0].functionNameCn === "配置Referer白名单") {
                    return item.argName === "refer_domain_allow_list";
                  }
                  return item.argName === "refer_domain_deny_list";
                })[0]
                .argValue.split(",");
              this.referForm = {
                typeName:
                  data[0].functionName === "referer_black_list_set"
                    ? "黑名单"
                    : "白名单",
                configId: data[0].configId,
                list
              };
            }
            if (type === 3) {
              // ip 黑白名单
              console.log(data, "ip 黑白名单");
              let list = data[0].functionArgs.functionArg
                .filter((item) => {
                  return item.argName === "ip_list";
                })[0]
                .argValue.split(",");
              this.ipForm = {
                typeName:
                  data[0].functionName === "ip_black_list_set"
                    ? "黑名单"
                    : "白名单",
                configId: data[0].configId,
                list
              };
            }
            if (type === 4) {
              // ua
              console.log(data, "ua");
              let list = data[0].functionArgs.functionArg
                .filter((item) => {
                  return item.argName === "ua";
                })[0]
                .argValue.split(",");
              this.uaForm = {
                ...getForm(data[0], newForm),
                configId: data[0].configId,
                list
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
