//              ------------ 评论组件---------------
// 存放内容
let userInfo = {} //保存用户信息，头像和昵称
// 初始化云数据库
const db = wx.cloud.database()
Component({
  options: {
    styleIsolation: 'shared'
  },
  lifetimes: {
    ready() {
      // 在组件实例进入页面节点树时执行
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String, // 接收传过来的博客Id

  },

  // 接收外部传过来的样式css类
  externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],
  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false, //是否显示底部授权弹出层
    modalShow: false, //是否显示评论组件
    content: '', //输入评论的内容
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 评论
    onComment() {
      // 判断是否已经授权
      wx.getSetting({
        success: res => {
          // 是否有了授权信息
          if (res.authSetting['scope.userInfo']) {
            // 如果授权过,则获取用户信息
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo //保存用户信息
                // 显示评论弹出层
                this.setData({
                  modalShow: true
                })
              },
            })
          } else {
            // 如果没授权,显示底部弹出授权提示组件
            this.setData({
              loginShow: true,
            })
          }
        },
      })
    },
    // 如果没有授权
    loginsuccess(event) {
      // 保存用户信息
      userInfo = event.datail
      // 授权框消失
      this.setData({
        loginShow: false
      }, () => { //紧接着
        // 显示评论弹出层
        this.setData({
          modalShow: true
        })
      })
    },
    // 授权失败后
    loginfail() {
      wx.showModal({
        title: '授权用户才能进行评价',
        content: '',
      })
    },
    // 输入的内容
    onInput(event) {
      this.setData({
        content: event.detail.value
      })
    },
    // 插入数据库
    onSend() {
      // 得到输入的内容
      let content = this.data.content
      if (content.trim() == '') {
        wx.showModal({
          title: '内容为空',
          content: '',
        })
        return
      }
      wx.showLoading({
        title: '评价中',
        mask: true
      })
      // 插入数据,插入操作在小程序端中完成
      db.collection('blog-comment').add({
        data: {
          content, //内容
          blogId: this.properties.blogId, //父组件传过来的博客ID
          // 用户昵称和头像
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then(res => {
      
        console.log("进1")
        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          modalShow: false, //隐藏评论框
          content: '', //清空评论框内容
        })
      })
        // 表单推送
      wx.requestSubscribeMessage({
        tmplIds:['QmGJ2AaaISJHMG-j2Xi5unfCJXi_yZdih62WTQMUjL8'],
        success:(res)=>{
          console.log("进2")
          if (res.errMsg === 'requestSubscribeMessage:ok') {
            console.log("进3")
            console.log(res)
            wx.cloud.callFunction({
              name: 'subscribeMessage',
              data: {
                content, //内容
                blogId: this.properties.blogId, //父组件传过来的博客ID
              }
            }).then(res => {
              console.log("进3")
              console.log(res)
            })
          }
        }
      })
    },
  
  }
})