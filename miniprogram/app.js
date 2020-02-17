//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明:
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env:'xyj-8tttu',
        traceUser: true,
      })
    }
    this.getOpenid()
    this.globalData = {
      playingMusicId:-1,//音乐播放id
      openid: -1,//初始化用户openid
    }
  },
  setPlayMusicId(musicId){//设置音乐播放id
    this.globalData.playingMusicId = musicId
  },
  getPlayMusicId(){//返回音乐播放id
    return this.globalData.playingMusicId
  },
  // 获取openid
  getOpenid(){
    wx.cloud.callFunction({
      name:'login'
    }).then(res=>{
      console.log("进1")
      // 保存用户信息到全局数据列表
      const openid=res.result.openid
      this.globalData.openid=openid
      console.log("this.globalData.openid="+this.globalData.openid)
      // 存储本地缓存中指定的 key
      if(wx.getStorageSync(openid)==''){
        wx.setStorageSync(openid,[])
      }
    })
  },
})
