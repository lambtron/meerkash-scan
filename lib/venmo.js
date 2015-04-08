
/**
 * Module dependencies.
 */

var debug = require('debug')('tipper-scan');
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
  var res = yield post(domain, load);
  console.log(res);
  return res;
};
