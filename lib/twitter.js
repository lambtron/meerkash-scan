
/**
 * Module dependencies.
 */

var Twitter = require('twitter');
var ini = require('ini');
var fs = require('fs');

/**
 * Static variables.
 */

var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))

/**
 * Set credentials.
 */

var twitter = new Twitter({
  consumer_key: config.TW_CONSUMER_KEY,
  consumer_secret: config.TW_CONSUMER_SEC,
  access_token_key: config.TW_ACCESS_TOKEN_KEY,
  access_token_secret: config.TW_ACCESS_TOKEN_SEC
});

/**
 * Expose `twitter`.
 */

module.exports = twitter;
