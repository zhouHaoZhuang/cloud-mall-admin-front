<template>
  <div class="cloud-monitor-container">
    <!-- 头部筛选 -->
    <div class="header-filter">
      <a-form-model layout="inline" :model="listQuery">
        <a-form-model-item label="周期">
          <a-select
            style="width: 120px"
            v-model="listQuery.cycle"
            @change="setDateTime"
          >
            <a-select-option :value="0"> 自定义 </a-select-option>
            <a-select-option :value="1"> 1小时 </a-select-option>
            <a-select-option :value="6"> 6小时 </a-select-option>
            <a-select-option :value="24"> 1天 </a-select-option>
            <a-select-option :value="168"> 7天 </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item>
          <a-range-picker
            v-model="dateTime"
            :disabled-date="disabledDate"
            :disabled-time="disabledRangeTime"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="['开始时间', '结束时间']"
            @ok="datePickerOnOk"
          />
        </a-form-model-item>
      </a-form-model>
    </div>
    <!-- 主体折线图列表 -->
    <div class="monitor-list">
      <!-- cpu使用率 -->
      <CloudEcharts
        title="CPU使用率"
        lineChartType="cpu"
        yUnit="%"
        tooltipUnit="%"
        :tabsKey="tabsKey"
        :listQuery="listQuery"
      />
      <!-- 内存使用率 -->
      <CloudEcharts
        title="内存使用率"
        lineChartType="memory"
        yUnit="%"
        tooltipUnit="%"
        :tabsKey="tabsKey"
        :listQuery="listQuery"
      />
      <!-- 系统负载 -->
      <CloudEcharts
        title="系统负载"
        lineChartType="systemLoad"
        :tabsKey="tabsKey"
        :listQuery="listQuery"
      />
      <!-- 实例云盘读写BPS -->
      <CloudEcharts
        title="实例云盘读写BPS"
        subTitle="(Byte/s)"
        lineChartType="readBPS"
        yUnit="K"
        tooltipUnit="Byte/s"
        :tabsKey="tabsKey"
        :listQuery="listQuery"
      />
      <!-- 实例云盘IOPS -->
      <CloudEcharts
        title="实例云盘IOPS"
        subTitle="(次/s)"
        lineChartType="cloudDiskIOPS"
        tooltipUnit="次/s"
        :tabsKey="tabsKey"
        :listQuery="listQuery"
      />
      <!-- 云盘使用率/Inode使用率 -->
      <CloudEcharts
        title="云盘使用率/Inode使用率"
        lineChartType="cloudDiskUse"
        yUnit="%"
        tooltipUnit="%"
        :tabsKey="tabsKey"
        :listQuery="listQuery"
      />
      <!-- 公网带宽(bit/s) -->
      <CloudEcharts
        title="公网带宽"
        subTitle="(bit/s)"
        lineChartType="outWidth"
        yUnit="K"
        tooltipUnit="bit/s"
        :tabsKey="tabsKey"
        :listQuery="listQuery"
      />
      <!-- 内网带宽(bit/s) -->
      <CloudEcharts
        title="内网带宽"
        subTitle="(bit/s)"
        lineChartType="innerWidth"
        yUnit="K"
        tooltipUnit="bit/s"
        :tabsKey="tabsKey"
        :listQuery="listQuery"
      />
      <!-- ECS同时连接数(Count) -->
      <CloudEcharts
        title="ECS同时连接数"
        subTitle="(Count)"
        lineChartType="ecsCount"
        :tabsKey="tabsKey"
        :listQuery="listQuery"
        valueKey="Maximum"
      />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import CloudEcharts from "@/components/Cloud/CloudEcharts/index";
export default {
  props: {
    // 实例详情
    detail: {
      type: Object,
      default: () => {}
    },
    tabsKey: {
      type: String,
      default: "1"
    }
  },
  components: {
    CloudEcharts
  },
  data() {
    return {
      dateTime: [],
      // 因为根据周期筛选,不同周期有不同的间隔时间
      // 自定义+1小时  间隔1分钟 60秒
      // 6小时  间隔5分钟 300秒
      // 1天  间隔10分钟 600秒
      // 7天  间隔15分钟 900秒
      // 维护一个间隔的map
      cycleMap: {
        0: 60,
        1: 60,
        6: 300,
        24: 600,
        168: 900
      },
      listQuery: {
        namespace: "acs_ecs_dashboard",
        instanceId: this.detail.instanceId,
        cycle: 1,
        period: "60",
        startTime: moment().subtract(1, "hours").format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment().format("YYYY-MM-DD HH:mm:ss")
      }
    };
  },
  created() {
    this.setDateTime("1");
  },
  methods: {
    // 设置日期选择组件初始时间。
    setDateTime(val) {
      let time = this.listQuery.cycle;
      if (this.listQuery.cycle === 0) {
        time = 1;
      }
      const newTime = [moment().subtract(time, "hours"), moment()];
      this.dateTime = [...newTime];
      this.listQuery.startTime = moment(newTime[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.listQuery.endTime = moment(newTime[1]).format("YYYY-MM-DD HH:mm:ss");
      this.listQuery.period = this.cycleMap[val].toString();
    },
    // 禁用日期--禁用当天之后+当天前一个月所有
    disabledDate(current) {
      return current > moment() || current < moment().subtract(1, "month");
    },
    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    // 禁用时间
    disabledRangeTime(date, type) {
      if (
        type === "end" &&
        moment(date[1]).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
      ) {
        return {
          disabledHours: () =>
            this.range(moment(date[1]).format("HH") * 1 + 1, 60),
          disabledMinutes: () =>
            this.range(moment(date[1]).format("mm") * 1 + 1, 60),
          disabledSeconds: () =>
            this.range(moment(date[1]).format("ss") * 1 + 1, 60)
        };
      }
    },
    // 日期选择
    datePickerOnOk(value) {
      this.listQuery.cycle = 0;
      this.listQuery.startTime = moment(value[0]).format("YYYY-MM-DD HH:mm:ss");
      this.listQuery.endTime = moment(value[1]).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style lang="less" scoped>
.cloud-monitor-container {
  .header-filter {
    margin-bottom: 15px;
  }
  .monitor-list {
    display: flex;
    flex-wrap: wrap;
    > div {
      height: 268px;
      width: 32%;
      background: #fff;
      margin: 0 0 16px;
      border: 1px solid #ebebeb;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.13);
      padding: 0 16px;
      border-radius: 2px;
      margin-right: 16px;
    }
    > div:nth-child(3n) {
      margin-right: 0;
    }
  }
}
</style>
