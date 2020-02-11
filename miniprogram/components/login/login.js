// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: 'shared'
  },
  properties: {
    modalShow:Boolean,//接收页面传来的值
  },
  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGotUserInfo(event){
      console.log(event)
      // 判断userInfo是否存在
      const userInfo = event.detail.userInfo
      if(userInfo){//允许授权
        this.setData({//先把底部弹出层隐藏掉
          modalShow:false
        })
        // 从组件内部去往调用组件的地方传参数这样一个方式
        this.triggerEvent('loginsuccess',userInfo)//往外抛出一个事件
      }else{
        this.triggerEvent('loginfail')
      }
    }
  }
})
