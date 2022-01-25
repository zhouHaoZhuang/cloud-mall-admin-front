<template>
  <div class="side-menu-container">
    <div v-for="(item, index) in menuList" :key="item.path" class="menu-item">
      <div
        class="menu-title-box"
        :class="menuOpen ? 'menu-title-box' : 'menu-title-box menu-box-hover'"
        @click="changeMenu(index, item)"
      >
        <div v-if="menuOpen" class="title">{{ item.name }}</div>
        <a-icon v-if="item.open" type="caret-down" class="icon" />
        <a-icon v-else type="caret-right" class="icon" />
        <div class="hover-tit">{{ item.name }}</div>
      </div>
      <div
        v-if="item.open"
        class="menu-list"
        :style="`height:${item.open ? 'auto' : '0'}px`"
      >
        <div
          v-for="ele in item.children"
          :key="ele.path"
          :id="selectItemPath === item.path + '/' + ele.path ? 'active' : ''"
          :class="menuOpen ? 'item' : 'item item-hover'"
          :style="`padding-left:${menuOpen ? '24' : '0'}px`"
          @click="goTo(item, ele)"
        >
          <Iconfont
            :class="menuOpen ? 'item-icon item-icon-open' : 'item-icon'"
            :style="`margin-left:${menuOpen ? '24' : '0'}px`"
            :type="ele.meta.icon"
          />
          <div v-if="menuOpen" class="item-title">
            {{ ele.name }}
          </div>
          <div class="hover-tit">{{ ele.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      menuData: (state) => state.setting.menuData,
      menuOpen: (state) => state.setting.menuOpen,
      selectItemPath: (state) => state.setting.selectItemPath,
      filterList: (state) => state.setting.filterList
    })
  },
  watch: {
    $route: {
      handler(newVal) {
        this.menuList = this.menuData.map((ele) => {
          return {
            ...ele,
            open: true
          };
        });
        const routeArr = newVal.path.split("/").slice(1, 3);
        const newOneMenuData = this.menuList.find(
          (ele) => ele.path === "/" + routeArr[0]
        );
        // 最左侧菜单选中项（一级）
        this.$store.dispatch(
          "setting/changeSelectPath",
          "/" + routeArr.join("/")
        );
        // 保存当前路径
        this.$store.dispatch(
          "setting/changeBeforePath",
          "/" + routeArr.join("/")
        );
        // 二级菜单数据
        if (this.filterList.indexOf(newVal.path) === -1) {
          const newTwoMenuData = newOneMenuData.children.find(
            (ele) => ele.path === routeArr[1]
          );
          this.$store.dispatch("setting/setLeftMenu", newTwoMenuData);
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      menuList: []
    };
  },
  methods: {
    // 展开/关闭菜单
    changeMenu(index, item) {
      console.log(index, item);
      this.menuList.splice(index, 1, {
        ...item,
        open: item.open ? false : true
      });
    },
    // 菜单跳转
    goTo(item, ele) {
      const path = item.path + "/" + ele.path + "/" + ele.children[0].path;
      if (path !== this.$route.path) {
        this.$router.push(path);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.side-menu-container {
  flex: 1;
  background-color: #2d3438;
  color: #fff;
  .menu-item {
    background-color: #2d3438;
    font-size: 12px;
    color: #879399;
    cursor: pointer;
    .menu-title-box {
      display: flex;
      align-items: center;
      position: relative;
      height: 40px;
      background: #3d4448;
      .title {
        margin-left: 24px;
      }
      .icon {
        position: absolute;
        width: 10px;
        height: 6px;
        top: 50%;
        right: 27px;
        transform: translateY(-50%);
        margin-top: -3px;
        color: #999;
        font-size: 14px;
      }
    }
    .hover-tit {
      display: none;
      width: 114px;
      height: 32px;
      padding-left: 16px;
      line-height: 32px;
      background: #2d3438;
      color: #fff;
      text-align: left;
      font-size: 14px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: -128px;
      z-index: 9;
      &::before {
        content: "";
        position: absolute;
        left: -12px;
        top: 50%;
        border: 6px solid transparent;
        margin-top: -6px;
        border-right-color: #2d3438;
      }
    }
    .menu-list {
      // overflow: hidden;
      transition: height 0.5s;
      .item {
        position: relative;
        width: 100%;
        height: 48px;
        line-height: 47px;
        font-size: 14px;
        color: #fff;
        .item-title {
          width: 120px;
          position: absolute;
          margin-left: 24px;
        }
        .item-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 16px;
          color: #fff;
        }
        .item-icon-open {
          left: 9px;
        }
        &:hover {
          background-color: #00aaff;
        }
      }
      #active {
        background-color: #00aaff;
      }
    }
    .menu-title-box:hover {
      color: #fff;
      i {
        color: #fff;
      }
    }
    .menu-box-hover:hover,
    .item-hover:hover {
      .hover-tit {
        display: block;
      }
    }
  }
}
</style>
