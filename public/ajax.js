const axios = require("axios");
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
// axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
// 数据发送到服务器之前进行的操作
axios.defaults.transformRequest = [
  function(data) {
    let ret = "";
    for (let it in data) {
      ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
    }
    return ret;
  }
];
class Ajax {
  constructor() {
    baseUrl = `http://searchgw.dmall.com/mp/search/`;
  }
  
}
module.exports = new Ajax();
