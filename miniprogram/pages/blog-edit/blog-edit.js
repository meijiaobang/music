// 输入文字最大的个数
const MAX_WORDS_NUM = 140
// 最大上传图片数量
const MAX_IMG_NUM = 9
// 数据库初始化
const db = wx.cloud.database()
// 用来保存输入的文字内容
let content = ''
// 用户信息
let userInfo={}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0, // 输入的文字个数
    footerBottom: 0, //距离顶部的距离
    images: [], //把已经选择的图片存在数组里面
    selectPhoto: true, // 添加图片元素是否显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // 保存用户信息
    userInfo=options
  },
  onInput(event) {
    console.log(event.detail.value)
    let wordsNum = event.detail.value.length //输入总长度
    if (wordsNum >= MAX_WORDS_NUM) { //如果输入文字超出固定大小
      wordsNum = `最大数字为${MAX_WORDS_NUM}`
    }
    //如果在正常范围内
    this.setData({
      wordsNum
    })
    // 取到输入的内容
    content=event.detail.value
  },
  //获取焦点
  onFocus(event) {
    // console.log(event)
    // 底部随着键盘的高度升高
    this.setData({
      footerBottom: event.detail.height //键盘的高度
    })
  },
  // 失去焦点
  onBlur() {
    this.setData({
      footerBottom: 0 //还原底部距离
    })
  },
  //选择图片
  onChooseImage() {
    // 还能再选择多少张图片
    let max = MAX_IMG_NUM - this.data.images.length //最大张数减去数组长度
    wx.chooseImage({
      count: max, // 还能再选max张图片
      sizeType: ['original', 'compressed'], //初始图,压缩图
      sourceType: ['album', 'camera'],
      success: (res) => { //选择成功以后
        // console.log(res)
        // 追加赋值
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        // 还能不能选择添加图片,减去新的数组元素大小得到
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({ //如果已选满,隐藏加号图标
          selectPhoto: max <= 0 ? false : true
        })
      },
    })
  },
  //删除预选中的图片
  onDelImage(event) {
    let del_array = event.target.dataset.index //当前点击的元素
    //当事件触发时删除数组操作
    this.data.images.splice(del_array, 1) //删除点击的元素
    //删除完成后重新赋值
    this.setData({
      images: this.data.images
    })
    // 判断是否显示加号图片,等于8个就显示
    if (this.data.images.length == MAX_IMG_NUM - 1) { //没有选满
      this.setData({
        selectPhoto: true //显示加号图标
      })
    }
  },
  // 预览中图片的全屏预览
  onPreviewImage(event) {
    wx.previewImage({
      current: event.target.dataset.imgsrc, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  },
  // 发布功能
  send() {
    // 判断是否有文字输入
    if(content.trim()===''){
      wx.showModal({
        title:'内容不能为空',
      })
      return //返回结束
    }
    // 发布过程中可能比较长
    wx.showLoading({
      title: '正在发布...',
      mask:true//是否显示透明蒙层，防止触摸穿透
    })
    let promiseArr = [] //保存promise对象
    // 保存图片id,每上传成功一张保存一张,保存所有fileID
    let fileIds=[]
    // 图片上传,因为每次只能上传一张,上传多张用for循环
    for (let i = 0, len = this.data.images.length; i < len; i++) {
      // 每循环的时候new一个promise对象
      let p = new Promise((resolve, reject) => {
        let item = this.data.images[i] // 得到资源的路径
        let suffix = /\.\w+$/.exec(item)[0] //获取文件扩展名
        wx.cloud.uploadFile({ //上传至云存储空间
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix, //云存储路径,命名限制见文件名命名限制
          filePath: item, //要上传文件资源的路径
          success: (res) => {
            console.log(res.fileID)
            // 保存图片ID
            fileIds=fileIds.concat(res.fileID)
            resolve()
          },
          fail: (err) => {
            console.error(err)
            reject()
          }
        })
      })
      promiseArr.push(p)//添加元素到数组
    }
    // 如果所有的异步成功完成后
    Promise.all(promiseArr).then(res=>{
      db.collection('blog').add({//往集合里面插入数据
        data:{
          ...userInfo,//ES6语法,得到所有属性和属性值
          content,//内容
          img:fileIds,//图片地址
          createTime:db.serverDate()//获取服务器时间,获取客户端时间可能不准确
        }
      }).then(res=>{
        // 隐藏动画
        wx.hideLoading()
        wx.showToast({
          title:'发布成功'
        })
        // 返回blog博客界面,并且刷新
        wx.navigateBack()
        // 取到当前小程序中的界面
        const pages=getCurrentPages()
        // [pages.length - 2]表示取到上一个页面
        const prevPage=pages[pages.length - 2]
         // 调用页面下拉刷新功能
         prevPage.onPullDownRefresh()
      })
    }).catch(err=>{
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
      })
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

  }
})