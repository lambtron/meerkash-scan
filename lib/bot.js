
/**
 * Module dependencies.
 */

var debug = require('debug')('meerkash-scan');
var twitter = require('./twitter');
var throng = require('throng');
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

throng(start, {
  workers: config.WEB_CONCURRENCY || 1,
  lifetime: Infinity
});

/**
 * Start bot.
 */

function start() {
  debug('bot is starting');
  twitter.stream('statuses/filter', { follow: 3629421 }, function(stream) {
    stream.on('data', co.wrap(analyze));
    stream.on('error', co.wrap(handle));
  });
}

/**
 * Analyze tweet.
 */

function *analyze(tweet) {
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
