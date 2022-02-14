<template>
  <div class="work-comment-container">
    <!-- 头部标题 -->
    <DetailHeader title="工单服务评价" />
    <!-- 表单 -->
    <a-form-model
      class="form-wrap"
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="工单编号"> </a-form-model-item>
      <a-form-model-item label="问题标题"> </a-form-model-item>
      <a-form-model-item label="服务评分" prop="rateValue">
        <a-rate v-model="form.rateValue" />
        <span v-if="form.rateValue" class="rate-txt">
          {{ form.rateValue }}
          <span>[</span>
          {{ rateTxt }}
          <span>]</span>
        </span>
      </a-form-model-item>
      <a-form-model-item label="您的评价" prop="description">
        <a-input
          v-model="form.description"
          type="textarea"
          allowClear
          :maxLength="2000"
          placeholder="请填写您的评价"
        />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
        <a-button
          type="primary"
          :loading="loading"
          @click="handleSubmitComment"
        >
          提交评价
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <!-- 温馨提示 -->
    <div class="tips-wrap">
      <div class="title">温馨提示：</div>
      <div class="txt">
        请对客服的服务做出客观的评价，以便我们不断的优化提升服务质量，感谢您的支持！
      </div>
      <div class="txt">
        评价后工单会转为完成状态，届时如果您还有其他问题，请
        <a-button class="btn-link" type="link" @click="handleJumpAddWorkOrder">
          提交新工单
        </a-button>
        。
      </div>
    </div>
  </div>
</template>

<script>
import DetailHeader from "@/components/Common/detailHeader";
export default {
  components: {
    DetailHeader
  },
  computed: {
    rateTxt() {
      const value = this.form.rateValue;
      if (value === 1) {
        return "非常不满意";
      }
      if (value === 2) {
        return "不满意";
      }
      if (value === 3) {
        return "一般";
      }
      if (value === 4) {
        return "满意";
      }
      if (value === 5) {
        return "非常满意";
      }
      return "";
    }
  },
  data() {
    const validateRate = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error("请选择评分"));
      }
      callback();
    };
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
      other: "",
      form: {
        rateValue: 0,
        description: "",
        img: ""
      },
      rules: {
        rateValue: [
          {
            required: true,
            message: "请选择评分",
            trigger: "change"
          },
          {
            validator: validateRate,
            trigger: "change"
          }
        ],
        description: [
          {
            required: true,
            message: "请填写您的评价",
            trigger: ["change", "blur"]
          }
        ]
      },
      loading: false
    };
  },
  methods: {
    // 提交评价
    handleSubmitComment() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("workorder/commentWorkOrder", {
              queryType: 1,
              wordOrderNo: this.$route.query.wordOrderNo
            })
            .then((res) => {})
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    // 跳转提交新工单
    handleJumpAddWorkOrder() {
      this.$router.push("/user/workOrder/submit");
    }
  }
};
</script>

<style lang="less" scoped>
.work-comment-container {
  padding-bottom: 50px;
  .form-wrap {
    margin-top: 50px;
  }
  .rate-txt {
    font-weight: bold;
    color: #ff6600;
    margin-left: 10px;
  }
  .tips-wrap {
    .title {
      position: relative;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      padding-left: 10px;
      margin-bottom: 10px;
      font-weight: bold;
      color: #ff6600;
      font-size: 14px;
      &::after {
        position: absolute;
        bottom: -1px;
        left: 0;
        content: "";
        width: 80px;
        height: 2px;
        background: #ff6600;
      }
    }
    .txt {
      line-height: 1.8em;
      font-size: 12px;
      color: #636566;
    }
    .btn-link {
      padding: 0;
      font-size: 12px;
    }
  }
}
</style>
