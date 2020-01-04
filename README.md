#--
if (!wx.cloud)是否使用云开发
traceUser: true记录访问过的用户
this.globalData = {}全局的属性或者方法
"sitemapLocation": "sitemap.json"小程序的内部搜索
"miniprogramRoot": "miniprogram/"前端代码
	"cloudfunctionRoot": "cloudfunctions/"云服务代码
  wx.cloud.callFunction({})调用云函数
  #--swiper属性
  indicator-dots="true"轮播图小点点
  autoplay="true"轮播图是否自动播放 
  interval="2000"多久切换一次 duration="1000"花费时长多久
  #--image属性
  mode="widthFix"宽度不变,高度自动变化
  #--
  observers:{}监听函数
  #--JS---
  parseFloat() 函数可解析一个字符串，并返回一个浮点数。
  promise.all()所有完成之后
  promise.race()有的完成了之后 
  [...'hello']// [ "h", "e", "l", "l", "o" ]扩展运算符还可以将字符串转为真正的数组。
  对象中的扩展运算符(...)用于取出参数对象中的所有可遍历属性，拷贝到当前对象之中
  .count()返回的是对象有->属性   .total记录条数
  #--
  从第几条开始取.skip()指定查询返回结果时从指定序列后的结果开始返回，常用于分页
  .limit(...)取的条数，数量上限
  reduce()对象实例，计算数组元素相加后的总和，说白了就是累加器。
  orderBy()指定查询排序条件
  #--json
  "enablePullDownRefresh":true打开下拉 wx.stopPullDownRefresh()//停止下拉动画
#--css
 filter blur(px)给图像设置高斯模糊
  box-sizing: border-box;对元素指定宽度和高度包括了 padding 和 border 
   align-items: center;居中对齐弹性盒的各项
   font-weight:文本的粗细
   mode="widthFix" 宽度不变，高度自动变化，保持原图宽高比不变。
   flex-grow 属性用于设置或检索弹性盒子的扩展比率 需加width:0
  (overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;)这三个配套使用显示...
  