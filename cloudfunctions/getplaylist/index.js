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
  //首先获取云数据库集合playlist中的数据
  // const list=await db.collection('playlist').get()//获取有限制
  //解决方案  
  //1.1获取总的数据条数对象count()
  const constResult=await db.collection('playlist').count();
  //1.2获取集合总总数total
  const total=constResult.total;
  //向上取整拿到要取得最多次数
  const batchTimes=Math.ceil(total / MAX_LIMIT);
  

  const playlist = await rp(URL)
    .then((res)=>{
      return JSON.parse(res).result;
    });
    //创建新空数组用来保存新的数据
    const newData=[];
    //判断原集合list和新获取的集合playlist数据是否一致
    for(let i=0,len1=playlist.length;i<len1;i++){
      //创建标志位
      let flag=true;
      for(let j=0,len2=list.data.length;j<len2;j++){
        if(playlist[i].id===list.data[j].id){
          flag=false;
          break;//结束本次循环
        }
      }
      //如果标志位没改变
      if(flag){
        //把新的数据压到newData数组里面
        newData.push(playlist[i]);
      }
    }

    //循环遍历将数据插入到数据库集合中
    for(let i=0,len=newData.length;i<len;i++){
      //取到云数据库集合playlist
      await db.collection('playlist').add({
        //插入数据
        data:{
          //取到playlist里面的每个值
          ...newData[i],
          //获取服务器时间
          createTime:db.serverDate(),
        }
      }).then((res)=>{
        console.log('插入成功');
      }).catch((err)=>{
        console.log('插入失败');
      })
    }
    return newData.length;
}