// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const TcbRouter = require('tcb-router')
const db= cloud.database()
const blogCollection=db.collection('blog')


// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  // 获取博客列表
  app.router('list', async(ctx, next) => {
    const keyword=event.keyword
    let w={}
    if(keyword.trim()!=''){//如果关键字框内容不为空
      w={
        // 云提供的方法
        content:db.RegExp({
          regexp:keyword,//关键字
          options:'i'//不分大小写
        })
      }
    }
    let blogList = await blogCollection.where(w).skip(event.start).limit(event.count).orderBy('createTime', 'desc').get().then(res=>{
      return res.data
    })
    ctx.body = blogList
  })
  
 return app.serve()
}