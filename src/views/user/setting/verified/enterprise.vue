<template>
  <div>
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
        <h3>当前账号尚未进行企业实名认证</h3>
      </a-form-model-item>
      <a-form-model-item :colon="false">
        <span slot="label" class="form-title">营业执照</span>
      </a-form-model-item>

      <a-form-model-item label="上传营业执照" required>
        <div class="business-item">
          <a-form-model-item prop="businessImg">
            <Upload
              class="upload-item"
              :defaultFile="form.businessImg"
              @change="
                ({ urlList, firstImageUrl }) => {
                  imgList(urlList, firstImageUrl, 'businessImg');
                }
              "
            />
          </a-form-model-item>
          <div class="example-img">
            <img width="90px" src="@/assets/img/realName/business.png" alt="" />
            <p>示例图</p>
          </div>
        </div>
      </a-form-model-item>
      <a-form-model-item label="企业名称">
        <span>通过上传营业执照获取</span>
      </a-form-model-item>
      <a-form-model-item label="社会信用代码">
        <span>通过上传营业执照获取</span>
      </a-form-model-item>
      <a-form-model-item :colon="false">
        <span slot="label" class="form-title">法人信息</span>
      </a-form-model-item>
      <a-form-model-item label="上传身份证" required>
        <div class="business-item">
          <a-form-model-item prop="avatarImg">
            <Upload
              class="upload-item"
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
              :defaultFile="form.emblemImg"
              @change="
                ({ urlList, firstImageUrl }) => {
                  imgList(urlList, firstImageUrl, 'emblemImg');
                }
              "
              title="上传(国徽)"
            />
          </a-form-model-item>
          <div class="example-img">
            <img width="90px" src="@/assets/img/realName/avatar.png" alt="" />
            <p>示例图</p>
          </div>
          <div class="example-img">
            <img
              width="90px"
              src="@/assets/img/realName/nationalEmblem.png"
              alt=""
            />
            <p>示例图</p>
          </div>
        </div>
      </a-form-model-item>
      <a-form-model-item label="法人姓名">
        <span>通过上传身份证获取</span>
      </a-form-model-item>
      <a-form-model-item label="身份证号码">
        <span>通过上传身份证获取</span>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 8 }">
        <a-button type="primary" @click="onSubmit"> 提交审核 </a-button>
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
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      form: {
        businessImg: "",
        avatarImg: "",
        emblemImg: ""
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
      }
    };
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert("submit!");
        }
      });
    },
    imgList(urlList, firstImageUrl, imgType) {
      console.log(urlList, firstImageUrl, imgType);
      this.form[imgType] = urlList.toString();
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
h2 {
  display: flex;
  align-items: center;
}
h3 {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
.form-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}
.business-item {
  display: flex;
  .upload-item {
    width: 102px;
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
