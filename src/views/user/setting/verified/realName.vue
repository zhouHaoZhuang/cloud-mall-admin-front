<template>
  <div class="real-name">
    <h2 class="ny-panel-title">实名认证</h2>
    <p>请选择认证方式</p>
    <div class="real-name-img">
      <div @click="goPersonalRealName">
        <img
          width="150px"
          src="@/assets/img/realName/personalRealName.png"
          alt=""
        />
        <p
          v-show="
            userRealInfo.certificationStatus === 0 &&
            userRealInfo.certificationStatus === 2
          "
        >
          已完成企业认证，无需个人认证
        </p>
        <p>
          <span>个人认证</span>
          <span
            v-show="
              userRealInfo.certificationStatus === 1 ||
              userRealInfo.certificationStatus === 3
            "
          >
            已完成
            <img
              style="margin-left: 10px"
              width="16px"
              src="@/assets/img/realName/attestOk.png"
              alt=""
            />
          </span>
        </p>
        <a-button
          class="look-info"
          v-show="
            userRealInfo.certificationStatus === 1 ||
            userRealInfo.certificationStatus === 3
          "
          type="link"
        >
          查看详情
        </a-button>
      </div>
      <div @click="goEnterpriseRealName">
        <img width="150px" src="@/assets/img/realName/enterprise.png" alt="" />
        <p>
          <span>企业认证</span>
          <span
            v-show="
              userRealInfo.certificationStatus === 2 ||
              userRealInfo.certificationStatus === 3
            "
          >
            已完成
            <img
              style="margin-left: 10px"
              width="16px"
              src="@/assets/img/realName/attestOk.png"
              alt=""
            />
          </span>
        </p>
        <a-button
          class="look-info"
          type="link"
          v-show="
            userRealInfo.certificationStatus === 2 ||
            userRealInfo.certificationStatus === 3
          "
        >
          查看详情
        </a-button>
      </div>
    </div>
    <div class="bottom-hint">
      <h3>温馨提示</h3>
      <p>1. 用户可以选择进行个人认证和企业认证</p>
      <p>2. 完成个人认证后，可以选择进行企业认证</p>
      <p>3. 完成企业认证后，无需进行个人认证</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      realNameStatus: 0,
    };
  },
  computed: {
    ...mapState({
      userRealInfo: (state) => state.user.userRealInfo
    })
  },
  created() {
    this.getEnterpriseRealNameInfo();
  },
  methods: {
    // 获取企业实名认证的数据信息
    getEnterpriseRealNameInfo() {
      this.$store.dispatch("user/getEnterpriseRealNameInfo").then((res) => {
        if (!res || !res.data) {
          this.realNameStatus = 0;
          return;
        }
        this.realNameStatus = 1;
      });
    },
    // 跳转个人实名认证页面
    goPersonalRealName(e) {
      if (
        (this.userRealInfo.certificationStatus === 1 ||
          this.userRealInfo.certificationStatus === 3) &&
        e.target.innerText === "查看详情"
      ) {
        this.$router.push("/user/setting/personalRealname");
        return;
      } else if (
        this.userRealInfo.certificationStatus !== 1 &&
        this.userRealInfo.certificationStatus !== 3
      ) {
        if (this.userRealInfo.certificationStatus === 2) {
          this.$message.warning("您已完成企业认证，无需个人认证");
          return;
        }
        this.$router.push("/user/setting/personalRealname");
      }
    },
    // 跳转企业实名认证页面
    goEnterpriseRealName(e) {
      if (
        this.userRealInfo.certificationStatus !== 2 &&
        this.userRealInfo.certificationStatus !== 3
      ) {
        this.$router.push("/user/setting/enterprise");
      }
      if (
        (this.userRealInfo.certificationStatus === 3 ||
          this.userRealInfo.certificationStatus === 2) &&
        e.target.innerText === "查看详情"
      ) {
        this.$router.push("/user/setting/enterprise");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.real-name {
  h2 {
    font-size: 18px;
    font-weight: 550;
    color: #333;
    margin-bottom: 20px;
  }
  .real-name-img {
    width: 100%;
    div {
      width: 363px;
      height: 184px;
      text-align: center;
      border: #dbdbdb dashed 1px;
      margin: 0 auto 20px;
      border-radius: 5px;
      position: relative;
      .look-info {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
  .bottom-hint {
    h3 {
      text-decoration: underline;
      color: #f59a23;
      margin-bottom: 20px;
    }
    p {
      padding-left: 20px;
    }
  }
}
</style>
