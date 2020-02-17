// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const TcbRouter = require('tcb-router')
const db = cloud.database()
const blogCollection = db.collection('blog')
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  // 获取博客列表
  app.router('list', async (ctx, next) => {
    const keyword = event.keyword
    let w = {}
    if (keyword.trim() != '') { //如果关键字框内容不为空
      w = {
        // 云提供的方法
        content: db.RegExp({
          regexp: keyword, //关键字
          options: 'i' //不分大小写
        })
      }
    }
    let blogList = await blogCollection.where(w).skip(event.start).limit(event.count).orderBy('createTime', 'desc').get().then(res => {
      return res.data
    })
    ctx.body = blogList
  })
  // 博客详情页面
  app.router('detail', async (ctx, next) => {
    let blogId = event.blogId
    // 详情查询
    let detail = await blogCollection.where({ //存储博客详情信息
      _id:blogId
    }).get().then(res => {

      //返回得到的数据
      return res.data
    })
    // 评论查询
    const countResult = await blogCollection.count()
    const total = countResult.total //得到总条数
    let commentList = {
      data: []
    }
    if (total > 0) {
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      // 用来存放异步对象
      const tasks = []
      for (let i = 0; i < batchTimes; i++) {
        let promise = db.collection('blog-comment').skip(i * MAX_LIMIT)
          // 每次取多少条
          .limit(MAX_LIMIT).where({
            // 查询条件
            blogId
          }).orderBy('createTime', 'desc').get()
        tasks.push(promise)
      }
      if (tasks.length > 0) {
 
        // 检测异步对象是否已经完成
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }
    }

    ctx.body = {
      commentList,
      detail
    }
  })
  // 我的发现功能,获取列表
  const wxContent=cloud.getWXContext()
  app.router('getListByOpenid',async(ctx,next)=>{
    // 查询条件
    ctx.body= await blogCollection.where({
      _openid:wxContent.OPENID
    })
    //分页查询
    .skip(event.start)
    // 查询条数
    .limit(event.count)
    // 逆序
    .orderBy('createTime','desc').get().then(res=>{
      return res.data
    })
  })

  return app.serve()
}