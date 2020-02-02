// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 搜索框默认值
    placeholder:{
      type:String,
      value:'请输入关键字...'
    }
  },
  // apply-shared 表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面；
  options: {
    styleIsolation: 'isolated',
  },
// 接收外部样式
externalClasses: [
  'iconfont',
  'icon-sousuo',
],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
