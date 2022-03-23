<template>
  <div>
    <DetailHeader title="发票申请" />
    <div class="title-hint">
      <a-steps :current="current">
        <a-step>
          <template slot="title"> 选择开票明细 </template>
          <div slot="description"></div>
        </a-step>
        <a-step title="选择发票及收货信息" />
      </a-steps>
    </div>
    <!-- 选择开票明细 -->
    <div v-show="current === 0">
      <div class="top-select">
        <a-input
          style="width: 150px; margin-left: 10px"
          placeholder="请输入订单ID"
        />
        <a-date-picker
          style="margin-left: 10px"
          v-model="startValue"
          :disabled-date="disabledStartDate"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="创建开始时间"
          @openChange="handleStartOpenChange"
        />
        --
        <a-date-picker
          v-model="endValue"
          :disabled-date="disabledEndDate"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="创建结束时间"
          :open="endOpen"
          @openChange="handleEndOpenChange"
        />
        <a-button style="margin-left: 10px" type="primary">查询</a-button>
      </div>
      <div>
        <div v-if="arrearsdata.length > 0">
          <p>
            欠票金额：￥20.00
            开票时需要优先冲抵欠票金额（欠票金额包括退款订单、降配订单等）
          </p>
          <a-table
            :row-selection="{
              selectedRowKeys: arrearsselectedRowKeys,
              onChange: arrearsonSelectChange
            }"
            :columns="columns"
            rowKey="id"
            :data-source="arrearsdata"
          >
            <div slot="companyName" slot-scope="text">{{ text }}</div>
            <div slot="action">
              <a-button type="link">申请开票</a-button>
              <a-button type="link">查看详情</a-button>
            </div>
          </a-table>
          <p>可开票金额：￥500.00 有5个订单可以进行开票，已可开票金额为准</p>
        </div>
        <a-table
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange
          }"
          :columns="columns"
          :data-source="data"
          rowKey="id"
        >
          <div slot="companyName" slot-scope="text">
            {{ text }}
          </div>
          <div slot="action">
            <a-button type="link">申请开票</a-button>
            <a-button type="link">查看详情</a-button>
          </div>
        </a-table>
      </div>
      <div style="width: 100%">
        <p style="margin: 20px 0">
          <span>已选择发票金额：</span>
          <b style="color: #02a7f0">￥{{ 500 }}.00</b>
          <span>
            元，您选取了
            {{
              5
            }}条单据开具发票(若选中多条订单，填写开票金额将合并开具到一张票据中)
          </span>
        </p>
        <a-button class="next" type="primary" @click="current = 1">
          下一步
        </a-button>
      </div>
    </div>
    <div v-show="current === 1">
      <div class="table-type">
        <span>*</span>
        请选择发票抬头：
      </div>
      <div>
        <a-table
          :row-selection="{
            selectedRowKeys: selectedRowKeysTitle,
            onChange: onSelectChangeTitle
          }"
          rowKey="id"
          :columns="columnsTitle"
          :data-source="dataTitle"
          :pagination="paginationProps"
        >
          <div slot="issueType" slot-scope="text">
            {{ issueTypeMap[text] }}
          </div>
          <div v-if="text" slot="invoiceType" slot-scope="text">
            {{ invoiceTypeMap[text] }}
          </div>
          <div slot="action" slot-scope="text, record">
            <a-button
              type="link"
              @click="
                $router.push(`/user/finance/bill/addBillInfo?id=${record.id}`)
              "
            >
              编辑
            </a-button>
          </div>
        </a-table>
      </div>
      <a-button
        type="link"
        icon="plus"
        @click="$router.push('/user/finance/bill/addBillInfo')"
        >新增开票信息</a-button
      >
      <div class="table-type">
        <span>*</span>
        请选择收货信息：
      </div>
      <div>
        <a-table
          :row-selection="{
            selectedRowKeys: selectedRowKeysAddress,
            onChange: onSelectChangeAddress
          }"
          :columns="columnsAddress"
          :data-source="dataAddress"
          :pagination="false"
          rowKey="id"
        >
          <div slot="companyName" slot-scope="text">{{ text }}</div>
          <div slot="adress" slot-scope="text, record">
            {{ record.province }}/ {{ record.city }}/
            {{ record.area }}
          </div>
          <div slot="action" slot-scope="text, record">
            <a-button type="link" @click="showModal(record.id)">编辑</a-button>
          </div>
        </a-table>
      </div>
      <a-button
        type="link"
        icon="plus"
        @click="$router.push('/user/finance/bill/manageadress')"
      >
        新增常用地址
      </a-button>
      <div style="text-align: center">
        <a-button type="primary">提交申请</a-button>
        <a-button style="margin-left: 20px" @click="current = 0">
          返回上一步
        </a-button>
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
  </div>
</template>

<script>
import { options } from "@/utils/city";
import DetailHeader from "@/components/Common/detailHeader.vue";

