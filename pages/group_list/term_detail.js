// term_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    spell: '',
    des: '',
    bg: '',
    avatarUrl:'https://',
    user: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //temporarily set these to some const value
    //to implement in next version
    options = {
      name: " 大家好：",
      spell: "",
      des: 
      "我们是出于兴趣制作了这个小程序，完全是为了方便大家而设计。" +
      "\n\n每个单子都有单价和总价，还有货物分类统计，方便发起者去采购和收款。再也不需要费劲的导入导出Excel和接龙了，当然我们也保留了copy接龙文字的按键 :)" +
      "\n\n只有发起者可以删单、锁单，也就是结算时候不希望别人再加入和修改，锁单之后只有发起者还可以修改，所以就可以放心去卖货散货啦。发起者收款以后修改每个order的‘已付款’就好了，小程序自动计算待付款。方便吧" +
      "\n\n很多时候我们想找团购或是私房菜或是想组织个活动凑份子什么的，这个小程序就是很好的工具。" +
      "\n\n现在为了保护隐私，只有点击link才能看到分享的团购单。没看到分享的链接的人是没法搜索到的。这样就避免不是你转发群的人也来凑热闹" +
      "\n\n但是有的人可能希望被所有人看到，扩大影响力。我们打算在这个 推荐购物群 里为这些群主开个窗口。" +
      "\n\n如果有什么好点子和建议请发： simartar.com@gmail.com",
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/KtJlkpqDVDT6sgXLBTnwWpDdHCwyoS6Ilw4gCjQAvnI1Dun2CaZHMnY32x53zfibLdgSe5hibDggYYq4ibWGHUnzw/0",
      user: "TL"


    }
    this.randomColor();
    this.setData({
      name: options.name,
      spell: options.spell,
      des: options.des,
      avatarUrl: options.avatarUrl,
      user: options.user
    })
  },

  randomColor: function() {
    //var color = ['#96ADC8', '#FFCD46', '#5D4CC7', '#7DCE94', '#F59ABE', '#FF5959', '#4A3E53'];
    var color = ['#96ADC8', '#73a381', '#4A3E53','#ccc7bd'];
    var num = Math.floor(Math.random() * color.length);
    this.setData({
      bg: color[num]
    })
  }
})