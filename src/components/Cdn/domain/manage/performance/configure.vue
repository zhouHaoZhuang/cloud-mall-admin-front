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
          <a-switch @change="handleChangeStatus">
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
          <a-switch @change="handleChangeStatus">
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
          <a-switch @change="handleChangeStatus">
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
          已关闭
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
          已关闭
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
      @success="modalSuccess"
    />
  </div>
</template>

<script>
import UpdateFilterModal from "@/components/Cdn/domain/manage/performance/UpdateFilterModal";
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
      }
    };
  },
  created() {},
  methods: {
    // 弹窗成功回调
    modalSuccess(type) {},
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
