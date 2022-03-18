<template>
  <div>
    <h2 class="return">
      <a-button style="margin-right: 20px" @click="$router.back()">
        <a-icon type="left" />
      </a-button>
      <span>修改密码</span>
    </h2>
    <div class="alert-warn">
      注意账户安全，请尽量避免采用手机号、电话号码、生日、学号、身份证等个人信息设置密码
    </div>
    <div>
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <!-- <a-form-model-item ref="name" label="会员ID">
          <a-input v-model="form.name" />
        </a-form-model-item> -->
        <!-- <a-form-model-item ref="name" label="验证手机号" prop="name">
          <a-input v-model="form.name" />
          <CodeBtn :phone="form.phone" />
        </a-form-model-item> -->
        <a-form-model-item label="验证手机号" prop="phone">
          <a-input v-number-evolution v-model="form.phone"></a-input>
        </a-form-model-item>
        <a-form-model-item label="图形验证码" prop="verificationCode">
          <a-input
            v-model="form.verificationCode"
            placeholder="请输入图形验证码"
            :max-length="4"
            style="width: 250px"
          >
            <a-icon slot="prefix" type="smile" />
          </a-input>
          <div @click="refreshCode()" class="code" title="点击切换验证码">
            <Identify :identifyCode="identifyCode" />
          </div>
        </a-form-model-item>
        <a-form-model-item label="验证码" prop="code">
          <a-input
            v-model="form.code"
            style="width: 250px; margin-right: 9px"
            placeholder="输入验证码"
            v-number-evolution
            :max-length="6"
          >
            <a-icon slot="prefix" type="smile" />
          </a-input>
          <CodeBtn
            codeType="3"
            :phone="form.phone"
            :isDisabled="isDisabled"
            @validate="validateImgCode"
          />
        </a-form-model-item>
        <a-form-model-item ref="name" label="新密码" prop="newPassword">
          <a-input-password v-model="form.newPassword" v-password-input />
        </a-form-model-item>
        <a-form-model-item ref="name" label="确认密码" prop="newPasswordEnter">
          <a-input-password v-model="form.newPasswordEnter" v-password-input />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button @click="onSubmit" type="primary"> 提交修改 </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import CodeBtn from "@/components/CodeBtn/index";
import Identify from "@/components/Identify";
import { jumpCloudMall, getRandomCode } from "@/utils/index";
import { mapState } from "vuex";

export default {
  components: { CodeBtn, Identify },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (!this.pwdReg.test(value)) {
          callback(new Error("密码格式不正确"));
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.form.newPassword) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      pwdReg: /(?=.*[0-9])(?=.*[a-z]).{8,20}/,
      isDisabled: false,
      form: {
        name: "",
        phone: "",
        code: "",
        newPassword: "",
        newPasswordEnter: "",
        verificationCode: ""
      },
      rules: {
        phone: [
          { required: true, message: "请输入验证手机号", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机号码格式不正确",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (value !== this.userRealInfo.phoneNumber) {
                callback(new Error("请输入当前登录手机号"));
                this.isDisabled = true;
              } else {
                callback();
                this.isDisabled = false;
              }
            },
            trigger: "blur"
          }
        ],
        verificationCode: [
          {
            required: true,
            message: "请输入图形验证码",
            trigger: ["blur", "change"]
          },
          {
            validator: (rule, value, callback) => {
              if (value !== this.identifyCode) {
                callback(new Error("图形验证码不正确"));
              }
              callback();
            },
            trigger: ["blur", "change"]
          }
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        // newPassword: [
        //   { required: true, message: '请输入新密码', trigger: 'blur' },
        // ],
        // newPasswordEnter: [
        //   { required: true, message: '确认密码', trigger: 'blur' },
        // ],
        newPassword: [
          { validator: validatePass, trigger: ["blur", "change"] },
          { min: 8, max: 20, message: "密码位数在8~20位", trigger: "blur" }
        ],
        newPasswordEnter: [
          { validator: validatePass2, trigger: ["blur", "change"] },
          { min: 8, max: 20, message: "密码位数在8~20位", trigger: "blur" }
        ]
      },
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 10
      },
      identifyCode: "" //要核对的验证码
    };
  },
  computed: {
    ...mapState({
      userRealInfo: (state) => state.user.userRealInfo
    })
  },
  mounted() {
    this.refreshCode();
  },
  methods: {
    // 获取验证码组件校验图形验证
    validateImgCode(callback) {
      let flag = false;
      this.$refs.ruleForm.validateField(
        "verificationCode",
        (err) => (flag = err ? false : true)
      );
      callback(flag);
    },
    // 更新验证码
    refreshCode() {
      this.identifyCode = getRandomCode();
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.form.password = this.form.newPassword;
          this.form.username = this.form.phone;
          this.$store.dispatch("user/changePassword", this.form).then(() => {
            this.$message.success("修改成功");
            this.$store
              .dispatch("user/logout")
              .then((res) => {
                jumpCloudMall("/login?out=1");
              })
              .catch(() => {
                this.refreshCode();
              });
          });
        } else {
          this.$message.error("请检查输入项");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.alert-warn {
  padding: 7px 22px 5px 37px;
  background: #fff3eb url(../../../../assets/img/pay/ExclamationMark.png)
    no-repeat 10px 8px;
  min-height: 32px;
  border: 1px solid #ffdac2;
  border-radius: 2px;
  color: #f60;
  font-size: 12px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.return {
  display: flex;
  align-items: center;
}
.code {
  cursor: pointer;
  position: absolute;
  right: -122px;
  top: -10px;
}
</style>
