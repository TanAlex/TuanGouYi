var qa_url = "https://24745919.qcloud.la:8080";
var prod_url = "https://24745919.qcloud.la";
//var prod_url = "https://pxhcmnze.qcloud.la";

var url = qa_url;
//var url = prod_url;

module.exports = {
  url : url,
  url_login : url + "/ajax/wx/login",
  url_list_all : url + "/ajax/order/list",
  url_list_by_userId: url + "/ajax/order/list_by_userId",
  url_update: url+"/ajax/order/update",
  url_update_order: url + "/ajax/order/updatePO",
  url_update_item: url + "/ajax/order/update",
  url_delete_order: url + "/ajax/order/delete"

}