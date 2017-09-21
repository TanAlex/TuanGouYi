Page({
  data: {
    focus: false,
    inputValue: ''
  },

  onLoad: function (options) {
    var self = this,
      group_id = parseInt(options.id);

    var App = getApp();

    var group_orders = App.globalData.group_orders;
    var group_order = group_orders[group_id];
    group_order.id = group_id;
    var items_hash = {};
    for (let i = 0; i < group_order.items.length; i++) {
      group_order.items[i].index = i;
      var item = group_order.items[i];
      
      items_hash[item.id] = item;
    }
    group_order.items_hash = items_hash;
    group_order.items_names = group_order.items.map(function(x){return x.name});
    self.setData({
      group_order: group_order
    });
  },

  onInput: function (e) {
    var ctrl = {};
    ctrl.data = e.currentTarget.dataset;
    ctrl.orderIndex = ctrl.data.orderindex;
    ctrl.purchaseIndex = ctrl.data.purchaseindex;
    ctrl.type = ctrl.data.type;
    ctrl.value = e.detail.value;
    console.log(ctrl)

    var group_order = this.data.group_order;
    if (ctrl.type == "purchase-amount"){
      group_order.orders[ctrl.orderIndex].purchases[ctrl.purchaseIndex].amount = ctrl.value;
    } else if (ctrl.type == "purchase-name"){
      var item = group_order.items[ctrl.value];
      group_order.orders[ctrl.orderIndex].purchases[ctrl.purchaseIndex].id = item.id;
    } 
    
    this.setData({
      group_order: group_order
    })
    console.log(this.data)
  },

  saveAndBack: function (e) {
    var App = getApp();
    for (let i = 0; i < App.globalData.group_orders.length; i++){
      if (App.globalData.group_orders[i].id == this.data.group_order.id){
        App.globalData.group_orders[i] = this.data.group_order;
        break;
      }
    }
    wx.navigateBack({
      delta: 1
    })
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
