// pages/blog/plog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow:false,//控制底部菜单是否隐藏显示
  },
  // 发布
  onPublish(){
     // 判断用户是否授权
     wx.getSetting({
      success:(res)=>{
        // console.log(res)
        // 如果授权过scope.userInfo=true
        if (res.authSetting['scope.userInfo']) {//如果已经授权
          // 取到当前用户信息
          wx.getUserInfo({
            success:(res)=>{ 
              // console.log(res)
              this.onLoginSuccess({//调用函数,传过去一个对象
                detail: res.userInfo
              })
            }
          })
        }else{
          this.setData({
            modalShow:true//弹出底部弹出层
          })
        }
      }
     })
  },
  // 成功
  onLoginSuccess(event){//login组件传来userInfo参数
    // console.log(event)
    const detail=event.detail
    wx.navigateTo({//跳转到博客页面把昵称和头像传过去
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  // 失败
  onLoginFail(){
    wx.showModal({
      title:'您未授权',
      content:''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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