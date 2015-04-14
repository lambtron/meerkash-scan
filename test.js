
/**
 * Module dependencies.
 */

var debug = require('debug')('tipper-venmo');
var thunkify = require('thunkify-wrap');
var request = require('request');
var co = require('co');
var venmo = {};

/**
 * Const.
 */

var domain = 'https://sandbox-api.venmo.com/v1/payments';
const post = thunkify(request.post);

/**
 * Make a payment or charge.
 */

venmo.pay = function *() {
  debug('sending post to venmo');

  var load = {
    test: 'blah',
    foo: 'bar'
  };

  domain += qs(load);

  console.log(domain);

  // domain += '?access_token=2f55c2a4c869cba60a8df0a26b0d250372054491d7e9077ff2f4b2fccf16dd37&user_id=145434160922624933&phone=15555555555&email=venmo%40venmo.com&amount=0.10&note=test';


  // var res = yield post(domain);

  // post(domain)(function(err, res) {
  //   console.log(err);
  //   console.log(res);
  // });

  // console.log(res);
};



co(function *() {
  yield venmo.pay();
});



function qs(obj) {
  console.log(obj);
  var str = '?';
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      str += key + '=' + obj[key] + '&';
    }
  }
  return str.slice(0, -1);
}
