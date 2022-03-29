<template>
  <div class="cdn-createDomain-container">
    <div class="header">
      <DetailHeader title="创建域名" />
    </div>
    <div class="content">
      <!-- 表单 -->
      <a-form-model
        v-if="step === 1"
        ref="ruleForm"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <div class="public-title">基础信息</div>
        <a-form-model-item label="域名">
          <a-input
            v-model="form.domain"
            placeholder="请输入单个域名，例如：slayun.com"
            @blur="checkDamain"
            @pressEnter="checkDamain"
          />
          <div class="info-txt">支持添加泛域名，如"*.example.com"</div>
        </a-form-model-item>
        <a-form-model-item
          v-if="isShowCheck && form.domain"
          :wrapper-col="{ span: 10, offset: 3 }"
        >
          <div class="check-domain-box">
            <div class="title">
              首次添加该域名，需要在验证该域名的归属权后，才能添加该域名
            </div>
            <div class="inner-box">
              <a-timeline :pending="checkDomainStatus">
                <a-timeline-item color="green">
                  前往域名DNS服务商配置该TXT记录
                  <a-button
                    style="height: 21px"
                    type="link"
                    @click="handleCourse"
                  >
                    如何配置
                  </a-button>
                  <div class="row">
                    <div class="item">记录类型</div>
                    <div class="item">主机记录</div>
                    <div class="right">记录值</div>
                  </div>
                  <div class="row">
                    <div class="item">TXT</div>
                    <div class="item">verification</div>
                    <div class="right">
                      {{ verifyCode }}
                    </div>
                  </div>
                </a-timeline-item>
                <a-timeline-item class="btn-timeline" color="green">
                  <a-space>
                    已配置
                    <a-button
                      class="btn"
                      type="primary"
                      :loading="checkDomainStatus !== ''"
                      @click="handleCheckDomain"
                    >
                      验证
                    </a-button>
                  </a-space>
                </a-timeline-item>
                <a-timeline-item
                  v-if="!checkDomainStatus && verifyStatus === 'wait'"
                  color="blue"
                >
                  <span>待验证</span>
                </a-timeline-item>
                <a-timeline-item
                  v-if="!checkDomainStatus && verifyStatus === 'err'"
                  color="red"
                >
                  <span>验证失败</span>
                </a-timeline-item>
              </a-timeline>
            </div>
          </div>
        </a-form-model-item>
        <div class="line"></div>
        <div class="public-title">业务信息</div>
        <a-form-model-item label="业务类型">
          <a-select v-model="form.cdnType">
            <a-select-option
              v-for="(val, key) in businessTypeEnum"
              :key="key"
              :value="key"
            >
              {{ val }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="加速区域">
          <a-radio-group v-model="form.scope">
            <a-radio
              v-for="(val, key) in scopeAreaEnum"
              :key="key"
              :value="key"
            >
              {{ val }}
            </a-radio>
          </a-radio-group>
          <div class="info-txt">
            1、不同加速区域价格有差别，请按您的实际需求选择 。
            <a-button type="link" @click="handleJumpCloud"> 价格详情 </a-button>
          </div>
          <div class="info-txt">
            2、切换加速区域后，短期内回源的流量会增加，命中率会下降，请您关注源站运行情况。
          </div>
        </a-form-model-item>
        <div class="line"></div>
        <div class="public-title">源站信息</div>
        <div class="info-txt" style="margin: 20px 0">
          源站类型支持OSS域名、IP、源站域名，源站总数量最大不超过20个，并支持在多源站场景下设置源站的主备优先级和负载均衡权重。
        </div>
        <a-form-model-item label="源站信息">
          <a-button type="primary" @click="handleAddSource">
            新增源站信息
          </a-button>
          <a-table
            style="margin-top: 20px"
            :columns="columns"
            :data-source="form.sourceInfo.sourceModel"
            :pagination="false"
            rowKey="id"
          >
            <div slot="type" slot-scope="text">
              {{ cdnTypeEnum[text] }}
            </div>
            <div slot="priority" slot-scope="text">
              {{ cdnPriorityEnum[text] }}
            </div>
            <div slot="action" slot-scope="text, record">
              <a-space>
                <a-button type="link" @click="handleEditSource(record)">
                  编辑
                </a-button>
                <a-button type="link" @click="handleDelSource(record)">
                  删除
                </a-button>
              </a-space>
            </div>
          </a-table>
        </a-form-model-item>
        <!-- <div class="line"></div>
        <div class="public-title">IPv6开关</div>
        <a-form-model-item label="状态">
          <a-switch v-model="form.status">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
          <div class="info-txt">
            开启后，IPv6的客户端请求将支持以ipv6协议访问CDN，CDN也将携带ipv6的客户端IP信息访问您的源站。
          </div>
        </a-form-model-item> -->
        <a-form-model-item :wrapper-col="{ span: 6, offset: 3 }">
          <a-space>
            <a-button
              type="primary"
              :disabled="!form.domain"
              :loading="loading"
              @click="handleNext"
            >
              下一步
            </a-button>
            <a-button @click="handleCancel"> 取消 </a-button>
          </a-space>
        </a-form-model-item>
      </a-form-model>
      <!-- 成功回显 -->
      <a-result
        v-else
        status="success"
        title="域名审核中！您可以前往域名管理查询审核状态，审核将在 1 个工作日左右完成，感谢您的理解和等待"
      >
        <div slot="subTitle">
          如需使用CDN加速服务，请在域名审核通过后配置CNAME。
          <a-button type="link" @click="handleNext"> 如何配置CNAME </a-button>
        </div>
        <template #extra>
          <a-button type="primary" @click="handleBackDomain">
            返回域名管理
          </a-button>
        </template>
      </a-result>
    </div>
    <!-- 新增源站信息弹窗 -->
    <UpdateSourceStationModal
      v-model="visible"
      :detail="modalDetail"
      @success="modalSuccess"
    />
    <!-- 如何设置解析弹窗 -->
    <CourseModal v-model="courseVisible" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import DetailHeader from "@/components/Common/detailHeader";
import UpdateSourceStationModal from "@/components/Cdn/domain/updateSourceStationModal";
import CourseModal from "@/components/Cdn/domain/courseModal.vue";
import { jumpCloudMall } from "@/utils/index";
import {
  cdnTypeEnum,
  cdnPriorityEnum,
  businessTypeEnum,
  scopeAreaEnum
} from "@/utils/enum";
export default {
  components: { DetailHeader, UpdateSourceStationModal, CourseModal },
  data() {
    return {
      cdnTypeEnum,
      cdnPriorityEnum,
      businessTypeEnum,
      scopeAreaEnum,
      labelCol: { span: 3 },
      wrapperCol: { span: 10 },
      loading: false,
      form: {
        domain: "",
        cdnType: "web",
        scope: "domestic",
        sourceInfo: {
          sourceModel: []
        }
        // status: true
      },
      columns: [
        {
          title: "源站类型",
          dataIndex: "type",
          scopedSlots: { customRender: "type" }
        },
        {
          title: "域名",
          dataIndex: "content"
        },
        {
          title: "优先级",
          dataIndex: "priority",
          scopedSlots: { customRender: "priority" }
        },
        {
          title: "权重",
          dataIndex: "weight"
        },
        {
          title: "端口",
          dataIndex: "port"
        },
        {
          title: "操作",
          dataIndex: "action",
          fixed: "right",
          scopedSlots: { customRender: "action" }
        }
      ],
      visible: false,
      modalDetail: {},
      isShowCheck: false,
      verifyCode: "",
      checkDomainStatus: "",
      verifyStatus: "wait",
      // 如何设置解析弹窗
      courseVisible: false,
      step: 1
    };
  },
  computed: {
    ...mapGetters(["productCode"])
  },
  created() {},
  methods: {
    // 域名输入框失焦或回车
    checkDamain() {
      if (!this.form.domain) return;
      this.$store
        .dispatch("cdn/checkDomainAscription", {
          domain: this.form.domain,
          productCode: this.productCode
        })
        .then((res) => {
          // 如果校验不通过的话
          if (res.data !== "success") {
            this.isShowCheck = true;
            this.verifyCode = res.data;
          } else {
            this.isShowCheck = false;
            this.verifyCode = "";
            this.$message.success("域名归属权校验成功");
          }
        });
    },
    // 域名校验归属权验证按钮
    handleCheckDomain() {
      if (!this.form.domain) {
        this.$message.warning("请输入域名");
      }
      this.checkDomainStatus = "验证中";
      this.$store
        .dispatch("cdn/checkDomainAscription", {
          domain: this.form.domain,
          productCode: this.productCode
        })
        .then((res) => {
          // 如果校验不通过的话
          if (res.data !== "success") {
            this.verifyCode = res.data;
            this.$message.warning("验证失败");
            // this.verifyStatus = "err";
          } else {
            this.verifyCode = "";
            this.verifyStatus = "wait";
            this.$message.success("域名归属权校验成功");
          }
        })
        .finally(() => {
          this.checkDomainStatus = "";
          this.isShowCheck = false;
        });
    },
    // 跳转云商城价格详情
    handleJumpCloud() {
      jumpCloudMall("/cloud-price", true);
    },
    // 弹窗成功回调
    modalSuccess(type, val) {
      this.modalDetail = {};
      if (type === "add") {
        this.form.sourceInfo.sourceModel.push({
          id: this.getId(),
          ...val
        });
        return;
      }
      const index = this.form.sourceInfo.sourceModel.findIndex(
        (ele) => ele.id === val.id
      );
      this.form.sourceInfo.sourceModel.splice(index, 1, { ...val });
    },
    // 生成id
    getId() {
      const newId =
        this.form.sourceInfo.sourceModel.length === 0
          ? -1
          : this.form.sourceInfo.sourceModel[
              this.form.sourceInfo.sourceModel.length - 1
            ].id - 1;
      return newId;
    },
    // 新增源站信息
    handleAddSource() {
      this.visible = true;
    },
    // 编辑源站信息
    handleEditSource(record) {
      this.modalDetail = { ...record };
      this.visible = true;
    },
    // 删除源站信息
    handleDelSource(record) {
      this.$confirm({
        title: "确定要删除吗?",
        onOk: () => {
          const index = this.form.sourceInfo.sourceModel.findIndex(
            (ele) => ele.id === record.id
          );
          this.form.sourceInfo.sourceModel.splice(index, 1);
          this.$message.success("删除成功");
        }
      });
    },
    // 提交下一步
    handleNext() {
      if (this.form.sourceInfo.sourceModel.length === 0) {
        this.$message.warning("请至少添加一条源站信息");
        return;
      }
      this.loading = true;
      this.$store
        .dispatch("cdn/checkDomainAscription", {
          domain: this.form.domain,
          productCode: this.productCode
        })
        .then((res) => {
          // 如果校验不通过的话
          if (res.data !== "success") {
            this.isShowCheck = true;
            this.verifyCode = res.data;
          } else {
            this.$store
              .dispatch("cdn/createDomain", this.form)
              .then((res) => {
                this.step = 2;
              })
              .finally(() => {
                this.loading = false;
              });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 取消
    handleCancel() {
      this.$router.back();
    },
    // 如何设置域名
    handleCourse() {
      this.courseVisible = true;
    },
    // 返回域名管理
    handleBackDomain() {
      this.$router.push("/control/cdn/domain");
    }
  }
};
</script>

<style lang="less" scoped>
.cdn-createDomain-container {
  .header {
    display: flex;
    font-weight: 500;
    font-size: 22px;
    color: #272829;
  }
  .content {
    padding: 24px 0;
    .public-title {
      font-size: 16px;
      font-weight: 600;
    }
    .line {
      width: 100%;
      height: 1px;
      background: #ccc;
      margin-bottom: 20px;
    }
    .info-txt {
      color: #aaa;
      line-height: 22px;
    }
    .check-domain-box {
      min-width: 520px;
      background: #f0f2f5;
      .title {
        background: #d7d7d7;
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        margin-bottom: 20px;
      }
      .inner-box {
        padding: 0 20px;
        .ant-space-align-center {
          align-items: flex-start;
        }
        .row {
          display: flex;
          align-items: center;
          height: 40px;
          border-bottom: 1px solid #ccc;
          .item {
            width: 20%;
          }
          .right {
            flex: 1;
          }
        }
        .btn-timeline {
          .btn {
            margin-top: -10px;
          }
        }
      }
    }
  }
}
</style>
