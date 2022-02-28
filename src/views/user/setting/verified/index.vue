<template>
  <div>
    <div v-if="allConfig.persona_real_authentication == '1'">
      <h2 class="verified-title">实名认证</h2>
      <div class="verified-top-nav" v-if="choose != 3">
        <span :class="{ chooseClick: choose == 1 }">①填写认证资料</span>
        <span :class="{ chooseClick: choose == 2 }">②确认认证信息</span>
        <!-- <span :class="{ chooseClick: choose == 3 }">③实名认证信息</span> -->
      </div>
      <div v-if="choose == 1">
        <p class="phone-hint">
          您选择了“手机号码认证方式”进行实名认证，请填写一下信息：
        </p>
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="验证方式">
            <a-radio-group v-model="form.checkType">
              <a-radio
                :value="index * 1"
                v-for="(item, index) in verifyTypeEnum"
                :key="index"
              >
                {{ item }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="真实姓名" prop="name">
            <a-input v-model="form.name" />
            请填写您本人的真实姓名，否则无法验证通过
          </a-form-model-item>
          <a-form-model-item label="身份证号码" prop="idNo">
            <a-input v-model="form.idNo" />
            请填写您本人的真实身份证号码，否则无法验证通过
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
            <a-button type="primary" @click="choose = 2" :disabled="nextAudit">
              下一步
            </a-button>
            <!-- <a-button style="margin-left: 10px"> 返回上一步 </a-button> -->
          </a-form-model-item>
        </a-form-model>
        <div class="warm-tips">
          <h3>温馨提示：</h3>
          <p class="warm-tips-first-p">
            1，请确保姓名、身份证号码完全正确，请勿使用他人身份信息进行认证，否则会认证失败
          </p>
          <p>2，请勿使用虚假信息认证，否则浙江云盾有权注销您的实名认证申请</p>
          <p>
            3，浙江云盾会加密保存您的认证资料，绝不会泄露用户隐私，请放心认证
          </p>
          <p>
            4，所填写资料仅用于实名认证，不会开通其他任何附加服务，浙江云盾工作人员不会向您索要短信验证码，谨防上当
          </p>
        </div>
      </div>
      <div v-if="choose == 2">
        <div class="alert-warn">
          <span>
            如果姓名不正确，或者身份证号码错误，浙江云盾将取消您的实名认证，请仔细核对后提交！
          </span>
        </div>
        <a-form-model
          :model="form"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="验证方式">
            <span>{{ verifyTypeEnum[form.checkType] }}</span>
          </a-form-model-item>
          <a-form-model-item label="真实姓名">
            <span>{{ form.name }}</span>
          </a-form-model-item>
          <a-form-model-item label="身份证号码">
            <span>{{ form.idNo }}</span>
          </a-form-model-item>
          <a-form-model-item label="" :wrapper-col="{ span: 14, offset: 4 }">
            <a-checkbox-group v-model="form.type">
              <a-checkbox value="1" name="type">确认如上信息属实</a-checkbox>
            </a-checkbox-group>
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="submit" :disabled="Review">
              提交审核
            </a-button>
            <a-button style="margin-left: 10px" @click="choose = 1">
              上一步
            </a-button>
          </a-form-model-item>
        </a-form-model>
        <a-modal
          title="请扫描下方二维码"
          :visible="visible"
          :confirm-loading="confirmLoading"
          @ok="handleOk"
          @cancel="handleCancel"
          forceRender
        >
          <!-- <p>{{ ModalText }}</p> -->
          <div class="qrcodeDom">
            <div id="qrcodeDom"></div>
            <p v-if="endTime">
              请在<span>{{ endTime }}</span
              >前扫码完成验证
            </p>
          </div>
        </a-modal>
      </div>
      <div v-if="choose == 3" class="verified-info">
        <img class="user-img" src="@/assets/img/auth_icon_success.png" alt="" />
        <div class="verified-info-word">
          <h3>恭喜您已通过实名认证！</h3>
          <!-- <p>
            <span class="verified-info-key">认证途径：</span>
            <span>浙江云盾认证</span>
          </p> -->
          <p>
            <span class="verified-info-key">真实姓名：</span>
            <span>{{ userRealInfo.realName }}</span>
          </p>
          <p>
            <span class="verified-info-key">认证时间：</span>
            <span>{{ userRealInfo.modifyTime | formatDate }}</span>
          </p>
          <p>
            <span class="verified-info-key">证件号码：</span>
            <span>{{ idNumber }}</span>
          </p>
          <p>
            <span class="verified-info-key">认证版本：</span>
            <span><img src="@/assets/img/auth_level_2.png" alt="" /></span>
          </p>
          <!-- <p class="verified-info-key">
            如果您的认证信息发生变更，可
            <a href="/console/user/setting/changerealname">修改认证资料 ></a>
          </p> -->
        </div>
      </div>
    </div>
    <div v-else>未开启实名认证功能</div>
  </div>
</template>

<script>
import { verifyTypeEnum } from "@/utils/enum";
import { mapState } from "vuex";
import QRCode from "qrcodejs2";
import moment from "moment";
export default {
  data() {
    return {
      verifyTypeEnum,
      choose: 1,
      Review: true,
      labelCol: { span: 4 },
      wrapperCol: { span: 10 },
      form: {
        phone: "",
        code: "",
        type: [],
        checkType: 0,
        idNo: "",
        name: ""
      },
      textUrl: "",
      endTime: null,
      nextAudit: true,
      rules: {
        name: [
          {
            required: true,
            message: "真实姓名不能为空",
            trigger: "blur"
          }
          // {
          //   min: 3,
          //   max: 5,
          //   message: 'Length should be 3 to 5',
          //   trigger: 'blur',
          // },
        ],
        idNo: [
          {
            required: true,
            message: "身份证号码不能为空",
            trigger: "blur"
          },
          {
            min: 18,
            max: 18,
            message: "身份证号码长度为18位",
            trigger: "blur"
          }
        ]
      },
      ModalText: "Content of the modal",
      visible: false,
      confirmLoading: false
    };
  },
  watch: {
    form: {
      deep: true,
      handler(newName, oldName) {
        console.log(newName, oldName);
        if (this.form.name.length > 0 && this.form.idNo.length > 0) {
          this.nextAudit = false;
        } else {
          this.nextAudit = true;
        }
        if (this.form.type.length > 0) {
          this.Review = false;
        } else {
          this.Review = true;
        }
      }
    },
    choose(newVal, oldVal) {
      console.log(this.form);
    }
  },
  computed: {
    ...mapState({
      allConfig: (state) => state.user.allConfig,
      userRealInfo: (state) => state.user.userRealInfo
    }),
    idNumber() {
      if (this.userRealInfo && this.userRealInfo.idNumber) {
        return (
          this.userRealInfo.realName.slice(0, 3) +
          "******" +
          this.userRealInfo.realName.slice(14, 17)
        );
      } else {
        return "";
      }
    }
  },
  mounted() {
    // console.log(this.userRealInfo, "zhenshi");
    if (this.userRealInfo && this.userRealInfo.realName) {
      this.choose = 3;
    }
  },
  methods: {
    // 链接生成二维码
    //链接生成二维码 Api
    transQrcode() {
      const qrcode = new QRCode("qrcodeDom", {
        width: 160,
        height: 160,
        text: `${this.textUrl}`
      });
    },
    //点击开始进行转化
    getQrcode() {
      document.getElementById("qrcodeDom").innerHTML = ""; //先清空之前生成的二维码
      this.$nextTick(() => {
        this.transQrcode();
      });
    },
    handleOk(e) {
      this.confirmLoading = true;
      // setTimeout(() => {
      this.visible = false;
      this.confirmLoading = false;
      // }, 2000);
    },
    handleCancel(e) {
      console.log("Clicked cancel button");
      this.visible = false;
    },
    submit() {
      this.$store.dispatch("realName/realName", this.form).then((res) => {
        this.visible = true;
        // 360424199802204319c
        this.endTime = moment(parseInt(res.data.expire)).format(
          "YYYY/MM/DD HH:mm:ss"
        );
        this.textUrl = res.data.shortUrl;
        this.getQrcode();
      });
      // .catch((val) => {
      //   this.$message.error("您的认证信息有误，请重新输入");
      // });
    }
  }
};
</script>

<style lang="less" scoped>
.verified-title {
  margin-bottom: 20px;
  height: 40px;
  line-height: 40px;
  font-size: 22px;
  color: #272829;
}
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
.qrcodeDom {
  width: 100%;
  text-align: center;
  #qrcodeDom {
    width: 160px;
    margin: 20px auto;
  }
  p {
    font-size: 16px;
    span {
      color: #ff0000;
      font-weight: 500;
    }
  }
}
.verified-top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  span {
    display: block;
    width: 48%;
    text-align: center;
    height: 50px;
    line-height: 50px;
    background-color: #f2f2f2;
    color: #000;
  }
  .chooseClick {
    background-color: #00aaff;
    color: #fff;
  }
}
.phone-hint {
  color: #a8adbd;
  margin-bottom: 20px;
}
.warm-tips {
  margin-top: 70px;
  h3 {
    font-weight: 600;
    color: #ff6600;
    margin-bottom: 0;
    width: 100px;
    text-align: center;
    padding-bottom: 10px;
    border-bottom: 2px solid #ff6600;
    position: relative;
    z-index: 1;
  }
  .warm-tips-first-p {
    position: relative;
    z-index: 0;
    margin-top: -1px;
    padding-top: 20px;
    border-top: 1px solid #efefef;
  }
  p {
    color: #788084;
  }
}
.verified-info {
  display: flex;
  width: 100%;
  border: 1px solid #eee;
  padding-bottom: 50px;
  align-items: center;
  justify-content: center;
  .user-img {
    width: 129px;
    height: 120px;
  }
  .verified-info-word {
    padding: 40px 330px 0 60px;
    font-size: 12px;
    color: #666;
    h3 {
      margin-bottom: 30px;
      font-weight: bold;
      font-size: 22px;
      color: #262829;
    }
    .verified-info-key {
      color: #a0a2a3;
    }
    p:last-child {
      margin-top: 35px;
    }
  }
}
</style>
