<template>
  <a-modal
    :visible="value"
    width="680px"
    centered
    title="重装系统"
    wrapClassName="updateSys-modal-container"
    okText="确定"
    :confirmLoading="loading"
    @ok="handleResetSystem"
    @cancel="handleCancel"
  >
    <div class="info-box">
      <a-icon class="icon" type="exclamation-circle" />
      注：操作系统重装前请您提前做好相关备份，以免数据丢失给您造成损失！
    </div>
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="IP地址"> {{ detail.outIp }} </a-form-model-item>
      <a-form-model-item label="选择操作系统">
        <a-select
          v-model="form.defaultSystem"
          allow-clear
          class="select1"
          placeholder="请选择系统类别"
          @change="handleSystemChange"
        >
          <a-select-option v-for="(val, key) in systemList" :key="key">
            {{ key }}
          </a-select-option>
        </a-select>
        <a-select
          v-model="form.imageId"
          allow-clear
          class="select2"
          placeholder="请选择系统版本"
        >
          <a-select-option
            v-for="item in systemEditionList"
            :key="item.imageId"
          >
            {{ item.OSName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="重装后的系统密码" prop="password">
        <a-input-password
          v-model="form.password"
          v-password-input
          type="password"
          style="width: 280px"
          :max-length="30"
        />
        <div class="txt">
          1、8-30个字符，必须同时包含下面四项中的三项：大写字母、小写字母、数字、和特殊字符
        </div>
        <div class="txt">
          2、 （仅支持下列特殊字符： ( ) ` ~ ! @ # $ % ^ {{ "&" }} * - _ + = | {
          } : ; ' > <span v-text="'<'"></span> , . ? / ）。
        </div>
      </a-form-model-item>
      <a-form-model-item label="确认密码" prop="confirmPassword">
        <a-input-password
          v-model="form.confirmPassword"
          type="password"
          style="width: 280px"
          :max-length="30"
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { judgePwdFormat } from "@/utils/index";
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
    // 实例详情
    detail: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal) {
          this.getSystemData();
        }
      }
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (judgePwdFormat(value) < 3) {
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
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      loading: false,
      form: {
        password: "",
        confirmPassword: "",
        defaultSystem: undefined,
        imageId: undefined
      },
      rules: {
        password: [{ validator: validatePass, trigger: ["blur", "change"] }],
        confirmPassword: [
          { validator: validatePass2, trigger: ["blur", "change"] }
        ]
      },
      // 系统镜像
      systemList: [], // 系统
      systemEditionList: [] // 版本
    };
  },
  created() {},
  methods: {
    // 关闭弹窗
    handleCancel() {
      this.$emit("changeVisible", false);
    },
    // 获取对应地域的系统镜像
    getSystemData() {
      this.$store
        .dispatch("cloud/getSystemList", {
          regionId: this.detail.regionId,
          instanceType: this.detail.instanceType
        })
        .then((res) => {
          this.systemList = res.data.imageMap;
          const defaultKey = Object.keys(res.data.imageMap)[0];
          this.form.defaultSystem = defaultKey;
          this.handleSystemChange(defaultKey);
        });
    },
    // 系统镜像-系统change
    handleSystemChange(val) {
      this.systemEditionList = this.systemList[val].map((item) => {
        return { ...item };
      });
      this.form.defaultSystem = val;
      this.form.imageId = this.systemEditionList[0].imageId;
    },
    // 弹窗提交
    // 重装系统
    handleResetSystem() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const data = {
            instanceId: this.detail.instanceId,
            instanceType: this.detail.instanceType,
            regionId: this.detail.regionId,
            imageId: this.form.imageId,
            password: this.form.password
          };
          this.$store
            .dispatch("cloud/reloadSystem", data)
            .then((res) => {
              this.$message.success("重装系统成功");
              this.$emit("success");
              this.$emit("changeVisible", false);
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.updateSys-modal-container {
  background: #fff;
  .info-box {
    display: flex;
    align-items: center;
    padding: 7px 22px 5px 37px;
    min-height: 32px;
    border: 1px solid #ffdac2;
    border-radius: 2px;
    color: #ff6600;
    font-size: 12px;
    margin-bottom: 20px;
    background: #fff3eb;
    .icon {
      font-size: 16px;
      margin-right: 6px;
    }
  }
  .txt {
    font-size: 12px;
    color: #999;
    line-height: 24px;
  }
  .select1,
  .select2 {
    width: 200px;
    margin-right: 10px;
  }
}
</style>
