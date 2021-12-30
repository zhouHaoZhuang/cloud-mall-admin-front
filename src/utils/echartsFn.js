import moment from "moment";
// 根据listQuery的时间筛选，生成折线图x轴的数据
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
