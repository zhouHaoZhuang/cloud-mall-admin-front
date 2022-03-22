<template>
  <div class="enterprise">
    <h2>
      <a-button style="margin-right: 20px" @click="$router.back()">
        <a-icon type="left" />
      </a-button>
      <span>企业认证</span>
    </h2>
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label=" " :colon="false">
        <h3>
          <img
            v-show="realNameStatus === 1"
            src="@/assets/img/realName/ralNameError.png"
            alt=""
          />
          <img
            v-show="realNameStatus === 2"
            src="@/assets/img/realName/realNameOk.png"
            alt=""
          />
          {{ realNameStatusText[realNameStatus] }}
        </h3>
      </a-form-model-item>
      <a-form-model-item :colon="false">
        <span slot="label" class="form-title">营业执照</span>
      </a-form-model-item>
      <a-form-model-item label="上传营业执照" required>
        <div class="business-item">
          <a-form-model-item prop="businessImg">
            <Upload
              class="upload-item"
              :isDel="realNameStatus !== 2"
              :defaultFile="form.businessImg"
              @change="
                ({ urlList, firstImageUrl }) => {
                  imgList(urlList, firstImageUrl, 'businessImg');
                }
              "
            />
          </a-form-model-item>
          <div class="example-img" v-show="realNameStatus !== 2">
            <img width="90px" src="@/assets/img/realName/business.png" alt="" />
            <p>
              示例图
              <a href="/console/static/img/business.png" target="_blank">
                <a-icon type="zoom-in" />
              </a>
            </p>
          </div>
        </div>
      </a-form-model-item>
      <a-form-model-item label="企业名称">
        <a-input
          v-if="form.businessName !== '' && realNameStatus !== 2"
          v-model="form.businessName"
        >
        </a-input>
        <span v-else-if="realNameStatus === 2">{{ form.businessName }}</span>
        <span v-else>通过上传营业执照获取</span>
      </a-form-model-item>
      <a-form-model-item label="社会信用代码">
        <a-input
          v-if="form.certNo !== '' && realNameStatus !== 2"
          v-model="form.certNo"
        >
        </a-input>
        <span v-else-if="realNameStatus === 2">{{ form.certNo }}</span>
        <span v-else>通过上传营业执照获取</span>
      </a-form-model-item>
      <a-form-model-item :colon="false">
        <span slot="label" class="form-title">法人信息</span>
      </a-form-model-item>
      <a-form-model-item label="上传身份证" required>
        <div class="business-item">
          <a-form-model-item prop="avatarImg">
            <Upload
              class="upload-item"
              :isDel="realNameStatus !== 2"
              :defaultFile="form.avatarImg"
              @change="
                ({ urlList, firstImageUrl }) => {
                  imgList(urlList, firstImageUrl, 'avatarImg');
                }
              "
              title="上传(人像)"
            />
          </a-form-model-item>
          <a-form-model-item prop="emblemImg">
            <Upload
              class="upload-item"
              :isDel="realNameStatus !== 2"
              :defaultFile="form.emblemImg"
              @change="
                ({ urlList, firstImageUrl }) => {
                  imgList(urlList, firstImageUrl, 'emblemImg');
                }
              "
              title="上传(国徽)"
            />
          </a-form-model-item>
          <div class="example-img" v-show="realNameStatus !== 2">
            <img width="90px" src="@/assets/img/realName/avatar.png" alt="" />
            <p>
              示例图
              <a href="/console/static/img/avatar.png" target="_blank">
                <a-icon type="zoom-in" />
              </a>
            </p>
          </div>
          <div class="example-img" v-show="realNameStatus !== 2">
            <img
              width="90px"
              src="@/assets/img/realName/nationalEmblem.png"
              alt=""
            />
            <p>
              示例图
              <a href="/console/static/img/nationalEmblem.png" target="_blank">
                <a-icon type="zoom-in" />
              </a>
            </p>
          </div>
        </div>
      </a-form-model-item>
      <a-form-model-item label="法人姓名">
        <a-input
          v-if="form.name !== '' && realNameStatus !== 2"
          v-model="form.name"
        ></a-input>
        <span v-else-if="realNameStatus === 2">{{ form.name }}</span>
        <span v-else>通过上传身份证获取</span>
      </a-form-model-item>
      <a-form-model-item label="身份证号码">
        <a-input
          v-if="form.idNo !== '' && realNameStatus !== 2"
          v-model="form.idNo"
        ></a-input>
        <span v-else-if="realNameStatus === 2">{{ form.idNo }}</span>
        <span v-else>通过上传身份证获取</span>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 9 }">
        <a-button
          v-show="realNameStatus !== 2"
          type="primary"
          @click="onSubmit"
        >
          提交审核
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import Upload from "@/components/Upload/index";

