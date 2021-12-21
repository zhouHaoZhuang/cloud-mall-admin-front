<template>
  <div
    v-if="leftOpenShow"
    class="left-menu-container"
    :style="`width:${leftOpen ? '160' : '0'}px;left:${
      menuOpen ? '168' : '64'
    }px`"
  >
    <div v-if="leftOpen" class="wrap">
      <div class="top-title">
        {{ leftMenuData.name }}
      </div>
      <div class="con-list">
        <div
          v-for="(item, index) in menuList"
          :key="item.path"
          class="left-item"
        >
          <div
            :class="selectPath === item.path ? 'name active' : 'name'"
            @click="goTo(item, undefined, index)"
          >
            {{ item.name }}
            <a-icon
              class="icon"
              v-if="item.isTwoMenu && !item.isOpen"
              type="down"
            />
            <a-icon
              class="icon"
              v-if="item.isTwoMenu && item.isOpen"
              type="up"
            />
          </div>
          <div
            v-if="item.isTwoMenu && item.isOpen"
            class="inner-list"
            :style="`height:${item.isOpen ? 'auto' : '0'}px`"
          >
            <div
              v-for="ele in item.children"
              :key="ele.path"
              :class="
                selectPath === ele.path ? 'inner-item active' : 'inner-item'
              "
              @click="goTo(item, ele)"
            >
              {{ ele.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改主题左侧菜单的折叠/打开 -->
    <OpenLeftMenu />
  </div>
</template>

<script>
import { mapState } from "vuex";
import OpenLeftMenu from "@/components/layoutMenu/openLeftMenu";
export default {
  components: {
    OpenLeftMenu
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      menuOpen: (state) => state.setting.menuOpen,
      leftOpen: (state) => state.setting.leftOpen,
      leftMenuData: (state) => state.setting.leftMenuData,
      beforePath: (state) => state.setting.beforePath,
      leftOpenShow: (state) => state.setting.leftOpenShow
    })
  },
  data() {
    return {
      menuList: [],
      selectPath: ""
    };
  },
  watch: {
    leftMenuData: {
      handler(newVal, oldVal) {
        this.menuList =
          newVal.children &&
          newVal.children
            .map((ele, idx) => {
              return {
                ...ele,
                isTwoMenu: ele.children ? true : false,
                isOpen: false
              };
            })
            .filter((ele) => !ele.meta.hiddenMenu);
        this.selectPath = this.menuList && this.menuList[0].path;
      },
      immediate: true,
      deep: true
    }
  },
  created() {},
  methods: {
    // 点击跳转
    goTo(item, ele, index) {
      if (item.isTwoMenu && ele === undefined) {
        // 展开/关闭二级菜单
        this.menuList.splice(index, 1, {
          ...item,
          isOpen: item.isOpen ? false : true
        });
      } else {
        let path = "";
        if (ele && JSON.stringify(ele) !== "{}") {
          path = `${this.beforePath}/${item.path}/${ele.path}`;
          this.selectPath = ele.path;
        } else {
          path = `${this.beforePath}/${item.path}`;
          this.selectPath = item.path;
        }
        if (path !== this.$route.path) {
          this.$router.push(path);
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.left-menu-container {
  height: 100%;
  position: fixed;
  top: 56px;
  background: #f0f3f5;
  border-right: 1px solid #e1e4e6;
  transition: all 0.3s;
  .top-title {
    border-bottom: 1px solid #e1e4e6;
    height: 40px;
    width: 160px;
    line-height: 40px;
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    color: #a0a2a3;
  }
  .con-list {
    color: #262829;
    font-size: 13px;
    .left-item {
      cursor: pointer;
      .name {
        width: 100%;
        height: 48px;
        line-height: 48px;
        padding-left: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .icon {
          margin-right: 24px;
        }
      }
      .inner-list {
        .inner-item {
          height: 48px;
          line-height: 48px;
          background: url("../../assets/img/menu/icon_submenu_prefix.png")
            no-repeat 26px center;
          padding-left: 40px;
          font-size: 12px;
        }
      }
    }
    .name:hover,
    .active,
    .inner-item:hover {
      background-color: #f7f9fa !important;
      color: #00aaff;
    }
  }
}
</style>
