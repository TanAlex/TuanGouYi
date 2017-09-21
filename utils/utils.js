var config = require ("config.js");
module.exports = {
  


  list_all: function(success_func){
    console.log(config);
    wx.request({
      //url: 'https://thebusy.net:3000/ajax/order/list',
      url: config.url_list_all,
      method: 'GET',
      data: {

      },
      header: {
        'Content-Type': 'application/json'
      },
      success: success_func
    })

  },

  update: function(group_order, success_func){
    
      wx.request({
        //url: 'https://thebusy.net:3000/ajax/order/update',
        url: config.url_update,
        data: group_order,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        }, 
        success: function (res) {
          console.log("update result");
          console.log(res);
          if (res.data.ret == 200) {
            //something to do
          }
          else {
            //something to do
          }
        },
        fail: function (res) {
          console.log("update failed");
          console.log(res);
        }
      });

  }

}