export default {
  components: {
    Upload
  },
  data() {
    return {
      labelCol: { span: 9 },
      wrapperCol: { span: 10 },
      form: {
        businessImg: "",
        avatarImg: "",
        emblemImg: "",
        businessName: "",
        certNo: "",
        name: "",
        idNo: ""
      },
      rules: {
        businessImg: [
          {
            required: true,
            message: "请上传营业执照",
            trigger: "change"
          }
        ],
        avatarImg: [
          {
            required: true,
            message: "请上传身份证(人像)",
            trigger: "change"
          }
        ],
        emblemImg: [
          {
            required: true,
            message: "请上传身份证(国徽)",
            trigger: "change"
          }
        ]
      },
      realNameData: {},
      realNameStatus: 0,
      realNameStatusText: {
        0: "当前账号尚未进行企业实名认证",
        1: "企业实名认证失败，请核实后重新提交认证",
        2: "企业实名认证已完成"
      }
    };
  },
  created() {
    console.log(window.location.host, window.location.protocol);
    this.$nextTick(() => {
      this.resetForm();
      this.getEnterpriseRealNameInfo();
    });
  },
  computed: {
    host() {
      return window.location.protocol + window.location.host;
    }
  },
  methods: {
    // 获取企业实名认证的数据信息
    getEnterpriseRealNameInfo() {
      this.$store.dispatch("user/getEnterpriseRealNameInfo").then((res) => {
        if (!res || !res.data) {
          this.realNameStatus = 0;
          return;
        }
        this.realNameStatus = 2;
        this.form.businessImg = res.data.businessImg;
        this.form.businessName = res.data.companyName;
        this.form.avatarImg = res.data.infoImg;
        this.form.emblemImg = res.data.emblemImg;
        this.form.name = res.data.legalName;
        this.form.idNo = res.data.legalNo;
        this.form.certNo = res.data.companyCode;
      });
    },
    // 上传营业执照图片
    businessImgData(url) {
      this.$store
        .dispatch("user/businessImgData", { licenseImg: url })
        .then((res) => {
          // console.log(res);
          this.form.businessName = res.data.name;
          this.form.certNo = res.data.certNo;
          this.realNameData = { ...this.realNameData, ...res.data };
          this.realNameData.businessName = res.data.name;
          // this.form = res.data;
        });
    },
    // 上传身份证图片
    legalPersonData() {
      let data = {
        infoImg: this.form.avatarImg,
        emblemImg: this.form.emblemImg
      };
      this.$store.dispatch("user/legalPersonData", data).then((res) => {
        console.log(res);
        this.form.name = res.data.name;
        this.form.idNo = res.data.idNo;
        this.realNameData = { ...this.realNameData, ...res.data };
        this.realNameData.legalName = res.data.name;
        this.realNameData.legalNo = res.data.idNo;
      });
    },
    // 提交实名认证审核
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.realNameData.businessName = this.form.businessName;
          this.realNameData.certNo = this.form.certNo;
          this.realNameData.legalName = this.form.name;
          this.realNameData.legalNo = this.form.idNo;
          this.realNameData.licenseImg = this.form.businessImg;
          this.realNameData.infoImg = this.form.avatarImg;
          this.realNameData.emblemImg = this.form.emblemImg;
          this.$store
            .dispatch("user/uploadEnterpriseRealName", this.realNameData)
            .then((res) => {
              this.$message.success("提交成功");
              console.log(res, "认证结果");
              if (res.data === true) {
                this.realNameStatus = 2;
              }
              if (res.data === false) {
                this.realNameStatus = 1;
              }
            });
        }
      });
    },
    imgList(urlList, firstImageUrl, imgType) {
      console.log(urlList, firstImageUrl, imgType);
      this.form[imgType] = urlList.toString();
      if (imgType === "businessImg" && firstImageUrl) {
        this.businessImgData(firstImageUrl);
      }
      if (this.form.businessImg === "") {
        this.form.businessName = "";
        this.form.certNo = "";
      }
      if (this.form.avatarImg.length > 0 && this.form.emblemImg.length > 0) {
        this.legalPersonData();
      }
      if (this.form.avatarImg === "" || this.form.emblemImg === "") {
        this.form.name = "";
        this.form.idNo = "";
      }
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.form = {
        businessImg: "",
        avatarImg: "",
        emblemImg: "",
        businessName: "",
        certNo: "",
        name: "",
        idNo: ""
      };
    }
  }
};
</script>

<style lang="less" scoped>
.enterprise {
  width: 100%;
  background-color: #fff;
  overflow: hidden;
  margin: 0 10px;
}
h3 {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 0;
}
a {
  color: #333;
  z-index: 10000;
}
.form-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}
.business-item {
  display: flex;
  .upload-item {
    width: 110px;
  }
  .upload-item,
  .example-img {
    margin-right: 20px;
  }
  .example-img {
    padding: 5px;
    width: 102px;
    height: 102px;
    text-align: center;
    border: 1px dashed #e8e8e8;
    border-radius: 5px;
    p {
      line-height: 30px;
      margin-bottom: 0;
    }
  }
}
</style>
