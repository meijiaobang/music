// 格式化时间组件
// 导出一个方法
module.exports=(date)=>{
  // 建立一个时间格式
  let fmt = 'yyyy-MM-dd hh:mm:ss'
  // 创建时间模型对象,方便用循环来替换
  const o={
    'M+':date.getMonth()+1,//月份
    'd+':date.getDate(),//日
    'h+':date.getHours(),//时
    'm+':date.getMinutes(),//分
    's+':date.getSeconds()//秒
  }
  // 正则检索匹配并赋值
  if(/(y+)/.test(fmt)){
    // 正则表达式匹配的第一个子匹配,把真实年份替换到yyyy里面
    fmt=fmt.replace(RegExp.$1,date.getFullYear())
  }
  // console.log(fmt)
  for(let k in o){//遍历属性
    // 创建正则匹配月时分秒
    if(new RegExp('('+k+')').test(fmt)){//(M+)
      fmt=fmt.replace(RegExp.$1,o[k].toString().length==1?'0'+o[k]:o[k])
    }
  }
  return fmt
}