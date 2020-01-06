// components/musiclist/musiclist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    playlistid:-1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onserve(event){
      // console.log(event.currentTarget.dataset.playlistid)
      const musicid=event.currentTarget.dataset.playlistid
      this.setData({
        playlistid:musicid
      })
      //跳转
      wx.navigateTo({
        url:`../../pages/player/player?musicId=${musicid}&index=${event.currentTarget.dataset.index}`,
      })
    }
  }
})
