<template>
  <div class="work-add-container">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="问题类别" prop="questionCategoryCode">
        <a-select v-model="form.questionCategoryCode">
          <a-select-option
            v-for="item in questionCategoryList"
            :key="item.code"
            :value="item.code"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        v-if="getIsCloudQuestion"
        label=" 产品类别类型"
        prop="type"
      >
        <a-radio-group v-model="form.type">
          <div class="inline">
            <a-radio
              v-for="(obj, index) in typeForm"
              :key="index"
              :value="obj.value"
            >
              {{ obj.title }}
            </a-radio>
          </div>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item
        class="form-label-before"
        v-if="getIsCloudQuestion"
        :label="labelName"
        prop="ip"
      >
        <a-select v-model="form.extParam.ip" placeholder="请选择" allowClear>
          <a-select-option
            v-for="item in cloudList"
            :key="item.id"
            :value="item.outIp"
          >
            {{ item.outIp }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="问题标题" prop="title">
        <a-input v-model="form.title" placeholder="请填写问题标题" />
      </a-form-model-item>
      <a-form-model-item label="问题描述" prop="description">
        <a-input
          v-model="form.description"
          type="textarea"
          :maxLength="2000"
          placeholder="请描述您的问题"
        />
      </a-form-model-item>
      <a-form-model-item label="服务器端口">
        <a-input v-model="form.extParam.port" />
      </a-form-model-item>
      <a-form-model-item label="服务器账号">
        <a-input v-model="form.extParam.username" />
      </a-form-model-item>
      <a-form-model-item label="服务器密码">
        <a-input v-model="form.extParam.password" />
      </a-form-model-item>
      <a-form-model-item label="提单人">
        {{ userRealInfo.corporationCode }}
      </a-form-model-item>
      <a-form-model-item
        class="inline-wrap"
        label="手机号码"
        prop="phoneNumber"
      >
        <a-input
          class="input"
          v-number-evolution
          v-model="form.phoneNumber"
          :max-length="11"
          placeholder="请填您的手机号码"
        />
        <a-button type="primary" @click="addPhone"> 默认手机号码 </a-button>
      </a-form-model-item>
      <a-form-model-item class="inline-wrap" label="QQ号码" prop="qqNumber">
        <a-input
          class="input"
          v-number-evolution
          v-model="form.qqNumber"
          :max-length="20"
          placeholder="请填您的QQ号"
        />
        <a-button type="primary" @click="addQQ"> 默认QQ号码 </a-button>
      </a-form-model-item>
      <a-form-model-item label="附件上传">
        <Upload
          :defaultFile="form.url"
          :limit="9"
          replaceUrl="formService"
          @change="imgChange"
        />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 10, offset: 4 }">
        <a-button type="primary" :loading="loading" @click="onSubmit">
          确认工单信息，提交
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Upload from "@/components/Upload/index.vue";
export default {
  props: {
    questionCategoryCode: { type: [Number, String], default: 0 },
    activeKey: { type: Number, default: 0 },
    questionCategoryList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Upload
  },
  data() {
    const validateIp = (rule, value, callback) => {
      if (!this.form.extParam.ip) {
        callback(new Error("请选择服务器ip"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (!this.phoneReg.test(value)) {
        callback(new Error("手机号格式不正确"));
      }
      callback();
    };
    return {
      phoneReg:
        /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/,
      labelCol: { span: 4 },
      wrapperCol: { span: 10 },
      typeForm: [{ value: "1", title: "云服务器" }],
      serverForm: {
        1: "服务器IP"
      },
      labelName: "服务器IP",
      form: {
        questionCategoryCode: this.questionCategoryCode,
        extParam: {
          ip: undefined,
          password: "",
          port: "",
          username: ""
        },
        title: "",
        type: "1",
        description: "",
        submitCode: "",
        phoneNumber: "",
        qqNumber: "",
        url: []
      },
      rules: {
        questionCategoryCode: [
          {
            required: true,
            message: "请选择问题类别",
            trigger: "change"
          }
        ],
        ip: [
          {
            validator: validateIp,
            trigger: ["change", "blur"]
          }
        ],
        title: [
          {
            required: true,
            message: "请输入问题标题",
            trigger: ["change", "blur"]
          }
        ],
        type: [
          {
            required: true,
            message: "请选择产品类别类型",
            trigger: "change"
          }
        ],
        description: [
          {
            required: true,
            message: "请输入问题描述",
            trigger: ["change", "blur"]
          }
        ],
        phoneNumber: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: ["change", "blur"]
          },
          { validator: validatePhone, trigger: ["change", "blur"] }
        ],
        qqNumber: [
          {
            required: true,
            message: "请输入QQ号码",
            trigger: ["change", "blur"]
          }
        ]
      },
      loading: false,
      cloudList: []
    };
  },
  computed: {
    ...mapState({
      userRealInfo: (state) => state.user.userRealInfo
    }),
    // 判读是否是服务器类问题
    getIsCloudQuestion() {
      const newObj = this.questionCategoryList.find(
        (ele) => ele.code === this.form.questionCategoryCode
      );
      return newObj && newObj.name.indexOf("服务器") !== -1;
    }
  },
  watch: {
    activeKey: {
      handler(newVal) {
        if (newVal === 4) {
          this.resetForm();
        }
      },
      immediate: true
    },
    "form.type": {
      handler(newVal) {
        this.labelName = this.serverForm[newVal];
      },
      immediate: true,
      deep: true
    },
    getIsCloudQuestion: {
      handler(newVal) {
        if (newVal) {
          this.getList();
        }
      },
      immediate: true
    }
  },
  methods: {
    // 获取用户拥有的服务器列表
    getList() {
      this.$store
        .dispatch("cloud/cloudList", {
          createTimeSort: "desc",
          currentPage: 1,
          pageSize: 999
        })
        .then((res) => {
          this.cloudList = [...res.data.list];
        });
    },
    // 提交
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const data = {
            ...this.form,
            submitCode: this.userRealInfo.corporationCode,
            submitName: this.userRealInfo.corporationName,
            url: this.form.url.toString()
          };
          this.$store
            .dispatch("workorder/submitWorkOrder", data)
            .then((res) => {
              this.$message.success("提交工单成功");
              this.$emit("success");
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    // 图片上传
    imgChange({ urlList, firstImageUrl }) {
      this.form.url = [...urlList];
    },
    // 默认手机号
    addPhone() {
      this.form.phoneNumber = this.userRealInfo.phoneNumber;
      this.$refs.ruleForm.validateField("phoneNumber");
    },
    // 默认QQ号
    addQQ() {
      this.form.qqNumber = this.userRealInfo.qq;
      this.$refs.ruleForm.validateField("qqNumber");
    },
    // 重置表单
    resetForm() {
      this.form = {
        questionCategoryCode: this.questionCategoryCode,
        extParam: { ip: undefined, password: "", port: "", username: "" },
        title: "",
        type: "1",
        description: "",
        submitCode: "",
        phoneNumber: "",
        qqNumber: "",
        url: ""
      };
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.work-add-container {
  padding-bottom: 50px;
  min-width: 820px;
  .inline {
    display: flex;
  }
  .inline-wrap {
    display: flex;
    .input {
      width: 210px;
      margin-right: 10px;
    }
  }
}
</style>
