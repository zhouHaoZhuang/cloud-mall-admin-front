import Router from "vue-router";
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

// 基础路由
export const basicRoute = [
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
// 动态路由
export const asyncRoute = [
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
          perm: "dashboard"
        }
      },
      // 消息中心
      {
        path: "/message",
        name: "消息中心",
        component: () => import("@/views/dashboard/message.vue"),
        meta: {
          hiddenMenu: true,
          perm: "message"
        }
      },
      // 消息中心详情
      {
        path: "/messageInfo",
        name: "消息中心详情",
        component: () => import("@/views/dashboard/messageInfo.vue"),
        meta: {
          hiddenMenu: true,
          perm: "message"
        }
      },
      // 控制台
      {
        path: "/control",
        name: "控制台",
        component: Content,
        meta: {
          perm: "control"
        },
        children: [
          {
            path: "server",
            name: "云服务器",
            component: RouteView,
            meta: {
              icon: "icon-yunfuwuqi",
              perm: "control-cloud"
            },
            children: [
              {
                path: "admin",
                name: "云服务器管理",
                component: () => import("@/views/control/server/serverAdmin"),
                meta: {
                  perm: "control-cloud-manage"
                }
              },
              {
                path: "detail",
                name: "云服务器详情",
                component: () => import("@/views/control/server/serverDetail"),
                meta: {
                  hiddenMenu: true,
                  perm: "control-cloud-manage"
                }
              },
              {
                path: "upgrade",
                name: "云服务器升级",
                component: () => import("@/views/control/server/upgrade"),
                meta: {
                  hiddenMenu: true,
                  perm: "control-cloud-manage"
                }
              }
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
            ]
          }
        ]
      },
      // 用户中心
      {
        path: "/user",
        name: "用户中心",
        component: Content,
        meta: {
          perm: "user"
        },
        children: [
          {
            path: "finance",
            name: "财务中心",
            component: RouteView,
            meta: {
              icon: "icon-caiwu",
              perm: "user-finance"
            },
            children: [
              {
                path: "recharge",
                name: "充值中心",
                component: () => import("@/views/user/finance/recharge/index"),
                meta: {
                  perm: "user-finance-recharge"
                }
              },
              {
                path: "transaction",
                name: "收支明细",
                component: () =>
                  import("@/views/user/finance/transaction/index"),
                meta: {
                  perm: "user-finance-transaction"
                }
              },
              {
                path: "trash",
                name: "订单管理",
                component: () => import("@/views/user/finance/order/index"),
                meta: {
                  perm: "user-finance-order"
                }
              },
              {
                path: "orderDetail",
                name: "订单详情",
                component: () => import("@/views/user/finance/order/detail"),
                meta: {
                  hiddenMenu: true,
                  perm: "user-finance-order"
                }
              },
              {
                path: "refund",
                name: "退款管理",
                component: RouteView,
                meta: {
                  perm: "user-finance-refund"
                },
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
                    meta: {
                      perm: "user-finance-refund-record"
                    }
                  }
                ]
              }
              // {
              //   path: "withdraw",
              //   name: "提现申请",
              //   component: () => import("@/views/user/finance/withdraw"),
              //   meta: {
              //     // hiddenMenu: true,
              //        perm: "user-finance-withdraw"
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
              perm: "user-renew"
            },
            children: [
              {
                path: "cloud",
                name: "云服务器续费管理",
                component: () => import("@/views/user/renew/cloud/index"),
                meta: {
                  perm: "user-renew-cloudRenew"
                }
              }
            ]
          },
          {
            path: "setting",
            name: "账号设置",
            component: RouteView,
            meta: {
              icon: "icon-zhanghaoquanxianguanli",
              perm: "user-setting"
            },
            children: [
              {
                path: "security",
                name: "安全设置",
                component: () =>
                  import("@/views/user/setting/securitySettings/index.vue"),
                meta: {
                  perm: "user-setting-security"
                }
              },
              {
                path: "changePassword",
                name: "修改密码",
                component: () =>
                  import(
                    "@/views/user/setting/securitySettings/changePassword.vue"
                  ),
                meta: {
                  hiddenMenu: true,
                  perm: "user-setting-changPwd"
                }
              },
              {
                path: "emailBinding",
                name: "邮箱绑定",
                component: () =>
                  import(
                    "@/views/user/setting/securitySettings/emailBinding.vue"
                  ),
                meta: {
                  hiddenMenu: true,
                  perm: "user-setting-email"
                }
              },
              {
                path: "phoneBinding",
                name: "手机绑定",
                component: () =>
                  import(
                    "@/views/user/setting/securitySettings/phoneBinding.vue"
                  ),
                meta: {
                  hiddenMenu: true,
                  perm: "user-setting-phone"
                }
              },
              {
                path: "info",
                name: "基本资料",
                component: () =>
                  import("@/views/user/setting/material/index.vue"),
                meta: {
                  perm: "user-setting-data"
                }
              },
              {
                path: "realname",
                name: "实名认证",
                component: () =>
                  import("@/views/user/setting/verified/realName.vue"),
                meta: {
                  perm: "user-setting-auth"
                }
              },
              {
                path: "personalRealname",
                name: "个人实名认证",
                component: () =>
                  import("@/views/user/setting/verified/index.vue"),
                meta: {
                  hiddenMenu: true,
                  perm: "user-setting-auth"
                }
              },
              {
                path: "enterprise",
                name: "企业实名认证",
                component: () =>
                  import("@/views/user/setting/verified/enterprise.vue"),
                meta: {
                  hiddenMenu: true,
                  perm: "user-setting-auth"
                }
              },
              {
                path: "changerealname",
                name: "变更实名认证",
                component: () =>
                  import("@/views/user/setting/verified/changeVerified.vue"),
                meta: {
                  hiddenMenu: true,
                  perm: "user-setting-auth"
                }
              },
              {
                path: "changephone",
                name: "变更实名认证(修改手机号)",
                component: () =>
                  import("@/views/user/setting/verified/changephone.vue"),
                meta: {
                  hiddenMenu: true,
                  perm: "user-setting-auth"
                }
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
              {
                path: "account",
                name: "子账号管理",
                meta: {
                  icon: "home",
                  perm: "user-setting-account"
                },
                component: () => import("@/views/user/setting/role/account.vue")
              },
              {
                path: "role",
                name: "角色管理",
                component: () => import("@/views/user/setting/role/role.vue"),
                meta: {
                  perm: "user-setting-role"
                }
              },
              {
                path: "relation",
                name: "关联资源",
                component: () =>
                  import("@/views/user/setting/role/relation.vue"),
                meta: {
                  hiddenMenu: true,
                  perm: "user-setting-role"
                }
              }
            ]
          },
          {
            path: "workOrder",
            name: "工单管理",
            component: RouteView,
            meta: {
              icon: "icon-gongdanguanli",
              perm: "user-workOrder"
            },
            children: [
              {
                path: "submit",
                name: "提交工单",
                component: () =>
                  import("@/views/user/workOrder/submit/index.vue"),
                meta: {
                  perm: "user-workOrder-submit"
                }
              },
              {
                path: "my",
                name: "我的工单",
                component: () => import("@/views/user/workOrder/my/index.vue"),
                meta: {
                  perm: "user-workOrder-my"
                }
              },
              {
                path: "detail",
                name: "工单详情",
                component: () => import("@/views/user/workOrder/my/detail.vue"),
                meta: {
                  hiddenMenu: true,
                  perm: "user-workOrder-my"
                }
              },
              {
                path: "comment",
                name: "工单服务评价",
                component: () =>
                  import("@/views/user/workOrder/my/comment.vue"),
                meta: {
                  hiddenMenu: true,
                  perm: "user-workOrder-my"
                }
              }
            ]
          }
        ]
      }
    ]
  }
];

const options = {
  routes: [...basicRoute, ...asyncRoute]
};

// 重置之前的路由
export function resetRouter(router) {
  const newRouter = new Router({
    mode: "history",
    base: "console",
    routes: basicRoute
  });
  router.matcher = newRouter.matcher;
}

export default options;
