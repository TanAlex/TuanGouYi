//var storage = require('../../utils/storage.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_index :0,
    group_id: -1,
    group_order: {
      cover_img: "http://",
      id: null,
      items_hash: {}

    }
  },

  newOrder: function () {
    wx.navigateTo({
      url: "../purchase_edit/input?id="+ this.data.group_order.id
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options){
    console.log("hit onShow");
    this.refresh(this.data.group_id);
    
  },

  refresh: function (group_id){  

    var App = getApp();
    var group_orders = App.globalData.group_orders;

    var group_order = App.globalData.get_by_id(group_orders, group_id);

    
    
    console.log( group_order);
    var items_hash = {};
    for (let i = 0; i < group_order.items.length; i++) {
      var item = group_order.items[i];
      items_hash[item.id] = item;
    }
    group_order.items_hash = items_hash;
    this.data.group_order.items_hash = items_hash;
    group_order.cover_img = "http://www.publicdomainpictures.net/pictures/150000/velka/banner-header-tapete-145002399028x.jpg";

    //计算价钱
    var total = 0;
    for (let i = 0; i < group_order.orders.length; i++) {
      var order = group_order.orders[i];
      var sub_total = 0;
      for (let j = 0; j < order.purchases.length; j++) {
        var purchase = order.purchases[j];
        //var item = items_hash[purchase.id];
        //Call this getItemById function instead, 这个handle货物被删的情况
        var item = this.getItemById(purchase.id);
        sub_total += item.price * purchase.amount;
        order.purchases[j].name = item.name;
        order.purchases[j].price = item.price;
        order.purchases[j].sub_total = item.price * purchase.amount;
      }
      order.total = sub_total;
      total += sub_total;
    }
    group_order.total = total;

    this.setData({
      group_order: group_order
    });    
  },



  onLoad: function (options) {
    var self = this;
    this.data.group_id = options.id;
    

    

    //this.refresh(options.id);


    /*
        storage.queryHero(heroid, function(data) {
          var desData = [];
    
          for (var i in data['ming']) {
            var des = data['ming'][i].des;
            var obj = {};
            des = des.replace(/\<p\>/g, '').split('</p>');
    
            for (var j = 0; j < des.length - 1; j++) {
              obj[j] = des[j];
            }
    
            desData.push(obj);
            data['ming'][i].des = desData[i];
          }
    
          self.setData({
            hero: data
          })
    
    
        });
    */
  },

  getItemById(id){
    var item = this.data.group_order.items_hash[id];
    if (typeof item == "undefined"){
      return {name: "货物已不提供", price: 0};
    }else{
      return item;
    }

  },

  onShareAppMessage: function () {
    return {
      title: '【团购详情】' + this.data.hero.hero_name,
      path: 'pages/hero_detail/hero_detail?id=' + this.data.hero.hero_id
    }
  },

  toggleNav: function (event) {
    var index = event.currentTarget.dataset.tabindex;
    this.setData({
      nav_index: index
    });
  },

  toggle: function (event) {
    var skill_id = event.currentTarget.dataset.id,
      skill_arr = this.data.hero.skills;

    var obj = skill_arr.filter(function (el) {
      return el.id == skill_id;
    })[0];

    var index = skill_arr.indexOf(obj);

    this.setData({
      skill_index: index
    });
  }
})