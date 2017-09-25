//var storage = require('../../utils/storage.js');
var storage = require('../../utils/utils.js');

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
  copyClipboard: function(){
    var data = "团购【"+ this.data.group_order.title + "】";
    if (typeof this.data.group_order.description != "undefined"){
      data += "\n" + this.data.group_order.description;
    }
    var items = this.data.group_order.items;
    for (let i = 0; i< items.length; i++){
      var item = items[i];
      var c = i + 1;
      data += "\n"+ c + ") "+ item.name + " 单价:" + item.price;
    }
    for (let j = 0; j < this.data.group_order.orders.length; j++){
      var order = this.data.group_order.orders[j];
      data += "\n参购者: "+ order.user_info.nickName;
      data += "  总价: "+ order.total;
      var purchases = order.purchases;
      for (let i = 0; i < purchases.length; i++) {
        var p = purchases[i];
        var c = i+1;
        data += "\n   " + c + ") " + p.name +": "+ p.amount + " 份";
      }
    }
    data += "\n\n";
    wx.setClipboardData({
      data: data,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '快去接龙吧',
              icon: 'success',
              duration: 1000
            })
            console.log(res.data) 
          }
        })
      }
    })
  },

  ifOrderEditable: function (order) {
    var App = getApp();

    if (typeof order.user_info == "undefined") {
      return true;
    } else if (order.user_info.userId == App.globalData.user_info.userId) {
      return true;
    } else {
      return false;
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
    var self=this;
    
    storage.list_by_group_order_id(self.data.group_id,function (res) {
      self.refresh(self.data.group_id);
    })
  },

  refresh: function (group_id){  

    var App = getApp();
    var group_orders = App.globalData.group_orders;

    var group_order = App.globalData.get_by_id(group_orders, group_id);

    group_order.can_edit = this.ifOrderEditable(group_order);

 
    console.log( group_order);
    var items_hash = {};
    for (let i = 0; i < group_order.items.length; i++) {
      var item = group_order.items[i];
      items_hash[item.id] = item;
      if (typeof item.count == "undefined") item.count = 0;
      if (typeof item.total == "undefined") item.total = 0;
    }
    group_order.items_hash = items_hash;
    this.data.group_order.items_hash = items_hash;
    //group_order.cover_img = "http://www.publicdomainpictures.net/pictures/150000/velka/banner-header-tapete-145002399028x.jpg";
    group_order.cover_img = "../../img/banner-header.jpg";
    //计算价钱
    var total = 0;
    var notOrderedYet = true;
    var to_pay_total = 0;  //还有多少没支付
    var indexOfOurOwnOrder = -1;  //check which order is our own order, then we can bring it to the top
    for (let i = 0; i < group_order.orders.length; i++) {
      var order = group_order.orders[i];
      var sub_total = 0;
      // 团购主 可以修改任何一个order, 参与者只能修改自己的 order
      if (group_order.can_edit) order.can_edit = true;
      else order.can_edit = this.ifOrderEditable(order);

      if (typeof order.user_info == "undefined") {
        order.user_info_display = {
          avatarUrl: "../../img/role/archer.png",
          nickName: "未知用户"
        }
      } else {
        order.user_info_display = order.user_info;
        if (order.user_info.userId == App.globalData.user_info.userId){
          //this is our own order
          //need to hide the "I want order" button
          notOrderedYet = false;
          indexOfOurOwnOrder = i;

        }
      }
      
      for (let j = 0; j < order.purchases.length; j++) {
        var purchase = order.purchases[j];
        //var item = items_hash[purchase.id];
        //Call this getItemById function instead, 这个handle货物被删的情况
        var item = this.getItemById(purchase.id);
        sub_total += item.price * purchase.amount;
        order.purchases[j].name = item.name;
        order.purchases[j].price = item.price;
        order.purchases[j].sub_total = item.price * purchase.amount;
        if (typeof item.count == "undefined") item.count = 0;
        if (typeof item.total == "undefined") item.total = 0;
        item.count += purchase.amount;
        item.total += item.price * purchase.amount;
      }
      order.total = sub_total;
      order.to_pay_total = 0;

      total += sub_total;
      order.price_display_class = "item-price-cross";
      //this order is not paid, add to to_pay_total
      if (!order.paid) { 
        order.to_pay_total = order.total;
        to_pay_total += sub_total;
        order.price_display_class = "item-price";
      }
      
    

    }


    group_order.total = total;


    group_order.to_pay_total = to_pay_total;
    group_order.notOrderedYet = notOrderedYet;




    //move our own order to the top if found
    if (indexOfOurOwnOrder != -1){
      var our_order = group_order.orders.splice(indexOfOurOwnOrder, 1)[0];
      group_order.orders.unshift(our_order);
    }

    this.setData({
      group_order: group_order
    });    
  },



  onLoad: function (options) {
    var self = this;
    wx.showShareMenu({
      withShareTicket: true
    })
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
      title: '【团购详情】' + this.data.group_order.title,
      path: 'pages/hero_detail/hero_detail?id=' + this.data.group_id
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