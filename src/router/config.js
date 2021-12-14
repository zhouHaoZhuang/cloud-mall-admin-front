import Default from "@/layouts/default";
import Content from "@/layouts/content";
import RouteView from "@/layouts/routeView";
import CommonLayout from "@/layouts/commonLayout";
// 路由配置
/**
 * hiddenMenu  是否不显示在左侧菜单
 * keepAlive  是否缓存页面
 * icon  菜单图标
 * permission  权限配置
 */
const options = [
  {
    path: "/",
    name: "index",
    component: Default,
    redirect: "/dashboard",
    children: [
      // 总览
      {
        path: "/dashboard",
        name: "总览",
        component: () => import("@/views/dashboard/index"),
        meta: {
          hiddenMenu: true
        }
      },
      // 控制台
      {
        path: "/control",
        name: "控制台",
        component: Content,
        meta: {},
        children: [
          {
            path: "server",
            name: "云服务器",
            component: RouteView,
            meta: {
              icon: require("../assets/img/menu/menu_icon_server.png"),
              iconAct: require("../assets/img/menu/menu_icon_server_active.png")
            },
            children: [
              {
                path: "admin",
                name: "云服务器管理",
                component: () => import("@/views/control/server/serverAdmin"),
                meta: {}
              },
              {
                path: "transfer",
                name: "过户",
                component: RouteView,
                meta: {},
                children: [
                  {
                    path: "send",
                    name: "发送",
                    component: () => import("@/views/control/server/send"),
                    meta: {}
                  },
                  {
                    path: "receive",
                    name: "接收",
                    component: () => import("@/views/control/server/receive"),
                    meta: {}
                  }
                ]
              },
              {
                path: "trash",
                name: "回收站",
                component: () => import("@/views/control/server/trash"),
                meta: {}
              }
            ]
          }
        ]
      },
      // 用户中心
      {
        path: "/user",
        name: "用户中心",
        component: Content,
        meta: {},
        children: [
          {
            path: "finance",
            name: "财务中心",
            component: RouteView,
            meta: {
              icon: require("../assets/img/menu/menu_icon_server.png"),
              iconAct: require("../assets/img/menu/menu_icon_server_active.png")
            },
            children: [
              {
                path: "recharge",
                name: "充值中心",
                component: () => import("@/views/finance/Income/index.vue"),
                meta: {}
              },
              {
                path: "transfer",
                name: "收支明细",
                component: () => import("@/views/finance/Recharge/index.vue"),
                meta: {}
              },
              {
                path: "trash",
                name: "订单管理",
                component: () => import("@/views/finance/order/index.vue"),
                meta: {}
              }
            ]
          },
          {
            path: "renew",
            name: "续费管理",
            component: RouteView,
            meta: {
              icon: require("../assets/img/menu/menu_icon_server.png"),
              iconAct: require("../assets/img/menu/menu_icon_server_active.png")
            },
            children: [
              {
                path: "cloud",
                name: "云服务器",
                component: () => import("@/views/control/server/serverAdmin"),
                meta: {}
              }
            ]
          },
          {
            path: "setting",
            name: "账号设置",
            component: RouteView,
            meta: {
              icon: require("../assets/img/menu/menu_icon_server.png"),
              iconAct: require("../assets/img/menu/menu_icon_server_active.png")
            },
            children: [
              {
                path: "security",
                name: "安全设置",
                component: () => import("@/views/control/server/serverAdmin"),
                meta: {}
              },
              {
                path: "info",
                name: "基本资料",
                component: () => import("@/views/control/server/serverAdmin"),
                meta: {}
              },
              {
                path: "realname",
                name: "实名认证",
                component: () => import("@/views/control/server/serverAdmin"),
                meta: {}
              },
              {
                path: "address",
                name: "常用地址管理",
                component: () => import("@/views/control/server/serverAdmin"),
                meta: {}
              },
              {
                path: "message",
                name: "短信通知",
                component: () => import("@/views/control/server/serverAdmin"),
                meta: {}
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: "/exception",
    name: "exception",
    component: CommonLayout,
    children: [
      {
        path: "not",
        name: "notLogin",
        component: () => import("@/views/exception/notLogin")
      },
      {
        path: "404",
        name: "404",
        component: () => import("@/views/exception/404")
      }
    ]
  }
];

export default options;
