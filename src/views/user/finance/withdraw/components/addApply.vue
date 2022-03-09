<!--
 * @Author: your name
 * @Date: 2022-03-09 11:21:48
 * @LastEditTime: 2022-03-09 11:33:32
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \cloud-mall-admin-front\src\views\user\finance\withdraw\components\addApply.vue
-->

<template>
  <div>
    <a-modal
      title="Title"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <p>{{ ModalText }}</p>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    visible: {}
  },
  data() {
    return {
      ModalText: "Content of the modal",
      confirmLoading: false
    };
  },
  methods: {
    handleOk(e) {
      this.ModalText = "The modal will be closed after two seconds";
      this.confirmLoading = true;
      setTimeout(() => {
        // this.visible = false;
        // this.confirmLoading = false;
      }, 2000);
    },
    handleCancel(e) {
      console.log("Clicked cancel button");
    //   this.visible = false;
    }
  }
};
</script>

