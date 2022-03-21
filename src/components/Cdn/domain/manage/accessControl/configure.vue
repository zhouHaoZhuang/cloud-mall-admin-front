<template>
  <div class="cdn-basic-container">
    <div class="public-manage-box">
      <div class="head-box">
        <div class="label">鉴权URL设置</div>
        <div class="value">
          <a-button type="link" @click="handleChangeConfig('urlVisible')">
            修改配置
          </a-button>
        </div>
      </div>
      <div class="content-row">
        <div class="label">URL鉴权</div>
        <div class="value">
          未设置
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
          <a-button type="link" @click="handleChangeConfig('referVisible')">
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
          <a-button type="link" @click="handleChangeConfig('ipVisible')">
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
          <a-button type="link" @click="handleChangeConfig('uaVisible')">
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
      :detail="modalDetail"
      @success="modalSuccess"
    />
    <!-- Refer弹窗 -->
    <UpdateReferModal
      v-model="referVisible"
      :detail="modalDetail"
      @success="modalSuccess"
    />
    <!-- ip弹窗 -->
    <UpdateIpModal
      v-model="ipVisible"
      :detail="modalDetail"
      @success="modalSuccess"
    />
    <!-- ua弹窗 -->
    <UpdateUaModal
      v-model="uaVisible"
      :detail="modalDetail"
      @success="modalSuccess"
    />
  </div>
</template>

<script>
import UpdateUrlModal from "@/components/Cdn/domain/manage/accessControl/UpdateUrlModal";
import UpdateReferModal from "@/components/Cdn/domain/manage/accessControl/UpdateReferModal";
import UpdateIpModal from "@/components/Cdn/domain/manage/accessControl/UpdateIpModal";
import UpdateUaModal from "@/components/Cdn/domain/manage/accessControl/UpdateUaModal";
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
  components: {
    UpdateUrlModal,
    UpdateReferModal,
    UpdateIpModal,
    UpdateUaModal
  },
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
      form: {
        type: 1
      },
      urlVisible: false,
      referVisible: false,
      ipVisible: false,
      uaVisible: false,
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
      this[type] = true;
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
