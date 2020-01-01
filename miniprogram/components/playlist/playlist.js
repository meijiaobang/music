// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist:{
      type:Object
    }
  },
  observers:{
    //监听playCount的值并保存
   ['playlist.playCount'](count){
     this.setData({
       _count:this._tranNumber(count,2)
     })
   }
  },
  /**
   * 组件的初始数据
   */
  data: {
    //保存人气数额
    _count:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _tranNumber(num,point){
      //定义一个变量来保存数值整数部分
      let numnStr=num.toString().split('.')[0];
      if(numnStr.length<6){
        return numnStr;
      }else if(numnStr.length>=6 && numnStr.length<=8){
        //截取万的整数倍,保留两个小数点(numnStr.length-4),(numnStr.length-4+point)
        let decimal=numnStr.substring(numnStr.length-4,numnStr.length-4+point);
        //
        return parseFloat(parseInt(num/10000)+'.'+decimal)+'万';
      }else if(numnStr.length>8){
        //截取亿的整数倍
        let decimal=numnStr.substring(numnStr.length-8,numnStr.length-8+point);
        return parseFloat(parseInt(num/100000000)+'.'+decimal)+'亿';
      }
    }
  }
})
