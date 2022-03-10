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
          hiddenMenu: true,
        },
      },
      // 消息中心
      {
        path: "/message",
        name: "消息中心",
        component: () => import("@/views/dashboard/message.vue"),
        meta: {
          hiddenMenu: true,
        },
      },
      // 消息中心详情
      {
        path: "/messageInfo",
        name: "消息中心详情",
        component: () => import("@/views/dashboard/messageInfo.vue"),
        meta: {
          hiddenMenu: true,
        },
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
              icon: "icon-yunfuwuqi",
            },
            children: [
              {
                path: "admin",
                name: "云服务器管理",
                component: () => import("@/views/control/server/serverAdmin"),
                meta: {},
              },
              {
                path: "detail",
                name: "云服务器详情",
                component: () => import("@/views/control/server/serverDetail"),
                meta: {
                  hiddenMenu: true,
                },
              },
              {
                path: "upgrade",
                name: "云服务器升级",
                component: () => import("@/views/control/server/upgrade"),
                meta: {
                  hiddenMenu: true,
                },
              },
              // {
              //   path: "transfer",
              //   name: "过户",
              //   component: RouteView,
              //   meta: {},
              //   children: [
              //     {
              //       path: "send",
              //       name: "发送",
              //       component: () => import("@/views/control/server/send"),
              //       meta: {}
              //     },
              //     {
              //       path: "receive",
              //       name: "接收",
              //       component: () => import("@/views/control/server/receive"),
              //       meta: {}
              //     }
              //   ]
              // },
              // {
              //   path: "trash",
              //   name: "回收站",
              //   component: () => import("@/views/control/server/trash"),
              //   meta: {}
              // }
            ],
          },
        ],
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
              icon: "icon-caiwu",
            },
            children: [
              {
                path: "recharge",
                name: "充值中心",
                component: () => import("@/views/user/finance/recharge/index"),
                meta: {},
              },
              {
                path: "transaction",
                name: "收支明细",
                component: () =>
                  import("@/views/user/finance/transaction/index"),
                meta: {},
              },
              {
                path: "trash",
                name: "订单管理",
                component: () => import("@/views/user/finance/order/index"),
                meta: {},
              },
              {
                path: "orderDetail",
                name: "订单详情",
                component: () => import("@/views/user/finance/order/detail"),
                meta: {
                  hiddenMenu: true, // 不显示在左侧菜单
                },
              },
              {
                path: "refund",
                name: "退款管理",
                component: RouteView,
                meta: {},
                children: [
                  // {
                  //   path: "apply",
                  //   name: "退款申请",
                  //   component: () =>
                  //     import("@/views/user/finance/refund/apply"),
                  //   meta: {}
                  // },
                  {
                    path: "record",
                    name: "退订记录",
                    component: () =>
                      import("@/views/user/finance/refund/record"),
                    meta: {}
                  }
                ]
              },
              // {
              //   path: "withdraw",
              //   name: "提现申请",
              //   component: () => import("@/views/user/finance/withdraw"),
              //   meta: {
              //     // hiddenMenu: true
              //   }
              // },
            ]
          },
          {
            path: "renew",
            name: "续费管理",
            component: RouteView,
            meta: {
              icon: "icon-xufei",
            },
            children: [
              {
                path: "cloud",
                name: "云服务器续费管理",
                component: () => import("@/views/user/renew/cloud/index"),
                meta: {},
              },
            ],
          },
          {
            path: "setting",
            name: "账号设置",
            component: RouteView,
            meta: {
              icon: "icon-zhanghaoquanxianguanli",
            },
            children: [
              {
                path: "security",
                name: "安全设置",
                component: () =>
                  import("@/views/user/setting/securitySettings/index.vue"),
                meta: {},
              },
              {
                path: "changePassword",
                name: "修改密码",
                component: () =>
                  import(
                    "@/views/user/setting/securitySettings/changePassword.vue"
                  ),
                meta: {
                  hiddenMenu: true, // 不显示在左侧菜单
                },
              },
              {
                path: "emailBinding",
                name: "邮箱绑定",
                component: () =>
                  import(
                    "@/views/user/setting/securitySettings/emailBinding.vue"
                  ),
                meta: {
                  hiddenMenu: true, // 不显示在左侧菜单
                },
              },
              {
                path: "phoneBinding",
                name: "手机绑定",
                component: () =>
                  import(
                    "@/views/user/setting/securitySettings/phoneBinding.vue"
                  ),
                meta: {
                  hiddenMenu: true, // 不显示在左侧菜单
                },
              },
              {
                path: "info",
                name: "基本资料",
                component: () =>
                  import("@/views/user/setting/material/index.vue"),
                meta: {},
              },
              {
                path: "realname",
                name: "实名认证",
                component: () =>
                  import("@/views/user/setting/verified/realName.vue"),
                meta: {},
              },
              {
                path: "personalRealname",
                name: "个人实名认证",
                component: () =>
                  import("@/views/user/setting/verified/index.vue"),
                meta: {
                  hiddenMenu: true, // 不显示在左侧菜单
                },
              },
              {
                path: "enterprise",
                name: "企业实名认证",
                component: () =>
                  import("@/views/user/setting/verified/enterprise.vue"),
                meta: {
                  hiddenMenu: true, // 不显示在左侧菜单
                },
              },
              {
                path: "changerealname",
                name: "变更实名认证",
                component: () =>
                  import("@/views/user/setting/verified/changeVerified.vue"),
                meta: {
                  hiddenMenu: true, // 不显示在左侧菜单
                },
              },
              {
                path: "changephone",
                name: "变更实名认证(修改手机号)",
                component: () =>
                  import("@/views/user/setting/verified/changephone.vue"),
                meta: {
                  hiddenMenu: true, // 不显示在左侧菜单
                },
              },

              // {
              //   path: "address",
              //   name: "常用地址管理",
              //   component: () =>
              //     import("@/views/user/setting/address/index.vue"),
              //   meta: {},
              // },
              // {
              //   path: "message",
              //   name: "短信通知",
              //   component: () =>
              //     import("@/views/user/setting/shortMessage/index.vue"),
              //   meta: {},
              // },
            ],
          },
          {
            path: "workOrder",
            name: "工单管理",
            component: RouteView,
            meta: {
              icon: "icon-gongdanguanli",
            },
            children: [
              {
                path: "submit",
                name: "提交工单",
                component: () =>
                  import("@/views/user/workOrder/submit/index.vue"),
                meta: {},
              },
              {
                path: "my",
                name: "我的工单",
                component: () => import("@/views/user/workOrder/my/index.vue"),
                meta: {},
              },
              {
                path: "detail",
                name: "工单详情",
                component: () => import("@/views/user/workOrder/my/detail.vue"),
                meta: {
                  hiddenMenu: true,
                },
              },
              {
                path: "comment",
                name: "工单服务评价",
                component: () =>
                  import("@/views/user/workOrder/my/comment.vue"),
                meta: {
                  hiddenMenu: true,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/exception",
    name: "exception",
    component: CommonLayout,
    children: [
      {
        path: "not",
        name: "notLogin",
        component: () => import("@/views/exception/notLogin"),
      },
      {
        path: "404",
        name: "404",
        component: () => import("@/views/exception/404"),
      },
    ],
  },
];

export default options;
