// pages/blog-comment/blog-comment.js
// 引入时间格式化组件
import formatTime from '../../utils/formatTime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog: {},//博客内容信息
    commentList: [],//博客评论信息 
    blogId:'',//博客id,因为后面要重用到
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // 保存博客Id
    this.setData({
      blogId:options.blogId
    })
    this._getBlogDetail()
  },
  // 获取博客详情
  _getBlogDetail(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    wx.cloud.callFunction({
      name:'blog',
      data:{
        blogId:this.data.blogId,
        $url:'detail'
      }
    }).then(res=>{
      // 格式化时间
      let commentList=res.result.commentList.data
      for(let i=0,len=commentList.length;i<len;i++){
        // 转换成时间对象格式
        commentList[i].createTime=formatTime(new Date(commentList[i].createTime))
      } 
      this.setData({
        commentList,
        blog: res.result.detail[0],//要进入的博客详情页面
      })
      wx.hideLoading()
      console.log(res)

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
    const blogObj=this.data.blog
    return{
      title:blogObj.content,
      path:`/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
      // imageUrl:''//指定图片URL
    }
  }
})