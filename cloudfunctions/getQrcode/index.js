// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
// 获取小程序码
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
        scene:wxContext.OPENID,
        // page:"index"上线后才能设置
        width:280,
        lineColor: {
           'r': 21,
           'g': 60,
           'b': 200
         },
      })
    // console.log(result)
    // 得到二进制数据
    // 转化成图片
    // 调用云存储
    const upload= await cloud.uploadFile({
      cloudPath:'qrcode/'+Date.now()+'-'+Math.random()+'.png',
      fileContent:result.buffer//二进制数据
    })
    // 返回ID
    return upload.fileID
  } catch (err) {
    console.log(err)
    return err
  }
}