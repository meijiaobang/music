// 博客列表

let keyword = ''// 搜索的关键字
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false, //控制底部菜单是否隐藏显示
    blogList: [], //存放博客列表
  },
  // 发布
  onPublish() {
    // 判断用户是否授权
    wx.getSetting({
      success: (res) => {
        // console.log(res)
        // 如果授权过scope.userInfo=true
        if (res.authSetting['scope.userInfo']) { //如果已经授权
          // 取到当前用户信息
          wx.getUserInfo({
            success: (res) => {
              // console.log(res)
              this.onLoginSuccess({ //调用函数,传过去一个对象
                detail: res.userInfo
              })
            }
          })
        } else {
          this.setData({
            modalShow: true //弹出底部弹出层
          })
        }
      }
    })
  },
  // 成功
  onLoginSuccess(event) { //login组件传来userInfo参数
    // console.log(event)
    const detail = event.detail
    wx.navigateTo({ //跳转到博客页面把昵称和头像传过去
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  // 失败
  onLoginFail() {
    wx.showModal({
      title: '您未授权',
      content: ''
    })
  },
  // 模糊搜索功能
  onSearch(event){
    console.log(event.detail.keyword)
    // 搜索获取新数据之前先清空
    this.setData({
      blogList:[]
    })
    // 保存输入的关键字
    keyword=event.detail.keyword
    // 调用云函数
    this._loadBlogList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()
  },
  // 获取博客信息
  _loadBlogList(start=0) {
    wx.showLoading({
      title: '正在加载...',
    })
    wx.cloud.callFunction({ //调用云函数
      name: 'blog',//云函数名称
      data: {
        keyword,//关键字
        start,//开始位置条数
        $url: 'list',//云函数路径名称
        count: 3,//数量
      }
    }).then((res) => {
      // console.log(res)//从数据库得到数据后给博客数组赋值
      this.setData({
        blogList:this.data.blogList.concat(res.result)
      })
      // 隐藏动画
      wx.hideLoading()
      //停止当前页面下拉刷新
      wx.stopPullDownRefresh()
    })
  },
  // 博客详情功能
  goComment(event){
    // 转到博客详情
    wx.navigateTo({
      url: '../../pages/blog-comment/blog-comment?blogId='+event.target.dataset.blogid,
    })
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
    
    this.setData({
       blogList:[],//先清空数据
    })
    this._loadBlogList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom:function () {
    this._loadBlogList(this.data.blogList.length)//参数,作用叠加数据
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    console.log(event)
    let blogObj=event.target.dataset.blog
    return{
      title:blogObj.content,
      path:`/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
      // imageUrl:''
    }
  }
})