<template>
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
          v-for="(obj, index) in question"
          :key="index"
          :value="obj.value"
        >
          {{ obj.title }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item
      v-if="form.questionCategoryCode === '1'"
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
      v-if="form.questionCategoryCode === '1'"
      :label="serverIp"
    >
      {{ form.extParam.ip }}
    </a-form-model-item>
    <a-form-model-item label="问题标题" prop="title">
      <a-input v-model="form.title" />
    </a-form-model-item>
    <a-form-model-item label="问题描述" prop="description">
      <a-input v-model="form.description" type="textarea" />
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
      :wrapper-col="{ span: 8 }"
      label="手机号码"
      prop="phoneNumber"
    >
      <div class="inline">
        <a-input
          :style="{ marginRight: '10px' }"
          v-model="form.phoneNumber"
          placeholder="请填您的手机号码"
        />
        <a-button type="primary" @click="addPhone()"> 默认手机号码 </a-button>
      </div>
    </a-form-model-item>
    <a-form-model-item
      :wrapper-col="{ span: 8 }"
      label="QQ号码"
      prop="qqNumber"
    >
      <div class="inline">
        <a-input
          :style="{ marginRight: '10px' }"
          v-model="form.qqNumber"
          placeholder="请填您的QQ号"
        />
        <a-button type="primary" @click="addQQ()"> 默认QQ号码 </a-button>
      </div>
    </a-form-model-item>
    <a-form-model-item label="附件上传">
      <Upload :defaultFile="form.url" @change="imgChange" />
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit"> 确认工单信息，提交 </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import Upload from "@/components/Upload/index.vue";
import { mapState } from "vuex";
export default {
  props: {
    classId: { type: Number, default: 0 },
    choose: { type: Number, default: 0 }
  },
  components: {
    Upload
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 8 },
      question: [
        { value: "1", title: "服务器类问题" },
        { value: "2", title: "财务类问题" },
        { value: "3", title: "合同类问题" },
        { value: "4", title: "会员账号问题" },
        { value: "5", title: "售前类问题" },
        { value: "6", title: "备案类问题" },
        { value: "7", title: "商标类问题" }
      ],
      typeForm: [
        { value: "1", title: "云服务器" },
        { value: "2", title: "服务器托管" },
        { value: "3", title: "虚拟主机" },
        { value: "4", title: "负载均衡" },
        { value: "5", title: "裸金属服务器" },
        { value: "6", title: "云数据库" }
      ],
      serverForm: {
        1: "服务器IP",
        2: "托管服务器IP",
        3: "虚拟主机IP",
        4: "负载均衡实例IP",
        5: "裸金属服务器IP",
        6: "云数据库IP"
      },
      serverIp: "服务器IP",
      form: {
        questionCategoryCode: this.classId,
        extParam: {
          ip: "无",
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
        url: ""
      },
      rules: {
        questionCategoryCode: [
          {
            required: true,
            message: "该项不能为空",
            trigger: "change"
          }
        ],
        title: [
          {
            required: true,
            message: "该项不能为空",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "该项不能为空",
            trigger: "change"
          }
        ],
        description: [
          {
            required: true,
            message: "该项不能为空",
            trigger: "blur"
          }
        ],
        phoneNumber: [
          {
            required: true,
            message: "该项不能为空",
            trigger: "blur"
          }
        ],
        qqNumber: [
          {
            required: true,
            message: "该项不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      userRealInfo: (state) => state.user.userRealInfo
    })
  },
  watch: {
    choose: {
      handler(newVal) {
        if (newVal === "4") {
          this.resetForm();
        }
      },
      immediate: true
    },
    "form.type": {
      handler(newVal) {
        this.serverIp = this.serverForm[newVal];
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.form, "222222");
          this.$store.dispatch("user/submitForm", this.form).then((res) => {
            console.log(res.data);
          });
        }
      });
    },
    // getUser() {
    //   this.$store.dispatch("user/getUserActualName").then((res) => {
    //     if (!res.data) {
    //       return;
    //     }
    //     console.log(res.data, "1111111111111");
    //     this.form.adminCode = res.data.corporationCode;
    //     this.phoneNum = res.data.phoneNumber;
    //   });
    // },
    // 图片上传
    imgChange({ urlList, firstImageUrl }) {
      // console.log("上传图片回调", urlList, firstImageUrl);
      this.form.url = urlList.toString();
    },
    // 默认手机号
    addPhone() {
      this.form.phoneNumber = this.userRealInfo.phoneNumber;
    },
    // 默认QQ号
    addQQ() {
      console.log(this.userRealInfo, "222222222");
      this.form.qqNumber = "1";
    },
    // 重置表单
    resetForm() {
      this.form = {
        questionCategoryCode: this.classId,
        extParam: { ip: "无", password: "", port: "", username: "" },
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
.inline {
  display: flex;
  justify-content: space-between;
}
</style>
