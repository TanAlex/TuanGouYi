//var storage = require('../../utils/storage.js');
var storage = require('../../utils/utils.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: [
      {
        'name': '坦克',
        'id': 3,
        'bg': '../../img/role/tank.png'
      },
      {
        'name': '战士',
        'id': 1,
        'bg': '../../img/role/warrior.png'
      },
      {
        'name': '刺客',
        'id': 4,
        'bg': '../../img/role/assassin.png'
      },
      {
        'name': '法师',
        'id': 2,
        'bg': '../../img/role/mage.png'
      },
      {
        'name': '射手',
        'id': 5,
        'bg': '../../img/role/archer.png'
      },
      {
        'name': '辅助',
        'id': 6,
        'bg': '../../img/role/support.png'
      }
    ],
    freehero: [],
    group_orders:[],


  },

  newGroupOrder: function () {
    wx.navigateTo({
      url: "../item_edit/input"
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
    //this.fetchData();
  },

  onShow: function(){
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

    storage.list_all (function(res){ 
      var App = getApp();
      console.log(res);
      App.globalData.group_orders= res.data;

      var group_orders = App.globalData.group_orders;
      console.log("after network call");
      console.log(group_orders);
      for (let i = 0; i < group_orders.length; i++){
        var g = group_orders[i];
        var desc = g.items.map(function (elem) {
          return elem.name;
        }).join(",");
        var new_desc = desc.substr(0,17);
        if (desc != new_desc) {new_desc += ".."}
        group_orders[i].desc = desc
      }

      self.setData({
        group_orders : group_orders
      });
    })
  }
})