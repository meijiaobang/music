// components/musiclist/musiclist.js
const app=getApp()//引入全局属性

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
    playingId:-1
  },
  
  pageLifetimes: {//组件所在页面的生命周期
      // 页面被展示
    show(){
      const showsum=this.data.playingId
      // 在播放列表没有切换歌曲就返回列表的情况下还要选中此歌曲
      if(showsum!=app.getPlayMusicId()){
        this.setData({//赋值,使当前选中歌曲高亮
          playingId:app.getPlayMusicId()
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onserve(event){
      // console.log(event.currentTarget.dataset.playlistid)
      const musicid=event.currentTarget.dataset.playlistid
      this.setData({
        playingId:musicid
      })
      //跳转
      wx.navigateTo({
        url:`../../pages/player/player?musicId=${musicid}&index=${event.currentTarget.dataset.index}`,
      })
    }
  }
})
