// 控制台-云服务器-状态
export const runningStatusEnum = {
  0: "创建中",
  1: "运行中",
  2: "已停止",
  3: "已过期",
  4: "停止中",
  5: "启动中"
};
// 用于下拉选择的渲染
export const runningStatusSelect = {
  0: "创建中",
  1: "运行中",
  2: "已停止",
  3: "已过期"
};
// 云服务器-购买时长
export const regionEnum = {
  1: "1个月",
  2: "2个月",
  3: "3个月",
  4: "4个月",
  5: "5个月",
  6: "6个月",
  7: "7个月",
  8: "8个月",
  9: "9个月",
  12: "1年",
  24: "2年",
  36: "3年"
};
// 订单状态
export const orderStatusEnum = {
  "-3": "操作服务器异常",
  "-1": "交易关闭",
  1: "待支付",
  3: "支付中",
  5: "交易完成"
};
// 订单来源/用途
export const tradeTypeEnum = {
  1: "云服务新购",
  15: "云服务续费",
  25: "云服务升配",
  35: "云服务降配",
  45: "交易关闭",
  55: "服务器退订"
};
// 创建快照-选择时长-按天
export const snapshotDayEnum = {
  7: "7天",
  10: "10天",
  15: "15天",
  20: "20天",
  30: "30天"
};
// 创建快照-选择时长-按月
export const snapshotMonthEnum = {
  1: "1个月",
  2: "2个月",
  3: "3个月",
  4: "4个月",
  5: "5个月",
  6: "6个月",
  7: "7个月",
  8: "8个月",
  9: "9个月",
  12: "12个月",
  24: "24个月",
  36: "36个月"
};
// 线下汇款审核状态
export const offlineRemittance = {
  0: "待审核",
  1: "待充值",
  2: "未通过审核",
  9: "通过审核"
};
// 发票开票记录状态
export const invoiceStatusEnum = {
  1: "开票中（已提交）",
  2: "已取消",
  3: "审核中",
  4: "已驳回",
  5: "已开票（已通过）",
  6: "退票中（退票申请中）",
  7: "退票申请取消",
  8: "退票申请已拒绝",
  9: "已退票（退票申请确认）"
};
// 收支明细
export const detailsMap = {
  0: "待审核",
  1: "待充值",
  2: "支付失败",
  9: "支付完成"
};
// 地域列表map
export const regionDataEnum = {
  "cn-qingdao": "华北1（青岛）",
  "cn-beijing": "华北2（北京）",
  "cn-zhangjiakou": "华北3（张家口）",
  "cn-huhehaote": "华北5（呼和浩特）",
  "cn-wulanchabu": "华北6（乌兰察布）",
  "cn-hangzhou": "华东1（杭州）",
  "cn-shanghai": "华东2（上海）",
  "cn-shenzhen": "华南1（深圳）",
  "cn-heyuan": "华南2（河源）",
  "cn-guangzhou": "华南3（广州）",
  "cn-chengdu": "西南1（成都）",
  "cn-hongkong": "中国（香港）",
  "ap-northeast-1": "日本（东京）",
  "ap-northeast-2": "韩国（首尔）",
  "ap-southeast-1": "新加坡",
  "ap-southeast-2": "澳大利亚（悉尼）",
  "ap-southeast-3": "马来西亚（吉隆坡）",
  "ap-southeast-6": "菲律宾（马尼拉）",
  "ap-southeast-5": "印度尼西亚（雅加达）",
  "ap-south-1": "印度（孟买）",
  "ap-southeast-7": "泰国（曼谷）",
  "us-east-1": "美国（弗吉尼亚）",
  "us-west-1": "美国（硅谷）",
  "eu-west-1": "英国（伦敦）",
  "me-east-1": "阿联酋（迪拜）",
  "eu-central-1": "德国（法兰克福）"
};

// 验证方式
export const verifyTypeEnum = {
  0: "支付宝芝麻信用认证",
  1: "腾讯云认证"
  // 2: "e签宝认证"
};
// 充值方式map
export const rechargeTypeMap = {
  1: "在线充值",
  2: "线下充值",
  3: "下单",
  4: "退款",
  5: "冻结",
  6: "资金解冻",
  7: "扣除冻结"
};

