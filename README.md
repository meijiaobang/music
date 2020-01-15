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
  transform:translate(x,y)括号里的值为百分数时，会以目前元素本身的宽高做参考，比如，目前元素本身的宽为100px，高为50px， 那填(50%,50%)，则表示就是向右移动50px、向下移动25px（正百分数），添加负号（负百分数）就是向着相反的方向移动，即左、上
#--自定义属性
data-自定义名称---->在currentTarget.dataset.自定义名称
wx.setStorageSync(唯一标识,数据)把数据存储到本地wx.getStorageSync(唯一标识)
wx.setNavigationBarTitle()导航标题
background-size中的cover会缩放至图片能够铺满整个容器，而contain则是图片会缩放至整个图片都能显示完全，但是容易可能会有留白
transform: rotate(-30deg);设置旋转
transform-origin:99% 99%;设置旋转元素的基点位置
transition:(参数一动画属性如transform,参数二几秒内完成,参数三动画样式)//动画过滤
animation-play-state: paused;让动画暂停在那一刻停下
flex:1;让所有弹性盒模型对象的子元素都有相同的长度，且忽略它们内部的内容
