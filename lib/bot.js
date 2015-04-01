
/**
 * Module dependencies.
 */

var debug = require('debug')('meerkash-scan');
var twitter = require('./twitter');
var throng = require('throng');
var User = require('./user');
var ini = require('ini');
var fs = require('fs');
var co = require('co');

// need to get `twitter id` from mongo.

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
  twitter.stream('statuses/filter', { follow: follow }, function(stream) {
    stream.on('data', co.wrap(analyze));
    stream.on('error', co.wrap(handle));
  });
}

/**
 * Get users from db in string format.
 */

function *getUsers() {
  var follow = yield User.find({}, { twitterId: 1 });
  return follow.join(',');
}

/**
 * Analyze tweet.
 */

function *analyze(tweet) {
  // if tweet has "$" in it, then.
  console.log(tweet);
  // need to add tweet to queue.
}

/**
 * Handle errors.
 */

function *handle(err) {
  debug('Error: %s', err);
  return;
}
