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
          />
          <div class="info-txt">支持添加泛域名，如"*.example.com"</div>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 10, offset: 3 }">
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
                      verify_ec54b30ed591b4a1f8ee9a52696abec8
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
                <a-timeline-item v-if="!checkDomainStatus" color="red">
                  <span>待验证</span>
                  <!-- <span>验证中</span>
                  <span>验证失败</span> -->
                </a-timeline-item>
              </a-timeline>
            </div>
          </div>
        </a-form-model-item>
        <div class="line"></div>
        <div class="public-title">业务信息</div>
        <a-form-model-item label="业务类型">
          <a-select v-model="form.type">
            <a-select-option :value="1"> 图片小文件 </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="加速区域">
          <a-radio-group v-model="form.address">
            <a-radio :value="1"> 仅中国内地 </a-radio>
            <a-radio :value="2"> 全球 </a-radio>
            <a-radio :value="2"> 全球（不含中国内地） </a-radio>
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
            :data-source="form.data"
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
        <div class="line"></div>
        <div class="public-title">IPv6开关</div>
        <a-form-model-item label="状态">
          <a-switch v-model="form.status">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
          <div class="info-txt">
            开启后，IPv6的客户端请求将支持以ipv6协议访问CDN，CDN也将携带ipv6的客户端IP信息访问您的源站。
          </div>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 6, offset: 3 }">
          <a-space>
            <a-button type="primary" :loading="loading" @click="handleNext">
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
import DetailHeader from "@/components/Common/detailHeader";
import UpdateSourceStationModal from "@/components/Cdn/domain/updateSourceStationModal";
import CourseModal from "@/components/Cdn/domain/courseModal.vue";
import { jumpCloudMall } from "@/utils/index";
import { cdnTypeEnum, cdnPriorityEnum } from "@/utils/enum";
export default {
  components: { DetailHeader, UpdateSourceStationModal, CourseModal },
  computed: {},
  data() {
    return {
      cdnTypeEnum,
      cdnPriorityEnum,
      labelCol: { span: 3 },
      wrapperCol: { span: 10 },
      loading: false,
      form: {
        domain: "",
        type: 1,
        address: 1,
        data: [],
        status: true
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
      checkDomainStatus: "",
      // 如何设置解析弹窗
      courseVisible: false,
      step: 1
    };
  },
  created() {},
  methods: {
    // 跳转云商城价格详情
    handleJumpCloud() {
      jumpCloudMall("/cloud-price", true);
    },
    // 弹窗成功回调
    modalSuccess(type, val) {
      this.modalDetail = {};
      if (type === "add") {
        this.form.data.push({
          id: this.getId(),
          ...val
        });
        return;
      }
      const index = this.form.data.findIndex((ele) => ele.id === val.id);
      this.form.data.splice(index, 1, { ...val });
    },
    // 生成id
    getId() {
      const newId =
        this.form.data.length === 0
          ? -1
          : this.form.data[this.form.data.length - 1].id - 1;
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
          const index = this.form.data.findIndex((ele) => ele.id === record.id);
          this.form.data.splice(index, 1);
          this.$message.success("删除成功");
        }
      });
    },
    // 提交下一步
    handleNext() {
      this.step = 2;
      // this.loading = true;
      // this.$store
      //   .dispatch("domain/add", this.form)
      //   .then((res) => {})
      //   .finally(() => {
      //     this.loading = false;
      //   });
    },
    // 取消
    handleCancel() {
      this.$router.back();
    },
    // 如何设置域名
    handleCourse() {
      this.courseVisible = true;
    },
    // 验证域名
    handleCheckDomain() {
      this.checkDomainStatus = "验证中";
      setTimeout(() => {
        this.checkDomainStatus = "";
      }, 2000);
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
