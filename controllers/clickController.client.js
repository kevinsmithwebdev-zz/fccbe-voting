'use strict';

(function () {

  window.onload=function(){
    // var deletePollButtons = getElementsByClassName('poll-button-delete');


  function addEventListenerByClass(className, event, fn) {
      var list = document.getElementsByClassName(className);
      for (var i = 0, len = list.length; i < len; i++) {
          list[i].addEventListener(event, fn, false);
      }
  } // addEventListenerByClass()

  addEventListenerByClass('poll-button-delete', 'click', handlePollDelete);

  function handlePollDelete() {
    console.log('in delete button...');
    console.log(this.value);
    ajaxRequest('DELETE', '/polls/' + this.value, function () {
      console.log("callback in client click handler for delete poll button");
       ajaxRequest('GET', '/', function() { console.log("wowsers callback");});
    });
  } // handlePollDelete()

} // window.onload

  // ***************************************

  function ready (fn) {
    if (typeof fn !== 'function') {
      return;
    }

    if (document.readyState === 'complete') {
      return fn();
    }

    document.addEventListener('DOMContentLoaded', fn, false);
  }

  function ajaxRequest (method, url, callback) {
    var xmlhttp = new XMLHttpRequest();
    console.log("in ajaxRequest ...");
    console.log(method);
    console.log(url);
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        callback(xmlhttp.response);
      }
    };

    xmlhttp.open(method, url, true);
    xmlhttp.send();
  }



})();
