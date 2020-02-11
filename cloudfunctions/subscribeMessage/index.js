// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID}=cloud.getWXContext()
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: OPENID,
        page: `pages/blog-comment/blog-comment?blogId=${event.blogId}`,
        data: {
          thing3: {
            value: '评价结果'
          },
          thing2: {
            value:event.content
          },
        },
        templateId: 'QmGJ2AaaISJHMG-j2Xi5unfCJXi_yZdih62WTQMUjL8'
      })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}