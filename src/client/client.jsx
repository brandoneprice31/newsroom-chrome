import $ from "jquery";

class Client {
  static get(url, params, successHandler, errorHandler) {
    $.ajax({
      url: this.baseUrl() + url,
      data: params,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        successHandler(data);
      },
      error: function(xhr, status, err) {
        errorHandler(err);
      }
    });
  }

  static post(url, data, successHandler, errorHandler) {
    $.ajax({
      type: 'POST',
      url: this.baseUrl() + url,
      data: JSON.stringify(data),
      dataType: 'json',
      beforeSend: function(x) {
        if (x && x.overrideMimeType) {
          x.overrideMimeType("application/j-son;charset=UTF-8");
        }
      },
      success: function(data) {
        successHandler(data);
      },
      error: function(data) {
        errorHandler(data);
      }
    });
  }

  static baseUrl(){
    return 'https://api.newsroom.bep-projects.com/';
    //return 'http://localhost:8080/';
  }
}

export default Client;
