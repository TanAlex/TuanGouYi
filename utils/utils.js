var config = require ("config.js");
module.exports = {
  check_and_login: function(callback){
    var self = this;
    var App = getApp();
    wx.checkSession({
      success: function (e) {   //登录态未过期
        console.log("没过期");
        if (typeof App.globalData.session_info == "undefined"
          || typeof App.globalData.session_info.userId == "undefined" ){
          self.login(callback);
        }else if (typeof callback == "function"){
          
          callback();
        }
      },
      fail: function () { 
        self.login(callback);

      }
    })
  },
  
  login: function (callback){
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log('成功获取用户登录态！');
          console.log(res);
          //发起后端网络请求
          wx.request({
            //url: 'https://24745919.qcloud.la/ajax/wx/login',
            url: config.url_login,
            data: {
              code: res.code
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log("从Alan后端得到");
              console.log(res);
              //statusCode: 200
              //data: {sessionId: "c23a84855df8ee57b0bd072f232e71b0fef1bc0df6093c8cb26cd3f81073f1b7", userId: "64e5644f41493fcf9f08727a2176d5ee"}
              if (res.statusCode == 200) {
                var session_info = res.data;
                wx.getUserInfo({
                  success: function (res) {
                    /*
                    var userInfo = res.userInfo
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl
                    var gender = userInfo.gender //性别 0：未知、1：男、2：女
                    var province = userInfo.province
                    var city = userInfo.city
                    var country = userInfo.country
                    */
                    console.log("getUserInfo");
                    console.log(res);
                    var App = getApp();
                    App.globalData.session_info = {
                      userId: session_info.userId,
                      sessionId: session_info.sessionId
                    };
                    res.userInfo.userId = session_info.userId;
                    App.globalData.user_info = res.userInfo;
                    console.log(App.globalData);
                    if (typeof callback =="function")
                      callback();
                  }
                })
              }
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },

  list_by_group_order_id: function (group_order_id, success_func) {
    var service_url = config.url_list_all + "?id=" + group_order_id;



    this.check_and_login( function(){
      wx.request({
        //url: 'https://thebusy.net:3000/ajax/order/list',
        url: service_url,
        method: 'GET',
        data: {

        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          var App = getApp();
          
          var res_group_orders = res.data;
          console.log("in check_and_login success callback");
          try {
            if (res_group_orders.length > 0){
              var res_group_order = res_group_orders[0];
              App.globalData.set_or_append_by_id(App.globalData.group_orders, res_group_order.id, res_group_order );
            }
          }catch(e){
            console.log(e);

          }
          //wx.hideToast();
          success_func();
        }
      })
    })
  },

  list_all: function (options,success_func ){
    var service_url = config.url_list_all;
    if (! (typeof options.userId == "undefined")){
      service_url = config.url_list_by_userId + "?userId=" + options.userId + "&sessionId=" + options.sessionId;
    }
      
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 8000
    })
    this.check_and_login();
    wx.request({
      //url: 'https://thebusy.net:3000/ajax/order/list',
      url: service_url,
      method: 'GET',
      data: {

      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res){ 
        var App = getApp();
        if (typeof res != "undefined" && res.data !== null && typeof res.data === 'object'){
          App.globalData.group_orders = res.data;
        }else{
          App.globalData.group_orders = [];
        }


        var group_orders = App.globalData.group_orders;

        console.log("list_all after network call");
        console.log(group_orders);
        for (let i = 0; i < group_orders.length; i++) {
          var g = group_orders[i];

          if (typeof g.user_info == "undefined"){
            g.user_info_display = {
              avatarUrl: "../../img/icon/user-icon.png",
              nickName: "未知用户"
            }
          }else{
            g.user_info_display = g.user_info;
          }
          if (typeof g.locked == "undefined") g.locked = false;
          if (g.locked) {
            g.desc = " (已结单锁定,只有创建者可以修改)";

          }else{
            var new_desc;
            if (typeof g.description != "undefined"){
              new_desc = g.description.substr(0, 17);
              if (g.description != new_desc) { new_desc += "..." }              
            }else{
              var desc = g.items.map(function (elem) {
                return elem.name;
              }).join(",");
              new_desc = desc.substr(0, 17);
              if (desc != new_desc) { new_desc += "..." }
            }
            g.desc = new_desc;
          }

        }
        wx.hideToast();
        success_func();
      }
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
      success: success_func
      ,
      fail: function (res) {
        console.log("update failed");
        console.log(res);
      }
    });

  },

  update_item: function(order, success_func){
    wx.request({
      //url: 'https://thebusy.net:3000/ajax/order/updateItem',
      url: config.url_update_item,
      data: order,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: success_func,
      fail: function (res) {
        console.log("update failed");
        console.log(res);
      }
    });
  },

  update_order: function (order, success_func) {
    wx.request({
      //url: 'https://thebusy.net:3000/ajax/order/updatePO',
      url: config.url_update_order,
      data: order,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: success_func,
      fail: function (res) {
        console.log("update failed");
        console.log(res);
      }
    });
  },

  delete_group_order: function (order, success_func) {
    wx.request({
      //url: 'https://thebusy.net:3000/ajax/order/updatePO',
      url: config.url_delete_order,
      data: order,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: success_func,
      fail: function (res) {
        console.log("delete failed");
        console.log(res);
      }
    });
  }
}