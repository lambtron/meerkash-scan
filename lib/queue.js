
/**
 * Module dependencies.
 */

var amqp = process.env.CLOUDAMQP_URL || 'amqp://localhost';
var debug = require('debug')('meerkash-scan-queue');
var jackrabbit = require('jackrabbit');
var queue = jackrabbit(amqp);

/**
 * Expose `queue`.
 */

module.exports = queue;

/**
 * Queue on.
 */

queue.on('connected', function() {
  debug('connecting to queue')
  queue.create('jobs', { prefetch: 5 }, queue.ready);
});

/**
 * On ready.
 */

queue.ready = function() {
  debug('ready to handle queue');
  queue.handle('jobs', queue.shift);
}

/**
 * Shift one tweet from queue.
 */

queue.shift = function(job, ack) {
  debug('job received');
  // ack();
}

/**
 * Add tweet.
 */

queue.add = function(tweet) {
  debug('adding tweet to queue');
  queue.publish('jobs', tweet);
}
