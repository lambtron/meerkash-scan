
/**
 * Module dependencies.
 */

var debug = require('debug')('tipper-scan');
var twitter = require('./twitter');
var throng = require('throng');
var queue = require('./queue');
var User = require('./user');
var _ = require('lodash');
var ini = require('ini');
var fs = require('fs');
var co = require('co');


/**
 * Constants.
 */

const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

/**
 * Manage web concurrency.
 */

throng(co.wrap(start), {
  workers: config.WEB_CONCURRENCY || 1,
  lifetime: Infinity
});

/**
 * Start bot.
 */

function *start() {
  debug('bot is starting');
  var follow = yield getUsers();
  debug('following these users: %s', follow);
  twitter.stream('statuses/filter', { follow: follow }, function(stream) {
    stream.on('data', co.wrap(check));
    stream.on('error', co.wrap(handle));
  });
}

/**
 * Get users from db in string format.
 */

function *getUsers() {
  debug('getting users to follow');
  var follow = yield User.find({}, { twitterId: 1 });
  return _.map(follow, function(e) {
    return e.twitterId;
  }).join(',');
}

/**
 * check tweet.
 */

function *check(tweet) {
  if (!~tweet.text.indexOf('$') || !~tweet.text.indexOf('#tipper')) return;
  debug('found a tweet: %s', tweet.text);
  queue.add(tweet);
}

/**
 * Handle errors.
 */

function *handle(err) {
  debug('Error: %s', err);
  return;
}
