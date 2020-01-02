// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
//引入require组件库
const rp = require('request-promise');
//云数据库初始化
const db=cloud.database();
//音乐接口
const URL='http://musicapi.xiecheng.live/personaLized';
const MAX_LIMIT=100;
// 云函数入口函数
exports.main = async (event, context) => {
  //获取云数据库集合
  // const list =await db.collection('playlist').get()//有缺陷，用分次去取解决这个问题
  //1.1首先得到数据库集合的总对象
  const countResult = await db.collection('playlist').count()
  //1.2通过对象countResult属性total得到总的条数
  const total = countResult.total
  //计算要取的总次数
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  //创建空数组保存每次取的数据条数
  const tasks=[]
  //2.1循环查找集合中的数据
  for(let i=0;i<batchTimes;i++){
    //异步查询每100条一次
    let Promise = db.collection('playlist').skip(i*MAX_LIMIT).limit(MAX_LIMIT).get()
    //压栈到tasks数组中
    tasks.push(Promise)
  }
  //list用来保存查找到的数据
  let list={
    data:[]
  }
  //2.2待tasks有数据后
  if(tasks.length>0){
    //待所有异步完成后累加数组并保存到data里面
    list (await Promise.all(tasks)).reduce((acc,cur)=>{
      //所有的任务完成之后迭代数据返回给list
      return {
        data:acc.data.catch(cur.data)
      }
    })
  }
  //发送请求获取服务器新的数据
  const playlist =await rp(URL).then(res=>{
    //将获得的字符串转化成数组
    return JSON.parse(res).result
  })
  //创建空数组来保存新的数据
  const newData=[]
  //双重循环遍历查找新的数据(数组去重)
  for(let i=0,len1=playlist.length;i<len1;i++){
    //定一个标志位用来判断是否遇到重复的数据
    let flag=true
    //循环对比原来的数据库集合
    for(let j=0,len2=list.data.length;j<len2;j++){
      //判断是否有重复的数组
      if(playlist[i].id===list.data[i].id){
        //遇到了重复的数据，修改标志位并结束本次循环
        flag=false
        break
      }
    }
    //如果没有遇到与原来集合重复的
    if(flag){
      //把新的数组压栈
      newData.push(playlist[i])
    }
  }
  // console.log(playlist);
  //循环插入
  for(let i=0,len=newData.length;i<len;i++){
    //1.1拿到云数据库集合playlist
   await db.collection('playlist')
    //1.2插入数据
    .add({
      //创建一个data数组
      data:{
        //取到playlist的所有可遍历属性和值
        ...newData[i],
        //创建一个时间属性记录插入的时间
        createTime:db.serverDate()
      }
    })
    //插入成功回调
    .then(res=>{
      console.log('插入成功');
    })
    .catch(err=>{
      console.log('插入失败');
    })
  }
  return newData.length
}