let movableAreaWidth = 0 //进度条宽度
let movableViewWidth = 0 //进度宽度
let currentSec = -1 // 当前的秒数
let duration = 0 // 当前歌曲的总时长，以秒为单位
let isMoving = false // 表示当前进度条是否在拖拽，解决：当进度条拖动时候和updatetime事件有冲突的问题
// 获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 接收isSame值
    isSame:Boolean,//默认值是false可不写
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
    ready(){
      // 如果标志为真与初始值为00:00
      if(this.properties.isSame && this.data.showTime.totalTime=='00:00'){
        // 重新赋值(获取播放时间和总时间)
        this._setTime()
      }
      this._getMovableDis()
      this._bindBGMEvent()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //拖动进度条
    onChange(event) {
      //  1.1当不停的移动的时候先保存值(不显示到界面上)
      if (event.detail.source == 'touch') { //如果是拖动事件时
        //给进度progress赋值(已经拖动到的地方)拖动的一个进度
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
        //给小圆点赋值(偏移了的长度)
        this.data.movableDis = event.detail.x
        isMoving = true
        // console.log("在拖动",isMoving)
      }
    },
    //松开进度条
    onTouchEnd() {
      // 保存当前已经播放的时间
      const currentTimeFmt = this._dateFormat(Math.floor(backgroundAudioManager.currentTime))
      // 1.2移动完后再动态赋值(显示到界面上)
      this.setData({
        progress: this.data.progress, //进度
        movableDis: this.data.movableDis, //小圆点
        //给左边开发时间赋值
        ['showTime.currentTim']: currentTimeFmt.min + ':' + currentTimeFmt.sec
      })
      //让音乐播放时间定为到当前移动的进度位置的时间
      backgroundAudioManager.seek(duration * this.data.progress / 100)
      isMoving = false
      // console.log("放手",isMoving)
    },
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
        isMoving=false//再次赋值,解决小程序的坑
        // 系统自带控制面板联动小程序播放歌曲事件
        this.triggerEvent('musicPlay')//在调用此组件处接收
      })
      // 监听背景音频停止事件
      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })
      // 监听背景音频暂停事件
      backgroundAudioManager.onPause(() => {
        console.log('onPause')
        // 系统自带控制面板联动小程序暂停歌曲事件
        this.triggerEvent('musicPause')//然后在父组件接收
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
        if (typeof backgroundAudioManager.duration != 'undefined') {
          //duration已经有值
          this._setTime()
        } else {
          //增加定时器解决拿不到值问题
          setTimeout(() => {
            //再次获取
            this._setTime()
          }, 1000)
        }
      })
      // 监听背景音频播放进度更新事件，只有小程序在前台时会回调。
      backgroundAudioManager.onTimeUpdate(() => {
        // 优化,判断是否在拖动进度条
        if (!isMoving) {
          // console.log('onTimeUpdate')
          //获取当前已经播放的时间
          const currentTime = backgroundAudioManager.currentTime
          // 获取总时长
          duration = backgroundAudioManager.duration
          // console.log(currentTime)
          //格式化已经播放时间
          const currentTimeFmt = this._dateFormat(currentTime)
          //赋值
          //切割获取整秒部分(为了优化更新进度)
          const sec = currentTime.toString().split('.')[0]
          if (sec != currentSec) { //如果时间不相等,则更新
            // console.log(currentTime)
            this.setData({
              //对播放进度值(白圆圈点)赋值让小圆点移动
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              //对进度线赋值(白线)||progress一百份占有的份数
              progress: currentTime / duration * 100,
              //已播放时间赋值showTime: {currentTim}:
              ['showTime.currentTim']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
            })
            //把当前时间赋值给currentSec
            currentSec = sec
            // 联动歌词
            this.triggerEvent('timeUpdate',{//每次onTimeUpdate函数触发时把时间传递过去,然后在<player>调用此组件位置接收
              currentTime
            })
          }
        }

      })
      // 监听背景音频自然播放结束事件
      backgroundAudioManager.onEnded(() => {
        console.log('onEnded')
        //进入下一首,用到触发函数,musicEnd代表自定义事件名
        this.triggerEvent('musicEnd')
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
    _setTime() {
      //获取当前播放歌曲时间
      duration = backgroundAudioManager.duration
      const durationFmt = this._dateFormat(duration) //格式化
      // console.log(durationFmt)
      //给结束时间赋值
      this.setData({
        //给data里面的对象赋值以中括号的方式
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      })
    },
    //格式化时间
    _dateFormat(sec) {
      //分
      const min = Math.floor(sec / 60)
      // 秒
      sec = Math.floor(sec % 60) //由于有小数所以向下取整
      return {
        'min': this._parse0(min),
        'sec': this._parse0(sec)
      }
    },
    //补零操作比如00:00->04:05之类的歌曲时间
    _parse0(sec) {
      return sec < 10 ? '0' + sec : sec
    }
  }
})