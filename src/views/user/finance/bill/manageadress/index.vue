<template>
  <div>
    <div>
      <div>
        <a-button
          type="primary"
          icon="plus"
          @click="showModal('新增地址信息')"
          :disabled="data.length === 5"
        >
          新增常用地址
        </a-button>
        <div class="title-hint">
          <img
            style="margin-top: -2px"
            width="15px"
            src="@/assets/img/bill/adress.png"
            alt=""
          />
          最多可以设置 {{ 5 }} 个常用地址，您还可以添加
          {{ 5 - data.length }} 个常用地址。
        </div>
      </div>
      <div>
        <a-table
          :columns="columns"
          :data-source="data"
          :pagination="false"
          rowKey="id"
        >
          <div slot="county" slot-scope="text, record">
            <span>{{ record.province }}</span
            >/<span>{{ record.city }}</span
            >/<span>{{ text }}</span>
          </div>
          <div slot="addressee" slot-scope="text, record">
            <span>{{ text }}</span>
            <small class="default" v-show="record.defaultSign === 1">
              默认
            </small>
          </div>
          <div slot="action" slot-scope="text">
            <a-button type="link" @click="showModal('编辑地址信息', text.id)">
              编辑
            </a-button>
            <a-button
              type="link"
              :disabled="text.defaultSign === 1"
              @click="setDefault(text.id)"
            >
              设为默认
            </a-button>
            <a-button
              type="link"
              :disabled="text.defaultSign === 1"
              :class="{ 'del-btn': text.defaultSign !== 1 }"
              @click="del(text.id)"
            >
              删除
            </a-button>
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
      forceRender
    >
      <div>
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="收件人" prop="addressee">
            <a-input v-model="form.addressee" />
          </a-form-model-item>
          <a-form-model-item label="联系电话" prop="concatPhone">
            <a-input v-model="form.concatPhone" />
          </a-form-model-item>
          <a-form-model-item label="地址" prop="city">
            <a-cascader
              placeholder="请选择地址"
              :options="options"
              v-model="adress"
              @change="onChange"
            />
          </a-form-model-item>
          <a-form-model-item label="详细地址" prop="address">
            <a-input v-model="form.address" />
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
import { options } from "@/utils/city";
export default {
  data() {
    return {
      data: [],
      options,
      columns: [
        {
          title: "收件人",
          dataIndex: "addressee",
          scopedSlots: {
            customRender: "addressee"
          }
        },
        {
          title: "联系电话",
          dataIndex: "concatPhone"
        },
        {
          title: "地址",
          dataIndex: "county",
          scopedSlots: {
            customRender: "county"
          }
        },
        {
          title: "详细地址",
          dataIndex: "address"
        },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      form: {
        addressee: "",
        concatPhone: "",
        address: "",
        province: "",
        city: "",
        county: "",
      },
      adress:['','',''],
      rules: {
        addressee: [
          {
            required: true,
            message: "收件人不能为空",
            trigger: "blur"
          }
        ],
        concatPhone: [
          {
            required: true,
            message: "联系电话不能为空",
            trigger: "blur"
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        city: [
          {
            required: true,
            message: "所在地区不能为空",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "详细地址不能为空",
            trigger: "blur"
          }
        ]
      },
      visible: false,
      confirmLoading: false,
      modalTitle: "",
      listQuery: {
        key: "",
        search: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
        status: "",
        startTime: "",
        endTime: "",
        accountType: ""
      },
      paginationProps: {
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total, range) =>
          `共 ${total} 条记录 第 ${this.listQuery.currentPage} / ${Math.ceil(
            total / this.listQuery.pageSize
          )} 页`,
        onChange: this.quickJump,
        onShowSizeChange: this.onShowSizeChange
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    onChange(value) {
      console.log(value);
      this.form.province = value[0];
      this.form.city = value[1];
      this.form.county = value[2];
      // this.adress = value;
      console.log(this.adress);
    },
    showModal(title, id) {
      this.modalTitle = title;
      this.visible = true;
      this.resetForm();
      if (id) {
        this.getOne(id);
        this.form.id = id;
      }
    },
    // 获取单个信息
    getOne(id) {
      this.$store.dispatch("mangeaddress/getOne", { id }).then((res) => {
        this.form = res.data;
        this.form.province = res.data.province;
        this.form.city = res.data.city;
        this.form.county = res.data.county;
        this.adress = [res.data.province, res.data.city, res.data.county]
        // console.log(this.form);
      });
    },
    // 删除常用地址
    del(id) {
      this.$confirm({
        title: "确定要删除吗?",
        onOk: () => {
          this.$store.dispatch("mangeaddress/del", { ids: id }).then((res) => {
            this.$message.success("删除成功");
            this.getList();
          });
        }
      });
    },
    // 设为默认
    setDefault(id) {
      this.$store.dispatch("mangeaddress/setDefault", { id }).then((res) => {
        this.$message.success("设置默认成功");
        this.getList();
      });
    },
    handleCancel(e) {
      console.log("Clicked cancel button");
      this.visible = false;
    },
    // 编辑地址信息
    editAdress(form) {
      this.$store.dispatch("mangeaddress/edit", form).then((res) => {
        this.$message.success("修改成功");
        this.getList();
        this.visible = false;
      });
    },
    // 保存信息
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.form, "this.form");
          if (this.modalTitle === "编辑地址信息") {
            this.editAdress(this.form);
            return;
          }
          this.$store.dispatch("mangeaddress/add", this.form).then((res) => {
            this.$message.success("添加成功");
            this.resetForm();
            this.getList();
            this.visible = false;
          });
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.adress = ['','',''];
    },
    //查询数据表格
    getList() {
      this.$getList("mangeaddress/getList", this.listQuery).then((res) => {
        console.log(res);
        this.data = [...res.data];
        this.data.sort((a, b) => {
          return b.defaultSign - a.defaultSign;
        });
        this.paginationProps.total = res.data.totalCount * 1;
      });
    },
    //表格分页跳转
    quickJump(currentPage) {
      this.listQuery.currentPage = currentPage;
      this.getList();
    },
    //表格分页切换每页条数
    onShowSizeChange(current, pageSize) {
      this.listQuery.currentPage = current;
      this.listQuery.pageSize = pageSize;
      this.getList();
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
.default {
  margin-left: 10px;
  color: #fff;
  background-color: #02a7f0;
  border-radius: 3px;
  font-size: smaller;
}
.del-btn {
  color: #d9001b;
}
</style>
