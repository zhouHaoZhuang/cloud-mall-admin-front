<template>
  <div class="product-container">
    产品与服务
    <div class="product-list">
      <div v-for="(item, key) in listData" :key="key" class="item">
        <div class="title">{{ item.title }}</div>
        <div class="inner-list">
          <div v-for="ele in item.list" :key="ele.name" class="inner-item">
            <icon-font :type="ele.icon"></icon-font>
            {{ ele.name }}
          </div>
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
      menuOpen: (state) => state.setting.menuOpen
    })
  },
  data() {
    return {
      listData: {
        cloud: {
          title: "云计算",
          list: [
            {
              name: "云服务器",
              icon: "icon-server-full",
              path: "/control/server/admin"
            },
            {
              name: "负载均衡",
              icon: "icon-server-full",
              path: "/control/server/admin"
            }
          ]
        },
        web: {
          title: "域名与网站",
          list: [
            {
              name: "云虚拟主机",
              icon: "icon-server-full",
              path: "/control/server/admin"
            }
          ]
        },
        idc: {
          title: "IDC服务",
          list: [
            {
              name: "服务器托管",
              icon: "icon-server-full",
              path: "/control/server/admin"
            }
          ]
        },
        server: {
          title: "备案服务",
          list: [
            {
              name: "网站备案",
              icon: "icon-server-full",
              path: "/control/server/admin"
            }
          ]
        }
      }
    };
  },
  created() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.product-container {
  color: #fff;
  line-height: 56px;
  position: relative;
  padding-right: 50px;
  font-size: 16px;
  border-right: 1px solid #039ce9;
  padding-left: 24px;
  text-indent: 25px;
  background: url("../../../assets/img/menu/header_icon_products.png") no-repeat
    24px center;
  cursor: pointer;
  &::after {
    content: "";
    position: absolute;
    z-index: 10;
    right: 24px;
    top: 50%;
    margin-top: -3px;
    background: url("../../../assets/img/menu/header_icon_drop_arrow.png");
    width: 10px;
    height: 6px;
  }
  &:hover {
    background-color: #0099e5 !important;
    .product-list {
      display: flex;
    }
  }
  .product-list {
    box-sizing: border-box;
    position: absolute;
    top: 56px;
    border: 1px solid #ddd;
    border-top: none;
    background: #fff;
    box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.12);
    font-size: 12px;
    text-indent: 0;
    color: #a0a2a3;
    line-height: 32px;
    text-align: left;
    left: -1px;
    width: 576px;
    padding: 16px 24px 40px 24px;
    display: flex;
    display: none;
    .item {
      width: 128px;
      .title {
        margin-bottom: 8px;
        height: 24px;
        line-height: 24px;
      }
      .inner-list {
        .inner-item {
          display: flex;
          align-items: center;
          i {
            font-size: 18px;
            margin-right: 10px;
          }
          &:hover {
            color: #00aaff;
          }
        }
      }
    }
  }
}
</style>
