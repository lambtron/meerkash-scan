
/**
 * Module dependencies.
 */

var debug = require('debug')('tipper-venmo');
var thunkify = require('thunkify-wrap');
var request = require('request');
var venmo = {};

/**
 * Const.
 */

const domain = 'https://api.venmo.com/v1/payments';
const post = thunkify(request.post);

/**
 * Expose `venmo`.
 */

module.exports = venmo;

/**
 * Make a payment or charge.
 */

venmo.pay = function *(load) {
  debug('sending post to venmo');
  var uri = domain + qs(loads);
  var res = yield post(uri);
  console.log(res);
  return res;
};

/**
 * Helper function to turn obj to querystring.
 */

function qs(obj) {
  var str = '?';
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      str += key + '=' + obj[key] + '&';
    }
  }
  return str.slice(0, -1);
}
