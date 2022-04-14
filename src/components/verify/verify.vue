<!--
 * @Description: 自定义验证组件
 * @Author: cuiht
 * @Date: 2020-03-18 14:35:22
 -->
<template>
  <el-dialog
    title="安全验证"
    v-if="dialogVisible"
    :append-to-body="dialogVisible"
    :visible.sync="dialogVisible"
    :close-on-click-modal="!dialogVisible"
    custom-class="verify-dialog"
    :before-close="handleClose"
    @close="close"
  >
    <Verify
      v-if="dialogVisible"
      class="verify"
      @success="success"
      @error="error"
      :type="type"
      :showButton="showButton"
      :codeLength="4"
    ></Verify>
  </el-dialog>
</template>

<script>
import Verify from './baseVerify/base'
export default {
  name: 'verify',
  props: {
    type: {
      type: Number,
      default: 5 //1,2,3,4,5
    }
  },
  components: {
    Verify
  },
  data() {
    return {
      dialogVisible: false,
      showButton: false,
      isSuccess: false
    }
  },
  methods: {
    handleClose(){
      this.dialogVisible = false
    },
    init() {
      let showButtonTypes = [1, 2]
      this.showButton = showButtonTypes.indexOf(this.type) > -1
    },
    open() {
      this.dialogVisible = true
    },
    close() {
      if (this.isSuccess) {
        // this.$notify({
        //   title: '成功',
        //   message: '已完成安全验证！',
        //   type: 'success',
        //   position: 'bottom-right'
        // });
      } else {
        this.$notify({
          title: '警告',
          message: '请完成安全验证！',
          type: 'error',
          position: 'bottom-right'
        })
      }
      this.isSuccess = false
    },
    success() {
      setTimeout(() => {
        this.isSuccess = true
        this.dialogVisible = false
        this.$emit('success')
      }, 500)
    },
    error() {
      this.isSuccess = false
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
::v-deep .verify-dialog {
  width: fit-content;
  height: fit-content;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 0 !important;
  border-radius: 5px;
  overflow: hidden;
  .el-dialog__header {
    padding: 10px;
    height: 45px;
    position: relative;
    .el-dialog__title {
      position: absolute;
      line-height: 25px;
    }
    .el-dialog__headerbtn {
      top: 50%;
      right: 10px;
      transform: translate(0, -50%);
      // i {
      //   color: #fff !important;
      // }
      // &:hover {
      //   i {
      //     color: #f00 !important;
      //   }
      // }
    }
  }
  .el-dialog__body {
    padding: 10px;
    .verify {
      width: fit-content;
      height: fit-content;
      & > div {
        width: fit-content !important;
        height: fit-content !important;
      }
      .verify-bar-area .verify-move-block .verify-icon,
      .verify-img-panel .icon-refresh {
        position: initial;
      }
      .verify-img-panel .verify-refresh {
        border-radius: 100%;
        background-color: rgba(255, 255, 255, 0.6);
      }
      .verify-img-panel {
        background-size: 100% 100% !important;
      }
      .varify-input-code {
        border: 1px solid #ddd;
      }
      .verify-btn {
        margin-top: 0px;
      }
    }
  }
}
</style>
