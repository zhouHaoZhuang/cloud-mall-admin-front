<template>
  <div class="offline_content">
    <div class="offline_title">
      <p>
        温馨提示：建议您首先采用微信、支付宝、银行卡
        <a @click="change('online')">在线充值</a>
        ，金额可实时到账；线下汇款受银行系统影响，到账时间可能会存在延迟。
      </p>
    </div>
    <div class="offline_steps">
      <a-steps v-model="current" direction="vertical" disabled>
        <a-step disabled>
          <div slot="title" class="stepInfo">
            <p>汇款至浙江云盾银行账户</p>
            <p>线下汇款直接向浙江云盾的账户汇款，汇款账号如下：</p>
          </div>
          <div slot="description">
            <div>
              <a-table bordered :columns="columns" :data-source="data">
                <a slot="name" slot-scope="text">{{ text }}</a>
              </a-table>
            </div>
          </div>
        </a-step>

        <a-step disabled>
          <div slot="title" class="stepInfo">
            <p>充值结果反馈</p>
            <p>
              汇款成功后请详细填写与您汇款账号关联的汇款凭据，我司将会核实您的汇款信息；到账时间取决于您的银行系统，请您耐心等待。
            </p>
          </div>
          <div slot="description">
            <div>
              <a-form-model
                ref="ruleForm"
                :model="form"
                :rules="rules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-form-model-item ref="name" label="汇款金额" prop="name">
                  <span class="transfer"><a-input v-model="form.name" /></span
                  >元
                </a-form-model-item>
                <a-form-model-item ref="name" label="汇款户名" prop="name">
                  <span class="transfer420"
                    ><a-input v-model="form.name"
                  /></span>
                </a-form-model-item>
                <a-form-model-item ref="name" label="汇款账号" prop="name">
                  <span class="transfer420"
                    ><a-input v-model="form.name"
                  /></span>
                </a-form-model-item>
                <a-form-model-item ref="name" label="汇款银行" prop="name">
                  <span class="transfer420"
                    ><a-input v-model="form.name"
                  /></span>
                </a-form-model-item>
                <a-form-model-item ref="name" label="汇款凭证" prop="name">
                  <a-upload
                    list-type="picture"
                    :default-file-list="fileList"
                    class="upload-list-inline"
                  >
                    <a-button> <a-icon type="upload" /> 上传附件 </a-button>
                  </a-upload>
                </a-form-model-item>
                <div class="uploadInfo">
                  <p>彩色扫描件</p>
                  <p>JPG或PNG格式，文件大小不超过1MB</p>
                  <p>汇款凭证不能为空</p>
                </div>
                <a-button type="primary"> 提交汇款记录 </a-button>
              </a-form-model>
            </div>
          </div>
        </a-step>
        <a-step disabled>
          <p slot="title">充值成功</p>
        </a-step>
      </a-steps>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: 0,
      data: [],
      columns: [
        {
          title: "账户名称",
          dataIndex: "name",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "银行账号",
          dataIndex: "age",
          width: 150
        },
        {
          title: "开户银行",
          dataIndex: "back"
        },
        {
          title: "汇款备注",
          dataIndex: "remark"
        }
      ],
      form: {
        name: ""
      },
      fileList: [
        // {
        //   uid: "-1",
        //   name: "xxx.png",
        //   status: "done",
        //   url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        //   thumbUrl:
        //     "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        // }
      ],
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
      rules: {
        name: [
          {
            required: true,
            message: "Please input Activity name",
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: ["change"],
  methods: {
    onChange(current) {
      console.log("onChange:", current);
      this.current = current;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.offline_content {
  > .offline_title {
    > p {
      color: rgb(255 102 0);
      font-size: 12px;
      height: 32px;
      background: rgb(255 243 235)
        url(https://www.ydidc.com/template/User/Zkeys/PC/Static/css/common/common/img/uc/tip_icon_warn_16.png)
        no-repeat 10px 8px;
      line-height: 32px;
      padding: 0px 22px 5px 37px;
      margin: 0;
      border: 1px solid rgb(255 218 194);
      border-radius: 2px;
    }
  }
  > .offline_steps {
    margin-top: 30px;
    margin-left: 20px;
    .stepInfo {
      > p:nth-child(1) {
        height: 32px;
        line-height: 32px;
        font-size: 16px;
        color: rgb(38 40 41);
      }
      > p:nth-child(2) {
        margin-top: 10px;
        font-size: 12px;
      }
    }
    .transfer {
      display: inline-block;
      width: 200px;
    }
    .transfer420 {
      display: inline-block;
      width: 420px;
    }
    .uploadInfo{
      font-size: 12px;
      color: rgb(153 153 153);
      margin-left: 90px;
    }
  }
}
</style>
