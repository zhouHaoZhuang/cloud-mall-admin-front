import moment from "moment";
// 根据listQuery的时间筛选，生成折线图x轴的数据
// 因为根据周期筛选,不同周期有不同的间隔时间
// 自定义+1小时  间隔1分钟 60秒
// 6小时  间隔5分钟 300秒
// 1天  间隔10分钟 600秒
// 7天  间隔15分钟 900秒
// 维护一个间隔的map
const cycleMap = {
  0:60
}
export const getLineChatsXData = (listQuery) => {
  // 根据所选时间+间隔计算得出需要循环多少次得出X轴
  const count =
    (listQuery.cycle === 0 ? 1 : listQuery.cycle * 60 * 60) /
    (listQuery.period * 1);
  const newXData = [];
  for (let index = 0; index < count; index++) {
    if (index === 0) {
      newXData.push(moment(listQuery.startTime).format("YYYY-MM-DD HH:mm"));
    } else {
      const lastNewData = newXData[newXData.length - 1];
      newXData.push(
        moment(lastNewData)
          .add((listQuery.period * 1) / 60, "m")
          .format("YYYY-MM-DD HH:mm")
      );
    }
  }
  return newXData;
};
