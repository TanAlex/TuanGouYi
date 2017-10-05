//var storage = require('../../utils/storage.js');
var storage = require('../../utils/utils.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    only_show_mine : true,
    group_orders:[],


  },
  switchChange: function (e) {
    this.setData({
      only_show_mine: !this.data.only_show_mine
    })
    console.log(this.data.only_show_mine);
    this.fetchData();
  },

  newGroupOrder: function () {
    wx.navigateTo({
      url: "../item_edit/input"
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //this.fetchData();
  },

  onShow: function(){
    this.fetchData();
  },

  onPullDownRefresh: function(){
    wx.stopPullDownRefresh();
    this.fetchData();
  },

  onShareAppMessage: function () {
    return {
      title: '团购易',
      path: 'pages/index/index'
    }
  },

  fetchData: function () {
    var self = this;




    /*
    storage.init();
    storage.queryFreehero(function (data) {
      if (data.status === 400) {
        wx.showModal({
          title: '网络错误',
          content: '数据获取失败，请重新尝试',
          success: function (res) {
            if (res.confirm) {
              self.fetchData();
            }
          }
        });
        return;
      }
      
      var freeheroData = data.data[0].attributes.freehero;
      self.setData({
        freehero: freeheroData
      })
    
    });
    */
    var options = {};
    wx.showToast({
      title: '努力加载中',
      icon: 'loading',
      duration: 9900
    })
    storage.check_and_login(function(){
      var App = getApp();
      if (self.data.only_show_mine) {
        options = {
          sessionId: App.globalData.session_info.sessionId,
          userId: App.globalData.session_info.userId
        }

      }

      storage.list_all(options, function(res){ 
        var App = getApp();
        self.setData({
          group_orders: App.globalData.group_orders
        });
      })
      wx.hideToast();
    })
  }
})