<template>
  <div>
    <DetailHeader title="修改地址" />
    <div class="address-info">
      <a-descriptions style="margin: 30px 0" title="申请信息">
        <a-descriptions-item label="发票ID">
          FP20220314001
        </a-descriptions-item>
        <a-descriptions-item label="开具类型"> 企业 </a-descriptions-item>
        <a-descriptions-item label="发票类型">
          增值税专用发票
        </a-descriptions-item>
        <a-descriptions-item label="发票抬头"> 上海市公司 </a-descriptions-item>
        <a-descriptions-item label="税务登记号">
          910004565465465
        </a-descriptions-item>
        <a-descriptions-item label="申请状态"> 已提交 </a-descriptions-item>
        <a-descriptions-item label="开票金额"> ￥500.00 </a-descriptions-item>
        <a-descriptions-item label="申请时间"> 2016-09-21 </a-descriptions-item>
      </a-descriptions>
      <a-descriptions title="原收件人信息">
        <a-descriptions-item label="收件人"> 王富贵 </a-descriptions-item>
        <a-descriptions-item label="联系电话">
          15000000000000
        </a-descriptions-item>
        <a-descriptions-item label="地址">
          上海市/黄浦区/华新街道/华新路
        </a-descriptions-item>
        <a-descriptions-item label="详细地址"> 上海市虹桥 </a-descriptions-item>
      </a-descriptions>
    </div>
    <div>
      <h3 class="new-adress">选择新的地址</h3>
      <div>
        <a-table
          :row-selection="{
            type: 'radio',
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          :columns="columns"
          :data-source="data"
          :pagination="false"
          rowKey="id"
        >
          <div slot="adress" slot-scope="text, record">
            {{ record.province }}/ {{ record.city }}/
            {{ record.area }}
          </div>
          <div slot="action" slot-scope="text, record">
            <a-button type="link" @click="showModal(record.id)">编辑</a-button>
          </div>
        </a-table>
      </div>
    </div>
    <a-button v-show="data && data.length < 5" type="link" icon="plus">
      新增常用地址
    </a-button>
    <div style="text-align: center; margin-top: 20px">
      <a-button type="primary"> 保存提交 </a-button>
    </div>
    <a-modal
      title="编辑收货地址"
      :visible="visible"
      :centered="true"
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
import DetailHeader from "@/components/Common/detailHeader.vue";
import { options } from "@/utils/city";

export default {
  components: {
    DetailHeader
  },
  data() {
    return {
      data: [],
      options,
      visible: false,
      selectedRowKeys: [],
      columns: [
        {
          title: "收货人",
          dataIndex: "addressee",
          scopedSlots: { customRender: "addressee" }
        },
        {
          title: "联系电话",
          dataIndex: "concatPhone"
        },
        {
          title: "地址",
          key: "adress",
          scopedSlots: { customRender: "adress" }
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
      listQuery: {
        key: "",
        search: "",
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      form: {
        addressee: "",
        concatPhone: "",
        address: "",
        province: "",
        city: "",
        county: ""
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      adress: ["", "", ""],
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
      }
    };
  },
  created() {
    this.getList();
    this.getData();
  },
  methods: {
    // 选择收货信息
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      console.log(selectedRowKeys, "selectedRowKeys");
    },
    handleCancel(e) {
      console.log("Clicked cancel button");
      this.visible = false;
    },
    showModal(id) {
      this.visible = true;
      this.resetForm();
      this.getOne(id);
      this.form.id = id;
    },
    // 获取页面数据
    getData() {
      this.$store
        .dispatch("billapply/getInvoiceInfo", { id: this.$route.query.id })
        .then((res) => {
          console.log(res, "---------");
          // this.data = res.data;
          this.dataDetails = res.data.invoiceEvaluatePage.list;
          // this.paginationProps.total =
          // res.data.invoiceEvaluatePage.totalCount * 1;
        });
    },
    //查询数据表格
    getList() {
      this.$getList("mangeaddress/getList", this.listQuery).then((res) => {
        console.log(res);
        this.data = [...res.data];
      });
    },
    // 编辑地址信息
    editAdress(form) {
      this.$store.dispatch("mangeaddress/edit", form).then((res) => {
        this.$message.success("修改成功");
        this.getList();
        this.visible = false;
      });
    },
    // 获取单个信息
    getOne(id) {
      this.$store.dispatch("mangeaddress/getOne", { id }).then((res) => {
        this.form = res.data;
        this.form.province = res.data.province;
        this.form.city = res.data.city;
        this.form.county = res.data.county;
        this.adress = [res.data.province, res.data.city, res.data.county];
        // console.log(this.form);
      });
    },
    // 保存信息
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.form, "this.form");
          this.editAdress(this.form);
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.adress = ["", "", ""];
    },
    onChange(value) {
      console.log(value);
      this.form.province = value[0];
      this.form.city = value[1];
      this.form.county = value[2];
      // this.adress = value;
      console.log(this.adress);
    }
  }
};
</script>

<style lang="less" scoped>
.address-info {
  margin: 30px 0;
}
.save-btn {
  width: 100px;
  margin-left: calc(50% - 50px);
}
.new-adress {
  margin: 20px 0;
  font-weight: 600;
}
</style>
