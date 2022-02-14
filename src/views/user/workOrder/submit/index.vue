<template>
  <div>
    <h2 class="verified-title">
      <a-icon
        type="left"
        :style="{
          marginRight: '10px',
          width: '40px',
          height: '32px',
          lineHeight: '32px',
          color: '#bbb',
          fontSize: '16px',
          border: '1px solid #ddd'
        }"
        v-show="choose === '4'"
        @click="choose = '1'"
      />
      <span class="back">提交工单</span>
    </h2>
    <!-- 步骤组件 -->
    <Step :step="choose * 1" />
    <div v-show="choose === '1'">
      <p class="basic-information">技术类问题</p>
      <div class="technique">
        <div class="cont" @click="addWorkorder('1')">
          <div class="left"></div>
          <div class="right">
            <p class="title">服务器类问题</p>
            <p class="text">服务器无法连接，PING不通，速度慢等基础网络问题</p>
          </div>
        </div>
      </div>
      <p class="basic-information">账户和财务类</p>
      <div class="account">
        <div class="cont" @click="addWorkorder('2')">
          <div class="left"></div>
          <div class="right">
            <p class="title">财务类问题</p>
            <p class="text">订单、发票、支付、提现、退款、现金券等相关问题</p>
          </div>
        </div>
        <div class="cont" @click="addWorkorder('3')">
          <div class="left"></div>
          <div class="right">
            <p class="title">合同类问题</p>
            <p class="text">合同申请、合同作废、合同信息修改等相关问题</p>
          </div>
        </div>
        <div class="cont" @click="addWorkorder('4')">
          <div class="left"></div>
          <div class="right">
            <p class="title">会员账号问题</p>
            <p class="text">账号激活、换绑资料、找回密码等相关问题</p>
          </div>
        </div>
      </div>
      <p class="basic-information">其他咨询类</p>
      <div class="other">
        <div class="cont" @click="addWorkorder('5')">
          <div class="left"></div>
          <div class="right">
            <p class="title">售前类问题</p>
            <p class="text">产品购买咨询、售前询价等相关问题</p>
          </div>
        </div>
        <div class="cont" @click="addWorkorder('6')">
          <div class="left"></div>
          <div class="right">
            <p class="title">备案类问题</p>
            <p class="text">备案咨询、白名单等相关问题</p>
          </div>
        </div>
        <div class="cont" @click="addWorkorder('7')">
          <div class="left"></div>
          <div class="right">
            <p class="title">商标类问题</p>
            <p class="text">商标注册、商标服务等相关问题</p>
          </div>
        </div>
      </div>
    </div>
    <Add
      :classId="classId"
      :choose="choose"
      v-if="choose === '4'"
      @success="addWorkorderCallBack"
    />
  </div>
</template>

<script>
import Add from "@/views/user/workOrder/submit/add.vue";
import Step from "@/components/Domain/step";
export default {
  components: { Add, Step },
  data() {
    return {
      choose: "1",
      classId: "1"
    };
  },
  methods: {
    addWorkorder(id) {
      this.choose = "4";
      this.classId = id;
    },
    // 提交工单成功回调
    addWorkorderCallBack() {
      this.choose = '1';
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
  .back {
    vertical-align: middle;
  }
}

.basic-information {
  margin: 36px 0 20px 0;
  color: #0af;
  font-weight: 700;
}

.technique {
  .cont {
    .left {
      background: url(../../../../assets/img/management/management1.png)
        no-repeat 0px 0px;
    }
  }
  .cont:hover {
    border: 1px solid #00aaff;
    .left {
      background: url(../../../../assets/img/management/management1.png)
        no-repeat -51px 0px;
    }
  }
}

.account {
  .cont:nth-child(1) {
    .left {
      background: url(../../../../assets/img/management/management2.png)
        no-repeat 0px 0px;
    }
  }
  .cont:nth-child(2) {
    .left {
      background: url(../../../../assets/img/management/management3.png)
        no-repeat 0px 0px;
    }
  }
  .cont:nth-child(3) {
    .left {
      background: url(../../../../assets/img/management/management4.png)
        no-repeat 0px 0px;
    }
  }
  .cont:nth-child(1):hover {
    border: 1px solid #00aaff;
    .left {
      background: url(../../../../assets/img/management/management2.png)
        no-repeat -51px 0px;
    }
  }
  .cont:nth-child(2):hover {
    border: 1px solid #00aaff;
    .left {
      background: url(../../../../assets/img/management/management3.png)
        no-repeat -51px 0px;
    }
  }
  .cont:nth-child(3):hover {
    border: 1px solid #00aaff;
    .left {
      background: url(../../../../assets/img/management/management4.png)
        no-repeat -51px 0px;
    }
  }
}

.other {
  .cont:nth-child(1) {
    .left {
      background: url(../../../../assets/img/management/management5.png)
        no-repeat 0px 0px;
    }
  }
  .cont:nth-child(2) {
    .left {
      background: url(../../../../assets/img/management/management6.png)
        no-repeat 0px 0px;
    }
  }
  .cont:nth-child(3) {
    .left {
      background: url(../../../../assets/img/management/management7.png)
        no-repeat 0px 0px;
    }
  }
  .cont:nth-child(1):hover {
    border: 1px solid #00aaff;
    .left {
      background: url(../../../../assets/img/management/management5.png)
        no-repeat -51px 0px;
    }
  }
  .cont:nth-child(2):hover {
    border: 1px solid #00aaff;
    .left {
      background: url(../../../../assets/img/management/management6.png)
        no-repeat -51px 0px;
    }
  }
  .cont:nth-child(3):hover {
    border: 1px solid #00aaff;
    .left {
      background: url(../../../../assets/img/management/management7.png)
        no-repeat -51px 0px;
    }
  }
}

.cont {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 31%;
  height: 120px;
  border: 1px solid #ccc;
  padding: 0 20px;
  cursor: pointer;
  .left {
    width: 51px;
    height: 56px;
    margin-right: 20px;
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
    }
  }
}

.account {
  display: flex;
  justify-content: space-between;
}

.other {
  display: flex;
  justify-content: space-between;
}
</style>
