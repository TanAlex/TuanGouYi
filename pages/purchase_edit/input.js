Page({
  data: {
    group_id: -1,
    order_id: -1,
    order: {},
    items: [],
    items_hash: {},
    focus: false,
    inputValue: ''
  },

  onLoad: function (options) {
    var self = this,
      group_id = options.id,
      order_id = options.order_id;
    console.log(group_id, order_id);

    var App = getApp();

    var group_orders = App.globalData.group_orders;
    var group_order = App.globalData.get_by_id(group_orders,group_id);
    var items = group_order.items;
    for (let i = 0; i < items.length; i++) {
      items[i].index = i;
      items[i].checked = false;
      items[i].amount = 0;
    }
    var order;
    if (typeof order_id != "undefined"){
      order = App.globalData.get_by_id(group_order.orders, order_id);


      for (let i = 0; i < order.purchases.length; i++) {
        var item = App.globalData.get_by_id(items, order.purchases[i].id);
        if (typeof item != "undefined"){
          item.checked = true;
          item.amount = order.purchases[i].amount;
        }else{
          item.checked = false;
          item.amount = 0;
        }
      }
    }else{
      order = { name:"新用户", id: -1, purchases:[]};
      order_id = -1;
    }

    self.setData({
      group_id: group_id,
      order_id: order_id,
      order:  order,
      items: items
    });
  },

  onInput: function (e) {
    var ctrl = {};
    ctrl.data = e.currentTarget.dataset;
    ctrl.itemIndex = ctrl.data.itemindex;
    ctrl.type = ctrl.data.type;
    ctrl.value = e.detail.value;
    console.log(ctrl)

    var order = this.data.order;

    var items = this.data.items;
    if (ctrl.type == "purchase-amount"){
      var value = ctrl.value=="" ? 0: parseInt(ctrl.value);
      items[ctrl.itemIndex].amount = value;
      var item = items[ctrl.itemIndex];
      item.checked =  true;
      var purchases = [];
      
      for (var i = 0; i < items.length; ++i) {
        if (items[i].checked && items[i].amount > 0){
          purchases.push({ id: items[i].id, amount: items[i].amount });
        }
      }
      order.purchases = purchases;      
    } else if (ctrl.type == "purchase-name"){
      var items = this.data.items, values = e.detail.value;
      var purchases = [];
      for (var i = 0; i < items.length; ++i) {
        items[i].checked = false;

        for (var j = 0; j < values.length; ++j) {
          if (items[i].id == values[j]) {
            items[i].checked = true;
            if (items[i].amount == 0){items[i].amount = 1}
            purchases.push( {id: items[i].id, amount: items[i].amount});
            break
          }
        }
        if (items[i].checked == false){
          items[i].amount = 0;
        }
      }


      order.purchases = purchases;

    } 
    
    this.setData({
      order: order,
      items: items
    })
    console.log(this.data)
  },

  saveAndBack: function (e) {
    var App = getApp();

    var group_order = App.globalData.get_by_id(App.globalData.group_orders, this.data.group_id );
    if (typeof group_order != "undefined"){
      
      if (this.data.order_id == -1){
        this.data.order_id = App.globalData.new_guid();
        this.data.order.id = this.data.order_id;
        group_order.orders.push(this.data.order);

      }else{
        App.globalData.set_by_id(group_order.orders, this.data.order_id, this.data.order);
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
