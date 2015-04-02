
/**
 * Module dependencies.
 */

var amqp = process.env.CLOUDAMQP_URL || 'amqp://localhost';
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
  queue.create('jobs', { prefetch: 5 }, queue.ready);
});

/**
 * On ready.
 */

queue.ready = function() {
  queue.handle('jobs', queue.shift);
}

/**
 * Shift one tweet from queue.
 */

queue.shift = function(job, ack) {
  console.log('job');
  ack();
}

/**
 * Add tweet.
 */

queue.add = function(tweet) {
  queue.publish('jobs', tweet);
}
