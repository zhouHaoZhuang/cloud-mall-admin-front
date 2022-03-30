<template>
  <div class="submit-container">
    <h2 class="verified-title">
      <div v-show="activeKey === 4" class="icon-wrap" @click="activeKey = 1">
        <a-icon type="left" />
      </div>
      <span class="back">提交工单</span>
    </h2>
    <!-- 步骤组件 -->
    <Step :step="activeKey" />
    <div v-show="activeKey === 1">
      <p class="basic-information">技术类问题</p>
      <div class="technique">
        <div
          v-for="item in technologyList"
          :key="item.id"
          class="cont"
          @click="addWorkorder(item.code)"
        >
          <div class="left">
            <img :src="item.icon" alt="" />
          </div>
          <div class="right">
            <p class="title">{{ item.name }}</p>
            <p class="text">{{ item.description }}</p>
          </div>
        </div>
      </div>
      <p class="basic-information">账户和财务类</p>
      <div class="account">
        <div
          v-for="item in accountList"
          :key="item.id"
          class="cont"
          @click="addWorkorder(item.code)"
        >
          <div class="left">
            <img :src="item.icon" alt="" />
          </div>
          <div class="right">
            <p class="title">{{ item.name }}</p>
            <p class="text">{{ item.description }}</p>
          </div>
        </div>
      </div>
      <p class="basic-information">其他咨询类</p>
      <div class="other">
        <div
          v-for="item in otherList"
          :key="item.id"
          class="cont"
          @click="addWorkorder(item.code)"
        >
          <div class="left">
            <img :src="item.icon" alt="" />
          </div>
          <div class="right">
            <p class="title">{{ item.name }}</p>
            <p class="text">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <Add
      :questionCategoryCode="questionCategoryCode"
      :questionCategoryList="questionCategoryList"
      :activeKey="activeKey"
      v-if="activeKey === 4"
      @success="addWorkorderCallBack"
    />
  </div>
</template>

<script>
import Add from "@/views/user/workOrder/submit/add.vue";
import Step from "@/components/WorkOrder/step";
export default {
  components: { Add, Step },
  data() {
    return {
      activeKey: 1,
      questionCategoryCode: undefined,
      questionCategoryList: [],
      technologyList: [],
      accountList: [],
      otherList: []
    };
  },
  created() {
    this.getProblemTypeList();
  },
  methods: {
    // 获取问题类别
    getProblemTypeList() {
      this.$store
        .dispatch("workorder/problemTypeList", {
          currentPage: 1,
          pageSize: 999
        })
        .then((res) => {
          const data = res.data.list;
          const sortArray = (n1, n2) => {
            return n1.sort - n2.sort;
          };
          this.questionCategoryList = data
            .filter((item) => item.status === 1)
            .sort(sortArray);
          // 1: "技术类问题"
          // 2: "账户和财务类"
          // 3: "其他咨询类"
          this.technologyList = data
            .filter(
              (item) => item.classification * 1 === 1 && item.status === 1
            )
            .sort(sortArray);
          this.accountList = data
            .filter(
              (item) => item.classification * 1 === 2 && item.status === 1
            )
            .sort(sortArray);
          this.otherList = data
            .filter(
              (item) => item.classification * 1 === 3 && item.status === 1
            )
            .sort(sortArray);
          console.log(this.technologyList, this.accountList, this.otherList);
        });
    },
    // 跳转提交工单表单页
    addWorkorder(code) {
      this.activeKey = 4;
      this.questionCategoryCode = code;
    },
    // 提交工单成功回调
    addWorkorderCallBack() {
      this.activeKey = 1;
    }
  }
};
</script>

<style lang="less" scoped>
.verified-title {
  margin-bottom: 20px;
  height: 40px;
  line-height: 40px;
  font-size: 22px;
  color: #272829;
  display: flex;
  .icon-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    width: 40px;
    height: 40px;
    color: #bbb;
    font-size: 16px;
    border: 1px solid #ddd;
    cursor: pointer;
  }
  .back {
    vertical-align: middle;
  }
}

.basic-information {
  margin: 36px 0 20px 0;
  color: #0af;
  font-weight: 700;
}
.technique,
.account,
.other {
  display: flex;
  flex-wrap: wrap;
}
.cont {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 31.33%;
  height: 120px;
  border: 1px solid #ccc;
  padding: 0 20px;
  margin-right: 3%;
  margin-bottom: 20px;
  cursor: pointer;
  .left {
    width: 56px;
    height: 56px;
    margin-right: 20px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .right {
    flex: 1;
    .title {
      font-size: 18px;
      color: #262829;
      font-weight: 500;
      margin-top: 10px;
      margin-bottom: 0;
    }
    .text {
      color: #a0a2a3;
      display: -webkit-box; /*将对象转为弹性盒模型展示*/
      -webkit-box-orient: vertical; /*设置弹性盒模型子元素的排列方式*/
      -webkit-line-clamp: 2; /*限制文本行数*/
      overflow: hidden; /*超出隐藏*/
    }
  }
  &:nth-child(3n) {
    margin: 0 0 20px 0;
  }
}
</style>