// 充值状态map数据
export const detailTypeMapData = {
  0: "待支付",
  1: "已取消",
  2: "支付失败",
  9: "支付完成"
};

// 工单状态
export const workOrderStatusEnum = {
  1: "待接单",
  2: "接单处理中",
  3: "处理完成"
};
// 角色类型map
export const roleTypeEnum = {
  0: "系统角色",
  1: "自建角色"
};
//提现申请状态
export const applyStatus = {
  0: "草稿",
  1: "已完成",
  2: "已提交",
  3: "已驳回",
  4: "已取消",
  5: "待处理"
};
// cdn状态map
export const cdnStatusEnum = {
  "-2": {
    dot: "error",
    name: "已下线"
  },
  "-1": {
    dot: "error",
    name: "已下线"
  },
  0: {
    dot: "error",
    name: "校验域名"
  },
  1: {
    dot: "success",
    name: "正常运行"
  },
  2: {
    dot: "error",
    name: "停用"
  },
  3: {
    dot: "processing",
    name: "配置中"
  },
  4: {
    dot: "error",
    name: "配置失败"
  },
  5: {
    dot: "processing",
    name: "正在审核"
  },
  6: {
    dot: "error",
    name: "审核失败"
  }
};
// cdn源站信息类型map
export const cdnTypeEnum = {
  oss: "OSS域名",
  ipaddr: "IP",
  domain: "源站域名"
};
// cdn优先级map
export const cdnPriorityEnum = {
  20: "主",
  30: "备"
};
// 业务类型map
export const businessTypeEnum = {
  web: "图片小文件",
  download: "大文件下载",
  video: "音视频点播"
};
// 加速map
export const scopeAreaEnum = {
  domestic: "仅中国内地",
  global: "全球",
  overseas: "全球（不含中国内地）"
};
// 回源协议类型map
export const sourceProtocolEnum = {
  follow: "跟随",
  http: "HTTP",
  https: "HTTPS"
};
//订单管理中订单类型枚举
export const tradeType = {
  1: "ecs新购",
  15: "ecs实例续费",
  25: "渠道商向资源池(云盾)升级配置订单流程",
  35: "esc实例降低配置",
  45: "交易关闭",
  55: "退订",
  65: "后付费订单"
};
//支付状态枚举
export const payState = {
  0: "待支付",
  3: "支付中",
  "-3": "支付失败",
  5: "完成支付"
};
//时间类型枚举
export const timeType = {
  1: "创建时间",
  2: "支付时间"
};
// 过期时间map
export const overdueTimeEnum = {
  1: "秒",
  60: "分钟",
  3600: "小时",
  86400: "天",
  2592000: "月",
  31104000: "年"
};
// 错误码
export const errorCodeEnum = {
  404: {
    title: "404",
    info: "服务器上不存在的网页时返回此代码"
  },
  400: {
    title: "400",
    info: "您访问的页面请求错误时返回此代码"
  },
  403: {
    title: "403",
    info: "服务器拒绝请求时返回此代码"
  },
  405: {
    title: "405",
    info: "禁用请求中指定的方法时返回此代码"
  },
  414: {
    title: "414",
    info: "请求的URL过长服务器无法处理时返回此代码"
  },
  416: {
    title: "416",
    info: "页面无法提供请求的范围时返回此代码"
  },
  500: {
    title: "500",
    info: "服务器遇到错误无法完成请求时返回此代码"
  },
  501: {
    title: "501",
    info: "服务器不具备完成请求的功能时返回此代码"
  },
  502: {
    title: "502",
    info: "服务器作为网关或代理从上游服务器收到无效响应时返回此代码"
  },
  503: {
    title: "503",
    info: "服务器目前无法使用时返回此代码"
  },
  504: {
    title: "504",
    info: "服务器作为网关或代理无法及时从上游服务器收到请求时返回此代码"
  }
};

export const snapshotType = {
  auto: "自动快照",
  user: "用户快照"
};

export const sourceDiskType ={
  system:'系统盘',
  data:'数据盘'
}
