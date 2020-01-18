// 云函数入口文件
const cloud = require('wx-server-sdk')
//引入路由中间件
const TcbRouter = require('tcb-router')
//引入request-promise
const rp=require('request-promise')
const BASE_URL='http://musicapi.xiecheng.live'
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
   //1.0new一个TcbRouter路由中间件
   const app = new TcbRouter({
      event
   })
   //1.2只获取一个云函数，暂时不需要全局中间件
   app.router('playlist', async (ctx, next) => {
      //1.0获取数据库找到集合playlist
      ctx.body = await cloud.database().collection('playlist')
         //数据多，按分页加载参数start
         .skip(event.start)
         //每次查询的歌单的总数参数count
         .limit(event.count)
         //安倒序的方式加载歌单参数(1.对应的字段,2.排序的顺序)
         .orderBy('createTime', 'desc')
         .get()
         .then(res => {
            return res
         })
   })
   //歌曲详情信息列表
   app.router('musiclist',async(ctx,next)=>{
      ctx.body = await rp(BASE_URL+'/playlist/detail?id='+parseInt(event.playlistId))
      .then(res=>{
         //把接收回来的字符串传化成对象
         return JSON.parse(res)
      })
   })
   // 播放歌曲
   app.router('musicUrl',async(ctx,next)=>{
      ctx.body = await rp(BASE_URL+`/song/url?id=${event.musicId}`).then(res=>{
         return res
      })
   })
   // 歌词
   app.router('lyric',async(ctx,next)=>{
      ctx.body=await rp(BASE_URL+`/lyric?id=${event.musicId}`).then(res=>{
         return res
      })
   })
   //1.3返回中间件服务器
   return app.serve()
}