// pages/playlist/playlist.js
//定义变量保存取数据的总长度
const MAX_LIMIT = 15
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperimgUrl: [{
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ],
    playlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getplaylist()
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
    //1.0下拉刷新
    //清空原来数据
    this.setData({
      playlist: []
    })
    //调用云函数加载数据
    this._getplaylist()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getplaylist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  _getplaylist() {
    //创建动画
    wx.showLoading({
      title: '加载中....',
    })
    //调用云函数
    wx.cloud.callFunction({
      name: 'music',
      data: {
        start: this.data.playlist.length,
        count: MAX_LIMIT,
        $url: 'playlist'
      }
    }).then(res => {
      this.setData({
        //拼接加载数据,从原有的基础上加载新的数据
        playlist: this.data.playlist.concat(res.result.data)
      })
      //停止下拉操作
      wx.stopPullDownRefresh()
      //关闭动画
      wx.hideLoading()
    })
  }
})