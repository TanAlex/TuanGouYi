//app.js
var utils = require('utils/utils.js');
App({
  onLaunch: function() {
    //var self = this;
    utils.login();
  },
  globalData: {
    new_guid: function (){
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    get_by_id: function(array, id){
      var item;
      for (let i =0; i< array.length; i++){
        if (array[i].id == id){
          item = array[i];
          break;
        }
      }
      return item;

    },
    set_by_id: function (array, id, new_value) {
      var item;
      var is_ok = false;
      for (let i = 0; i < array.length; i++) {
        if (array[i].id == id) {
          item = array[i];
          array[i] = new_value;
          is_ok = true;
          break;
        }
      }
      return is_ok;
    },

    group_orders: []
  }
})

/*
[
    {
      title: "豆浆机",
      isNew: true,
      id: "12348905-7890-2233-0988-1234",
      status: 0, //0: normal, 1: closed, can't change but can view, 2: deleted/hide
      items: [
        { name: "豆浆机1型", id: 1, price: 100.0 },
        { name: "豆浆机2型", id: 2, price: 200.0 },
        { name: "豆浆机3型", id: 3, price: 300.0 }
      ],
      orders: [
        { name: "TL", id: "12784555-7890-2233-0988-1234", purchases: [{ id: 1, amount: 1 }, { id: 2, amount: 1 }] },
        { name: "Alan_Mo", id: "19744555-7890-2233-0988-1234", purchases: [{ id: 2, amount: 1 }, { id: 3, amount: 1 }] },
        { name: "LeeYee", id: "12344555-7890-2233-0988-1234", purchases: [{ id: 1, amount: 1 }, { id: 3, amount: 1 }] },
      ]
    },
    {
      title: "各类蔬菜",
      isNew: false,
      id: "12344555-7890-2233-0128-1234",
      status: 0, //0: normal, 1: closed, can't change but can view, 2: deleted/hide
      items: [
        { name: "白菜", id: 11, price: 1.0 },
        { name: "青菜", id: 12, price: 2.0 },
        { name: "胡萝卜", id: 13, price: 3.0 }
      ],
      //orders.purchases 里面的id 是 items 的 id, purchase 本身不需要 id, 比如 { id: 1, amount: 1 } 就是买了1个白菜
      orders: [
        { name: "TL", id: "12300555-7890-2233-0988-1234", purchases: [{ id: 1, amount: 1 }, { id: 2, amount: 1 }] },
        { name: "Alan_Mo", id: "1213144555-7890-2233-0988-6517",  purchases: [{ id: 2, amount: 1 }, { id: 3, amount: 1 }] },
        { name: "LeeYee", id: "34344555-7890-2233-0988-7890",  purchases: [{ id: 1, amount: 1 }, { id: 3, amount: 1 }] },
      ]
    }
    ]
  */