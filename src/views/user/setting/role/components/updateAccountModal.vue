<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    :title="modalTitle"
    wrapClassName="update-account-container"
    okText="确定"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <!-- 添加时展示 -->
      <a-form-model-item
        v-if="type === 'add'"
        label="子账号名称"
        prop="nickname"
      >
        <a-input
          v-model="form.nickname"
          placeholder="请输入子账号名称"
          :max-length="20"
        />
      </a-form-model-item>
      <a-form-model-item v-if="type === 'add'" label="手机号" prop="phone">
        <a-input
          v-model="form.phone"
          addon-before="+86"
          placeholder="11位手机号"
          v-number-evolution
          :max-length="11"
        />
      </a-form-model-item>
      <!-- <a-form-model-item
        v-if="type === 'add'"
        label="图形验证码"
        prop="verificationCode"
      >
        <a-input
          type="text"
          v-model="form.verificationCode"
          placeholder="请输入图形验证码"
          :max-length="4"
          style="width:250px"
        />
        <div
          v-if="identifyCode"
          @click="refreshCode()"
          class="code"
          title="点击切换验证码"
        >
          <Identify :identifyCode="identifyCode" />
        </div>
      </a-form-model-item> -->
      <a-form-model-item
        v-if="type === 'add'"
        label="验证码"
        class="code-wrap"
        prop="code"
      >
        <a-input
          v-model="form.code"
          style="width:250px"
          placeholder="输入验证码"
          v-number-evolution
          :max-length="6"
        />
        <CodeBtn :phone="form.phone" codeType="1" />
      </a-form-model-item>
      <a-form-model-item v-if="type === 'add'" label="设置密码" prop="password">
        <a-input-password
          v-model="form.password"
          v-password-input
          :max-length="20"
          placeholder="6 - 20位密码，区分大小写"
          @keydown.native="keydown($event)"
        />
      </a-form-model-item>
      <a-form-model-item
        v-if="type === 'add'"
        label="确认密码"
        prop="confirmPassword"
      >
        <a-input-password
          v-model="form.confirmPassword"
          v-password-input
          :max-length="20"
          placeholder="确认密码"
          @keydown.native="keydown($event)"
        />
      </a-form-model-item>
      <!-- 编辑时展示 -->
      <a-form-model-item v-if="type === 'edit'" label="账号">
        {{ form.username }}
      </a-form-model-item>
      <a-form-model-item v-if="type === 'edit'" label="子账号名称">
        {{ form.nickname }}
      </a-form-model-item>
      <a-form-model-item v-if="type === 'edit'" label="手机号">
        {{ form.phone }}
      </a-form-model-item>
      <!-- 添加/编辑都展示 -->
      <a-form-model-item label="角色" prop="roleIds">
        <a-select
          v-model="form.roleIds"
          mode="multiple"
          allowClear
          placeholder="请选择角色"
        >
          <a-select-option
            v-for="item in roleList"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import CodeBtn from "@/components/CodeBtn/index";
import Identify from "@/components/Identify";
import { getRandomCode } from "@/utils/index";

export default {
  // 双向绑定
  model: {
    event: "changeVisible",
    prop: "value"
  },
  props: {
    // 组件传递的值
    value: {
      type: Boolean,
      default: false
    },
    // 单个子账号详情
    detail: {
      type: Object,
      default: () => {}
    }
  },
  components: { CodeBtn },
  computed: {
    modalTitle() {
      return this.type === "add" ? "添加子账号" : "修改子账号";
    }
  },
  watch: {
    detail: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== "{}") {
          this.type = "edit";
          this.form = { ...newVal };
        } else {
          this.type = "add";
        }
      },
      immediate: true
    },
    value: {
      handler(newVal) {
        if (!newVal) {
          this.$nextTick(() => {
            this.resetForm();
          });
        } else {
          this.refreshCode();
          this.getRoleList();
        }
      }
    }
  },
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
      } else if (value !== this.form.password) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      type: "add",
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      loading: false,
      form: {
        nickname: "",
        password: "",
        confirmPassword: "",
        phone: "",
        code: "",
        roleIds: undefined,
        verificationCode: ""
      },
      pwdReg: /(?=.*[0-9])(?=.*[a-zA-Z]).{6,20}/,
      rules: {
        nickname: [
          {
            required: true,
            message: "请输入子账号名称",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: ["blur", "change"]
          }
        ],
        code: [
          {
            required: true,
            message: "请输入验证码",
            trigger: ["blur", "change"]
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["blur", "change"]
          },
          { validator: validatePass, trigger: ["blur", "change"] }
        ],
        confirmPassword: [
          {
            required: true,
            message: "请输入确认密码",
            trigger: ["blur", "change"]
          },
          { validator: validatePass2, trigger: ["blur", "change"] }
        ],
        roleIds: [
          {
            required: true,
            message: "请选择角色",
            trigger: ["blur", "change"]
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
        ]
      },
      roleList: [],
      identifyCode: "" //要核对的验证码
    };
  },
  methods: {
    // 查询角色列表
    getRoleList() {
      this.$store
        .dispatch("organization/getRoleList", {
          currentPage: 1,
          pageSize: 999
        })
        .then(res => {
          this.roleList = [...res.data.list];
        });
    },
    // 关闭弹窗
    handleCancel() {
      this.$emit("changeVisible", false);
    },
    // 重置表单数据
    resetForm() {
      this.$refs.ruleForm.clearValidate();
      this.form = {
        nickname: "",
        password: "",
        confirmPassword: "",
        phone: "",
        code: "",
        roleIds: undefined,
        verificationCode: ""
      };
    },
    // 禁止输入空格
    keydown(event) {
      if (event.keyCode == 32) {
        event.returnValue = false;
      }
    },
    // 弹窗提交
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const req =
            this.type === "add"
              ? "organization/addAccount"
              : "organization/editAccount";
          this.$store
            .dispatch(req, {
              ...this.form,
              newRoleIds: this.type === "edit" ? this.form.roleIds : undefined
            })
            .then(res => {
              this.$message.success(this.modalTitle + "成功");
              this.$emit("success");
              this.$emit("changeVisible", false);
            })
            .catch(() => {
              this.refreshCode();
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    // 获取验证码组件校验图形验证
    validateImgCode(callback) {
      let flag = false;
      this.$refs.ruleForm.validateField(
        "verificationCode",
        err => (flag = err ? false : true)
      );
      callback(flag);
    },
    // 更新验证码
    refreshCode() {
      this.identifyCode = getRandomCode();
    }
  }
};
</script>
<style lang="less">
.update-account-container {
  .code-wrap {
    .ant-form-item-children {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .code {
    cursor: pointer;
    position: absolute;
    right: -145px;
    top: -10px;
  }
}
</style>