export default {
  components: {
    DetailHeader
  },
  data() {
    return {
      options,
      issueTypeMap: {
        1: "个人",
        2: "企业"
      },
      invoiceTypeMap: {
        1: "增值税普通发票",
        2: "增值税专用发票"
      },
      current: 0,
      startValue: null,
      endValue: null,
      endOpen: false,
      // 选择开票明细
      // 欠票数据
      arrearsdata: [],
      arrearsselectedRowKeys: [],
      // 开票数据
      data: [],
      selectedRowKeys: [], // Check here to configure the default column
      columns: [
        {
          title: "订单ID",
          dataIndex: "orderNo",
        },
        {
          title: "产品名称",
          dataIndex: "bizTypeName"
        },
        {
          title: "可开票金额",
          dataIndex: "canInvoiceAmount"
        },
        {
          title: "订单创建时间",
          dataIndex: "createTime"
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      // 选择发票抬头
      dataTitle: [],
      selectedRowKeysTitle: [], // Check here to configure the default column
      columnsTitle: [
        {
          title: "发票抬头",
          dataIndex: "invoiceTitle",
          scopedSlots: { customRender: "invoiceTitle" }
        },
        {
          title: "开具类型",
          dataIndex: "issueType",
          scopedSlots: { customRender: "issueType" }
        },
        {
          title: "发票类型",
          dataIndex: "invoiceType",
          scopedSlots: { customRender: "invoiceType" }
        },
        {
          title: "税务登记号",
          dataIndex: "registerNo"
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
      },
      // 选择收货信息
      dataAddress: [],
      selectedRowKeysAddress: [], // Check here to configure the default column
      columnsAddress: [
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
      modalTitle: "编辑收货信息",
      visible: false,
      confirmLoading: false,
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
      },
    };
  },
  watch: {
    startValue(val) {
      console.log("startValue", val);
    },
    endValue(val) {
      console.log("endValue", val);
    }
  },
  created() {
    // this.getList();
    this.getDetailsList();
    this.getListTitle();
    this.getListAddress();
    this.getInvoiceAmountList();
  },
  methods: {
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
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
    showModal(id) {
      this.visible = true;
      this.resetForm();
      this.getOne(id);
      this.form.id = id;
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.adress = ["", "", ""];
    },
    // 编辑地址信息
    editAdress(form) {
      this.$store.dispatch("mangeaddress/edit", form).then((res) => {
        this.$message.success("修改成功");
        this.getListAddress();
        this.visible = false;
      });
    },
    onChange(value) {
      console.log(value);
      this.form.province = value[0];
      this.form.city = value[1];
      this.form.county = value[2];
      // this.adress = value;
      console.log(this.adress);
    },
    handleCancel(e) {
      console.log("Clicked cancel button");
      this.visible = false;
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    // 欠票表格多选
    arrearsonSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.arrearsselectedRowKeys = selectedRowKeys;
    },
    // 欠票数据
    getDetailsList() {
      this.$store.dispatch("billlist/getDetails").then((res) => {
        console.log(res,'res');
        this.arrearsdata = [...res.data.list];
      });
    },
    // 开票金额数据
    getInvoiceAmountList() {
      this.$store
        .dispatch("billlist/getInvoiceAmountList", {
          currentPage: 1,
          pageSize: 10
        })
        .then((res) => {
          console.log(res, "开票金额数据");
          this.data = res.data.list;
        });
    },
    // 选择发票抬头
    onSelectChangeTitle(selectedRowKeysTitle) {
      console.log("selectedRowKeysTitle changed: ", selectedRowKeysTitle);
      this.selectedRowKeysTitle = selectedRowKeysTitle;
    },
    // 选择收货信息
    onSelectChangeAddress(selectedRowKeysAddress) {
      console.log("selectedRowKeysAddress changed: ", selectedRowKeysAddress);
      this.selectedRowKeysAddress = selectedRowKeysAddress;
    },
    //查询数据表格（获取开票列表）
    getList() {
      this.$getList("billapply/getList", this.listQuery).then((res) => {
        console.log(res);
        this.data = [...res.data.list];
        this.paginationProps.total = res.data.totalCount * 1;
      });
    },
    // 获取发票抬头列表
    getListTitle() {
      this.$store
        .dispatch("billnews/getList", { currentPage: 1, pageSize: 10 })
        .then((res) => {
          console.log(res);
          this.dataTitle = [...res.data.list];
          this.paginationProps.total = res.data.totalCount * 1;
        });
    },
    // 获取收货信息列表
    getListAddress() {
      this.$getList("mangeaddress/getList", this.listQuery).then((res) => {
        console.log(res);
        this.dataAddress = [...res.data];
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
  width: 80%;
  margin: 30px auto;
}
.top-select {
  margin: 20px 0;
}
.save-btn {
  width: 100px;
  margin-left: calc(50% - 50px);
}
.next {
  width: 120px;
  margin: 0px calc(50% - 60px);
}
.table-type {
  margin: 20px 0;
  span {
    color: #f00;
  }
}
</style>
