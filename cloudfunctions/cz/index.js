// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
//引入require组件库
const rp = require('request-promise');
//云数据库初始化
const db=cloud.database();
//音乐接口
const URL='http://musicapi.xiecheng.live/personaLized';
// 云函数入口函数
exports.main = async (event, context) => {
  
 
}