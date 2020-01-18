// components/lyric/lyric.js
let lyricHeight = 0//歌词移动的一个高度
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 接收参数
    isLyricShow:{
      type:Boolean,//类型
      value:false,//默认值,(表示歌词不显示)
    },
    //接收歌词
    lyric:String,
  },
  // 监听
  observers:{
    lyric(lrc){//是否有歌词因为有的是纯音乐
      if(lrc=='暂无歌词'){
        this.setData({
          lrcList:[{
            lrc,//属性名和值,名字一样,简写
            time:0
          }],
          nowLyricIndex:-1
        })
      }else{
        this._parseLyric(lrc)
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],//保存歌词和时间的信息
    nowLyricIndex: 0, // 当前选中的歌词的索引
    scrollTop: 0, // 滚动条滚动的高度(歌词)
  },
  // 定义一个生命周期函数
  lifetimes:{
    ready(){//页面创建完毕
      wx.getSystemInfo({
        success(res){
          //获取当前的系统宽度除以固定宽度750,得到1rpx的大小.64表示自己定的一个大小
          lyricHeight=res.screenWidth / 750 * 64
        },
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 接收参数,(时间)
    update(currentTime){
      // console.log(currentTime)
      let lrcList = this.data.lrcList//存当前歌词
      if (lrcList.length == 0) {//如果歌词没有,无操作
        return
      }
      //如果歌词播放完,歌曲时间没完时
      if(currentTime>lrcList[lrcList.length-1].time){
        if(this.data.nowLyricIndex!=-1){
          this.setData({
            nowLyricIndex:-1,//取消高亮显示
            scrollTop:lrcList.length * lyricHeight//滚动到最后一句
          })
        }
      }
      
      for(let i=0,len=lrcList.length;i<len;i++){
        //如果当前播放的时间小于当前歌词数组里遍历的时间
        if(currentTime<=lrcList[i].time){//时间一样
          this.setData({//对应的歌词行才一样
            nowLyricIndex: i - 1,//高亮选中正在播放的歌词
            //歌词高度移动
            scrollTop: (i - 1) * lyricHeight
          })
          break//已经高亮显示结束本次循环
        }
      }
    },
    _parseLyric(sLyric) {
      let line = sLyric.split('\n')//把歌词分成一行一行的(前面时间后面歌词)
      // console.log(line)
      let _lrcList = []//用来保存时间和歌词
      line.forEach(elem => {
        // 拿到时间
        let time=elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,}))?]/g)
        if(time!=null){
          // console.log(time)
          // 获取歌词
          let lrc=elem.split(time)[1]
          // 把时间分组
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // 把时间转换成对应的，秒
          let time2Seconds =parseInt(timeReg[1]) * 60 +parseInt(timeReg[2]) + parseInt(timeReg[3])/1000
          _lrcList.push({//把时间和歌词压栈
            lrc,//歌词属性和值相等时可简写
            time:time2Seconds//时间
          })
        }
      });
      // 动态赋值,显示到页面上
      this.setData({
        lrcList:_lrcList
      })
    }
  }
})
