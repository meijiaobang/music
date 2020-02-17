// pages/player/player.js
// 当前正在播放歌单的数组
let musiclist = []
//当前正在播放的曲子(索引)
let nowPlayingIndex = 0
// 获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
// 创建全局app对象,访问全局属性
  const app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false, //用来做为播放的一个标志
    isLyricShow:false,//当前歌词是否显示
    lyric:'',//保存歌词
    isSame: false, // 表示是否为同一首歌
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    nowPlayingIndex = options.index
    //获取本地缓存的数据
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusiclist(options.musicId)
  },
  //加载歌曲
  _loadMusiclist(musicId) {
    if(musicId == app.getPlayMusicId()){//新旧id是否相同
      this.setData({//修改标志
        isSame:true
      })
    }else{
      this.setData({//修改标志
        isSame:false
      })
    }
    // 如果不是同一首歌曲
    if(!this.data.isSame){
      //加载下一首时先暂停当前播放的歌曲
      backgroundAudioManager.stop()
    }
    
    let music = musiclist[nowPlayingIndex]
    // console.log(music)
    wx.setNavigationBarTitle({
      title: music.name
    })
    //设置背景图片
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false, //首先进来是不播放的
    })
    app.setPlayMusicId(musicId)//调用全局函数设置音乐id
    wx.showLoading({
      title: '加载中...',
    })
    // 跳用云函数
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl'
      }
    }).then(res => {
      // console.log(res)
      // console.log(JSON.parse(res.result))
      const result = JSON.parse(res.result)
      // 如果是vip歌曲
      if(result.data[0].url==null){//数组里面有一个值,如果是null
        // 没有获取到
        wx.showToast({
          title: '暂无权限播放',
        })
        return//结束
      }
      if(!this.data.isSame){// 如果不是同一首歌曲
         // 音乐地址
        backgroundAudioManager.src = result.data[0].url
        backgroundAudioManager.title = music.name
        // 封面图 URL，用于做原生音频播放器背景图。原生音频播放器中的分享功能，分享出去的卡片配图及背景也将使用该图
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name     
        // 专辑名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值
        backgroundAudioManager.epname = music.al.name

        // 保存播放历史
        this.savePlayHistory()
      }
      this.setData({
        isPlaying: true, //是播放的
      })
      wx.hideLoading()
      // 加载歌词
      wx.cloud.callFunction({
        name:'music',
        data:{
          musicId,//属性名和对象名一样简写
          $url:'lyric',
        }
      }).then(res=>{
        // console.log(res)
        let lyric='暂无歌词'//初始值
        const lrc=JSON.parse(res.result).lrc//歌词转换成对象
        if(lrc){//如果这个对象存在
          lyric=lrc.lyric//得到歌词
        }
        //动态赋值
        this.setData({
          lyric,//简写
        })
      })
    })

  },
  //播放按钮
  togglePlaying() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause() //暂停
    } else {
      backgroundAudioManager.play() //播放
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  //上一首
  onPrev() {
    nowPlayingIndex--
    if (nowPlayingIndex < 0) {//是第一首时
      nowPlayingIndex = musiclist.length - 1
    }
    //重新加载新的musiclist[nowPlayingIndex].id歌曲
    this._loadMusiclist(musiclist[nowPlayingIndex].id)
  },
    // 下一首
  onNext() {
    nowPlayingIndex++
    if (nowPlayingIndex === musiclist.length) {//最后一首时
      nowPlayingIndex = 0
    }
    this._loadMusiclist(musiclist[nowPlayingIndex].id)
  },
  // 歌词切换(是否显示)
  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  // timeUpdate被触发的时间处理函数
  timeUpdate(event){
    // 获取组件
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  // 系统控制面板联动
  onPlay() {//当播放时
    this.setData({
      isPlaying: true,
    })
  },
  onPause() {//当暂停时
    this.setData({
      isPlaying: false,
    })
  },
  // 保存播放历史
  savePlayHistory(){
    // 当前正在播放的歌曲
    const music =musiclist[nowPlayingIndex]
    // 本地存储所对应的数组
    const openid = app.globalData.openid
    // 创建标志位
    let bHave=false
    // 取到对应的值
    const history=wx.getStorageSync(openid)
    console.log('history='+history)
    for(let i = 0, len = history.length; i < len; i++){
      // 本地缓存数组的对应索引歌曲是否已经有历史
      if(history[i].id==music.id){
        bHave=true
        break
      }
    }
    // 如果还没进入历史
    if(!bHave){
      // 往数组开头插入数据(使当前播放歌曲进入历史)
      history.unshift(music)
      wx.setStorage({
        data:history,
        key:openid,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})