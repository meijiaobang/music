// 封装时间格式化的方法
import formatTime from '../../utils/formatTime.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object, //接收父组件传过来的参数,对象类型
  },
  // 监听博客时间变化,为了格式化时间
  observers: {
    // 监听数据中的对象中的属性用[]   
    ['blog.createTime'](val){//每次数据改变的val值
      if(val){//假设val是存在的
        // 把毫秒转换成当前时间
        this.setData({
          _createTime:formatTime(new Date(val))//把val转换成js里面对应的data形
        })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _createTime: '',//存放格式化完成后的时间
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 博客列表的图片预览
    onPreviewImage(event){
      const ds=event.target.dataset
      wx.previewImage({
        urls:ds.imgs,     //当前预览的图片整个列表id
        current:ds.imgsrc,//当前正在预览的图片的地址
      })
    }
  }
})