<template>
  <div>
    <div>
      <div>
        <a-button type="primary" icon="plus" @click="showModal">
          新增常用地址
        </a-button>
        <div class="title-hint">
          <img width="15px" src="@/assets/img/bill/adress.png" alt="" />
          最多可以设置 {{ 5 }} 个常用地址，您还可以添加 {{ 0 }} 个常用地址。
        </div>
      </div>
      <div>
        <a-table :columns="columns" :data-source="data">
          <div slot="action">
            <a-button type="link">编辑</a-button>
            <a-button type="link">设为默认</a-button>
            <a-button type="link">删除</a-button>
          </div>
        </a-table>
      </div>
    </div>
    <a-modal
      :title="modalTitle"
      :visible="visible"
      :centered="true"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
      :footer="null"
    >
      <div>
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item ref="name" label="收件人" prop="name">
            <a-input v-model="form.name" />
          </a-form-model-item>
          <a-form-model-item ref="name" label="联系电话" prop="name">
            <a-input v-model="form.name" />
          </a-form-model-item>
          <a-form-model-item ref="name" label="地址" prop="name">
            <!-- <a-input v-model="form.name" /> -->
            <a-select
              v-model="form.region"
              placeholder="please select your zone"
            >
              <a-select-option value="shanghai"> Zone one </a-select-option>
              <a-select-option value="beijing"> Zone two </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="name" label="详细地址" prop="name">
            <a-input v-model="form.name" />
          </a-form-model-item>
        </a-form-model>
        <a-button class="save-btn" type="primary" @click="onSubmit">
          保存信息
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      columns: [
        {
          title: "收件人",
          dataIndex: "name"
        },
        {
          title: "联系电话",
          dataIndex: "phone"
        },
        {
          title: "所在地区",
          dataIndex: "area"
        },
        {
          title: "详细地址",
          dataIndex: "address"
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      form: {
        name: "",
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "Please input Activity name",
            trigger: "blur"
          },
          {
            min: 3,
            max: 5,
            message: "Length should be 3 to 5",
            trigger: "blur"
          }
        ]
      },
      visible: false,
      confirmLoading: false,
      modalTitle: "新增地址信息"
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 2000);
    },
    handleCancel(e) {
      console.log("Clicked cancel button");
      this.visible = false;
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert("submit!");
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.title-hint {
  display: inline-block;
  width: 350px;
  margin-left: 20px;
  line-height: 25px;
  font-size: 8px;
  height: 25px;
  padding-left: 10px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 3px;
  margin-bottom: 30px;
}
.save-btn {
  width: 100px;
  margin-left: calc(50% - 50px);
}
</style>
