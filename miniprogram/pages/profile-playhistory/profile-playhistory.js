// pages/profile-playhistory/profile-playhistory.js
// 取到全局app对象
const app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],//存放播放的歌曲(历史)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 取到值,播放历史
   const playHistory= wx.getStorageSync(app.globalData.openid)
  //  如果是新的用户
   if(playHistory.length==0){
    wx.showModal({
      title: '播放历史为空',
      content: '',
    })
   }else{
    //  将播放历史歌单替换Storage里面存储的歌单
    wx.setStorage({
      data: playHistory,
      key: 'musiclist',
    })
    // 动态添加播放数据
    this.setData({
      musiclist:playHistory
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