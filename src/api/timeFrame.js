/**
 * 时间格式化
 * @param {Date} dateVal
 */
function formatTime(dateVal){
  let year = dateVal.getFullYear(),
    month = dateVal.getMonth()+1,
    day = dateVal.getDate()
  if(month < 10 ){
    month = `0${month}`
  }
  if(day < 10){
    day = `0${day}`
  }
  return `${year}/${month}/${day}`
}
/**
 * 批量生成日期函数
 * @param {Date} startTime
 * @param {Date} endTime
 */
export function  generateFun(startTime, endTime){
  let timeStamp = Math.ceil((endTime.getTime()-startTime.getTime())/(1000*60*60*24)),//判断两个日期相差多少天

    timeArr = [];
  for (let index = 1; index <= timeStamp; index++) {
    const element = startTime.setTime((1000*60*60*24) + startTime.getTime())
    timeArr.push(formatTime(new Date(element)))
  }
  return timeArr
}
