// components/progress-bar/progress-bar.js

let movableAreaWidth = 0 //进度条
let movableViewWidth = 0 //进度宽度
// 获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTim: '00:00',
      /*播放时间*/
      totalTime: '00:00',
      /*结束时间*/
    },
      movableDis: 0,
      /*定义x轴方向的偏移*/
      progress: 0,
      /*进度*/
    
  },
  //写生命周期函数
  lifetimes: {
    // 组件渲染完成后执行函数ready()
    ready() {
      this._getMovableDis()
      this._bindBGMEvent()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //获取进度条与进度宽度
    _getMovableDis() {
      //创建原生对象
      const query = this.createSelectorQuery()
      //获取进度条
      //获取进度
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      //事件输出
      query.exec((rect) => {
        // console.log(rect)
        movableAreaWidth = rect[0].width //进度条宽度
        movableViewWidth = rect[1].width //进度宽度
      })
    },
    //绑定对应事件
    _bindBGMEvent() {
      // 监听背景音频播放事件
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay')
      })
      // 监听背景音频停止事件
      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })
      // 监听背景音频暂停事件
      backgroundAudioManager.onPause(() => {
        console.log('onPause')
      })
      // 监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })
      // 监听背景音频进入可播放状态事件。 但不保证后面可以流畅播放
      backgroundAudioManager.onCanplay(() => {
        console.log('onCanplay')
        //音乐总时长
        console.log(backgroundAudioManager.duration)
        if(typeof backgroundAudioManager.duration != 'undefined'){
          //duration已经有值
          this._setTime()
        }else{
          //增加定时器解决拿不到值问题
          setTimeout(()=>{
            //再次获取
            this._setTime()
          },1000)
        }
      })
      // 监听背景音频播放进度更新事件，只有小程序在前台时会回调。
      backgroundAudioManager.onTimeUpdate(() => {
        console.log('onTimeUpdate')
      })
      // 监听背景音频自然播放结束事件
      backgroundAudioManager.onEnded(() => {
        console.log('onEnded')
      })
      // 监听背景音频播放错误事件
      backgroundAudioManager.onError((res) => {
        console.error(res.errMsg)
        console.error(res.errCode)
        wx.showToast({
          title: '错误:' + res.errCode,
        })
      })
    },
    _setTime(){
      //获取当前播放歌曲时间
      const duration = backgroundAudioManager.duration
      const durationFmt = this._dateFormat(duration)
      console.log(durationFmt)
      //给时间赋值
      this.setData({
        //给data里面的对象赋值以中括号的方式
        ['showTime.totalTime']:`${durationFmt.min}:${durationFmt.sec}`
      })
    },
    //格式化时间
    _dateFormat(sec){
      //分
      const min=Math.floor(sec/60)
    // 秒
      sec=Math.floor(sec%60)//由于有小数所以向下取整
      return{
        'min':this._parse0(min),
        'sec':this._parse0(sec)
      }
    },
    //补零操作比如00:00->04:05之类的歌曲时间
    _parse0(sec){
      return sec<10?'0'+sec:sec
    }

  }
})