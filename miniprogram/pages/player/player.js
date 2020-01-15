// pages/player/player.js
let musiclist = []
//当前正在播放的曲子
let nowPlayingIndex = 0
// 获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false, //用来做为播放的一个标志
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
    //加载下一首时先暂停当前播放的歌曲
    backgroundAudioManager.stop()
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
      // 音乐地址
      backgroundAudioManager.src = result.data[0].url
      backgroundAudioManager.title = music.name
      // 封面图 URL，用于做原生音频播放器背景图。原生音频播放器中的分享功能，分享出去的卡片配图及背景也将使用该图
      backgroundAudioManager.coverImgUrl = music.al.picUrl
      backgroundAudioManager.singer = music.ar[0].name
      // 专辑名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值
      backgroundAudioManager.epname = music.al.name
      this.setData({
        isPlaying: true, //是播放的
      })
      wx.hideLoading()
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