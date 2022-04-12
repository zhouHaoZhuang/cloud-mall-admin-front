<template>
  <a-modal
    :visible="value"
    v-if="value"
    width="630px"
    centered
    title="创建快照"
    wrapClassName="renew-modal-container"
    okText="创建"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="tig">
      <div>
        <a-icon type="info-circle" />
      </div>
      <div>
        创建快照将产生资源费用。
        创建快照时，请勿修改ECS实例状态（停止或重启ECS实例），会导致快照创建失败。
        “已过期”状态下的云盘创建快照时，若已超出过期释放时间，云盘将被释放，创建中的快照也将删除。
        快照创建完成后，您可通过系统事件获取通知。
      </div>
    </div>
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="云盘ID">
        <a-select
          v-model="form.sourceDiskId"
          placeholder="请选择需要创建快照的云盘"
          @change="selectDisk"
        >
          <a-select-option
            v-for="(value, key) in diskData"
            :key="value.diskId"
            :value="value.diskId"
          >
            {{ value.diskId }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="快照名称">
        <a-input v-model="form.snapshotName"></a-input>
        <span style="color: #ccc"
          >快照名称为2-128个字符，快照名不能以auto开头</span
        >
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
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
    // 云盘数据
    diskData: {
      type: Array,
      default: () => []
    },
    // inner Id
    innerId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loading: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      form: {
        snapshotName: "",
        sourceDiskId: ""
      },
      sidkModel: {}
    };
  },
  watch: {
    // value: {
    //   handler(newVal) {
    //     if (newVal) {
    //     }
    //   },
    //   immediate: true
    // }
  },
  activated() {
    this.form = {
      snapshotName: "",
      sourceDiskId: ""
    };
  },
  created() {
    this.form = {};
  },
  methods: {
    // 处理询价和提交续费的参数
    getRequestData() {
      return {
        ...this.form,
        innerInstanceId: this.innerId,
        ...this.sidkModel
      };
    },
    // 关闭弹窗
    handleCancel() {
      this.$emit("changeVisible", false);
       this.form = {}
    },
    // 弹窗提交
    handleOk() {
      this.loading = true;
      this.$store
        .dispatch("snapshoot/add", this.getRequestData())
        .then((res) => {
          this.$message.success("创建成功");
          this.$emit("success");
          this.handleCancel();
          this.form = {}
        })
        .finally(() => {
          this.loading = false;
          //  this.form = {}
        });
    },
    //选择云盘id触发
    selectDisk(val) {
      this.diskData.forEach((ele) => {
        if (val === ele.diskId) {
          console.log(ele);
          this.sidkModel.sourceDiskSize = ele.size;
          this.sidkModel.sourceDiskType = ele.type;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.renew-modal-container {
  background: #fff;
  .tig {
    font-size: 16px;
    width: 90%;
    padding: 20px;
    display: flex;
    justify-content: space-around;
    background-color: lightyellow;
  }
}
</style>
