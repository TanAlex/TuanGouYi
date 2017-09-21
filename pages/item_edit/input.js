var storage = require('../../utils/utils.js');

Page({
  data: {
    focus: false,
    inputValue: ''
  },

  onLoad: function (options) {
    console.log("onLoad");
    this.refresh(options);
  },
/*
  onShow: function (options) {
    console.log("onShow");
    this.refresh(options);
  },
*/
  refresh: function (options) {
    console.log("onRefresh");
    var self = this;
      

    var App = getApp();
    var group_orders = App.globalData.group_orders;
    this.data.new_guid = App.globalData.new_guid;
    var group_order;

    if (typeof options == "undefined" || typeof options.id == "undefined"){
      //this is a new create group_order request
      group_order = {
        title: "",
        is_new: true,
        id: -1,    //-1 indicate this is a new one so backend can generate one
        status: 0, //0: normal, 1: closed, can't change but can view, 2: deleted/hide
        items: [],
        orders:[]
      }

    }else{
      var group_id = options.id;
      
      group_order = App.globalData.get_by_id(group_orders,group_id);
      //group_order.id = group_id;
      console.log(group_order);
      var items_hash = {};
      for (let i = 0; i < group_order.items.length; i++) {
        var item = group_order.items[i];
        items_hash[item.id] = item;
      }
      group_order.items_hash = items_hash;
      group_order.is_new= false;
    }


    delete group_order['_id'];
    self.setData({
      group_order: group_order,
      new_item: {}
    });
    console.log(this.data.group_order);
  },

  onInput: function (e) {
    var ctrl_data = e.currentTarget.dataset;
    var ctrl_id = ctrl_data.id;
    var ctrl_type = ctrl_data.type;
    var ctrl_value = e.detail.value;
    console.log(e)
    console.log ("ctrl_id:"+ ctrl_data.id + " ctrl_value:"+ ctrl_value);
    var group_order = this.data.group_order;
    if (ctrl_type == "order"){
      group_order.title = ctrl_value;
    } else if (ctrl_type == "item-name"){
      var item = group_order.items_hash[ctrl_id];
      item.name = ctrl_value;
    } else if (ctrl_type == "item-price") {
      var item = group_order.items_hash[ctrl_id];
      item.price = ctrl_value;
    } else if (ctrl_type == "new-item-name") {
      this.data.new_item.name = ctrl_value;
    } else if (ctrl_type == "new-item-price") {
      
      this.data.new_item.price = ctrl_value;
    }
    
    this.setData({
      group_order: group_order
    })
    console.log(this.data)
  },

  removeItem: function (e) {
    var item = this.data.new_item;
    var ctrl_data = e.currentTarget.dataset;
    var group_order = this.data.group_order;
    group_order.items.splice(ctrl_data.index,1);
    this.setData({
      group_order: group_order
    })
  },

  addItem: function (e) {
    var item = this.data.new_item;
    if (typeof (item.name) != "undefined" && typeof (item.price) != "undefined" &&
    item.name != "" && parseInt(item.price) != NaN && parseInt(item.price) != 0) {
      var group_order = this.data.group_order;
      item.id = this.data.new_guid();
      group_order.items.push(item);
      this.setData({ group_order: group_order });
    } else {
      wx.showModal({
        title: '请检查',
        content: '货物要有名字而且价格要是非零数字',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  saveAndBack: function (e) {
    var App = getApp();
    if (this.data.group_order.title == ""){
      wx.showModal({
        title: '请检查',
        content: '团购名称不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      if (this.data.group_order.id != -1) {
        //update existing group_orders
        /*
        for (let i = 0; i < App.globalData.group_orders.length; i++) {
          if (App.globalData.group_orders[i].id == this.data.group_order.id) {
            App.globalData.group_orders[i] = this.data.group_order;
            break;
          }
        }
        */
      }else{
        //insert to database to get a new id
        //then push to the global data
        this.data.group_order.id = this.data.new_guid();
        
        App.globalData.group_orders.push(this.data.group_order);
      }
      delete this.data.group_order['_id'];
      storage.update(this.data.group_order, function () { });

      if (this.data.group_order.is_new){
        wx.switchTab({
          url: '../index/index'
        })

      }else{
        
        wx.navigateBack({
          delta: 1
        });
      }


    }
  },

  cancelAndBack: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },


  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  bindReplaceInput: function (e) {
    var value = e.detail.value
    var pos = e.detail.cursor
    var left
    if (pos !== -1) {
      // 光标在中间
      left = e.detail.value.slice(0, pos)
      // 计算光标的位置
      pos = left.replace(/11/g, '2').length
    }

    // 直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(/11/g, '2'),
      cursor: pos
    }

    // 或者直接返回字符串,光标在最后边
    // return value.replace(/11/g,'2'),
  },
  bindHideKeyboard: function (e) {
    if (e.detail.value === '123') {
      // 收起键盘
      wx.hideKeyboard()
    }
  }
})
