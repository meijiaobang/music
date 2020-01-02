// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
 //1.0获取数据库找到集合playlist
 return await cloud.database().collection('playlist')
 //数据多，按分页加载参数start
 .skip(event.start)
 //每次查询的歌单的总数参数count
 .limit(event.count)
 //安倒序的方式加载歌单参数(1.对应的字段,2.排序的顺序)
 .orderBy('createTime','desc')
 .get()
 .then(res=>{
    return res
 })
}