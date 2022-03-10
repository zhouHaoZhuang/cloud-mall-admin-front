<template>
  <div class="upload-container">
    <!-- 自定义渲染的图片列表 -->
    <transition-group name="list" class="imgListBox">
      <div class="item" v-for="img in imageList" :key="img.uid">
        <a-avatar
          shape="square"
          :src="img.url"
          style="width: 100%; height: 100%"
        />
        <div class="imgMask">
          <a-icon
            class="icon"
            v-show="showPreview"
            type="eye"
            @click="handlePreview(img)"
          />
          <a-icon class="icon" type="delete" @click="delImg(img)" />
        </div>
      </div>
    </transition-group>
    <!-- 上传按钮 -->
    <a-upload
      :name="name"
      :accept="accept"
      :limit="limit"
      :multiple="multiple"
      :headers="{ ...headers, system: headerSystem }"
      :action="uploadUrl"
      list-type="picture-card"
      :file-list="fileList"
      :showUploadList="false"
      :before-upload="beforeUpload"
      @change="handleImgChange"
    >
      <div v-if="fileList.length < limit">
        <a-icon type="plus" />
        <div class="ant-upload-text">{{ title }}</div>
      </div>
    </a-upload>
    <!-- 预览图片弹窗 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import lrz from "lrz";
import env from "@/config/env";
import {
  base64ToFile,
  getBase64Str,
  getDomainUrl,
  imgUrlToBase64
} from "@/utils/index";
export default {
  props: {
    // 上传提示文字
    title: {
      type: String,
      default: "上传图片"
    },
    // 发送到后台的文件名
    name: {
      type: String,
      default: "file"
    },
    // 可上传的图片数量
    limit: {
      type: Number,
      default: 1
    },
    // 默认图片,可以是字符串，单张图片，也可是数组，多个图片
    defaultFile: {
      type: [Array, String]
    },
    // 是否可弹窗预览
    showPreview: {
      type: Boolean,
      default: true
    },
    // 默认限制只能上传 jpg和png
    accept: {
      type: String,
      default: "image/jpeg,image/png"
    },
    // 兼容多个图片上传地址
    replaceUrl: {
      type: String,
      default: "default"
    },
    // 图片大小限制
    size: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      // 请求头
      headers: {
        domain: getDomainUrl(),
        system: ""
      },
      previewVisible: false,
      previewImage: "",
      imageList: [],
      fileList: []
    };
  },
  computed: {
    // 图片上传地址
    uploadUrl() {
      if (this.replaceUrl === "default") {
        return env.BASE_URL + "/ccOss/uploadFile";
      }
      if (this.replaceUrl === "formService") {
        return env.FORM_BASE_URL + "/oss/uploadFile";
      }
      return env.BASE_URL + "/uploadFile";
    },
    // 返回请求头system的值
    headerSystem() {
      if (this.replaceUrl === "default") {
        return "idc";
      }
      if (this.replaceUrl === "formService") {
        return "fs";
      }
      return "";
    },
    // 是否可多选文件上传
    multiple() {
      return this.limit > 1;
    }
  },
  watch: {
    defaultFile: {
      handler() {
        // console.log("上传组件查看", this.defaultFile);
        if (!this.defaultFile) {
          this.imageList = [];
          this.fileList = [];
          return;
        }
        const newDefaultFile = Array.isArray(this.defaultFile)
          ? this.$clonedeep(this.defaultFile)
          : [this.defaultFile];
        // 将数据处理成upload组件需要的格式
        const newImgList = newDefaultFile.map((item, index) => {
          return {
            uid: -index - 1,
            name: `image${index}.png`,
            status: "done",
            url: item
          };
        });
        this.imageList = this.$clonedeep(newImgList);
        this.fileList = this.$clonedeep(newImgList);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 上传图片前的压缩处理
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        if (
          ["image/jpeg", "image/jpg", "image/png"].indexOf(file.type) === -1
        ) {
          this.$notification.error({
            message: "提示",
            description: "请上传png或者jpg图片",
            duration: 2
          });
          return false;
        }
        const sizeFlag = file.size / 1024 / 1024 < this.size;
        if (!sizeFlag) {
          this.$notification.error({
            message: "提示",
            description: `图片大小不能超过${this.size}M`,
            duration: 2
          });
          return false;
        }
        lrz(file, {
          width: 1920
        }).then((res) => {
          const file = base64ToFile(res.base64, res.origin.name);
          resolve(file);
        });
      });
    },
    // 关闭预览图片
    handleCancel() {
      this.previewVisible = false;
    },
    // 预览图片
    handlePreview(file) {
      this.previewImage = file.url;
      this.previewVisible = true;
    },
    // 上传图片
    handleImgChange(info) {
      const { fileList } = info;
      this.fileList = this.$clonedeep(fileList);
      let successCount = 0;
      fileList.forEach((ele) => {
        if (ele.status === "done") {
          successCount += 1;
        }
      });
      if (successCount === fileList.length) {
        const urlList =
          fileList
            .filter((item) => item.response || item.url)
            .map((item) => item.response?.data || item.url) || [];
        const firstImageUrl =
          urlList.length && urlList.length > 0 ? urlList[0] : "";
        this.imageList = this.$clonedeep(fileList).map((item) => {
          return {
            ...item,
            url: item.url || item.response?.data
          };
        });
        let reqArr = [];
        // 请求多个或单个数据
        urlList.forEach((ele) => {
          reqArr.push(imgUrlToBase64(ele));
        });
        Promise.all(reqArr).then((result) => {
          console.log(result);
          const base64List = result.map((ele) => {
            return {
              ...getBase64Str(ele)
            };
          });
          this.$emit("change", {
            urlList, // 图片列表
            firstImageUrl, // 图片列表第一张图片
            base64List // base64字符串对象数组
          });
        });
      }
    },
    // 删除图片
    delImg(data) {
      const index = this.imageList.findIndex((item) => item.uid === data.uid);
      this.imageList.splice(index, 1);
      this.fileList.splice(index, 1);
      const urlList =
        this.fileList.map((item) => item.response?.data || item.url) || [];
      const firstImageUrl =
        urlList.length && urlList.length > 0 ? urlList[0] : "";

      let reqArr = [];
      // 请求多个或单个数据
      urlList.forEach((ele) => {
        reqArr.push(imgUrlToBase64(ele));
      });
      Promise.all(reqArr).then((result) => {
        const base64List = result.map((ele) => {
          return {
            ...getBase64Str(ele)
          };
        });
        this.$emit("change", {
          urlList, // 图片列表
          firstImageUrl, // 图片列表第一张图片
          base64List // base64字符串对象数组
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.upload-container {
  .imgListBox {
    display: flex;
    width: 600px;
    flex-wrap: wrap;
    .list-enter-active,
    .list-leave-active {
      transition: all 0.5s;
    }
    .list-enter,
    .list-leave-to {
      opacity: 0;
      transform: translateY(30px);
    }
    .item {
      width: 104px;
      height: 104px;
      margin-right: 8px;
      margin-bottom: 8px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      .imgMask {
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0;
        border-radius: 4px;
        position: absolute;
        bottom: 0;
        left: 0;
        transition: all 0.3s;
        display: flex;
        justify-content: center;
        align-items: center;
        .icon {
          font-size: 20px;
          color: #fff;
          margin: 0 3px;
        }
        span {
          color: #fff;
          font-size: 12px;
          cursor: pointer;
        }
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }
    .item:hover .imgMask {
      opacity: 0.5;
    }
  }
}
</style>
