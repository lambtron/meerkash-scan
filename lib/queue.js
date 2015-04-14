
/**
 * Module dependencies.
 */

var amqp = process.env.CLOUDAMQP_URL || 'amqp://localhost';
var debug = require('debug')('tipper-process');
var jackrabbit = require('jackrabbit');
var venmo = require('./venmo');
var reject = require('reject');
var User = require('./user');
var queue = jackrabbit(amqp);
var co = require('co');

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
  queue.handle('jobs', co.wrap(queue.shift));
}

/**
 * Shift one tweet from queue.
 */

queue.shift = function *(job, ack) {
  debug('starting a job with this tweet: %s', job.text);
  var accessToken = yield getAccessToken(job.user.id);
  var tweet = job.text;
  var recipients = yield getRecipients(tweet);
  debug('number of recipients are %s', recipients.length);
  var amount = getAmount(tweet);
  debug('amount is %s', amount);
  if (amount > 20) return debug('amount is greater than $20');

  for (var i = 0; i < recipients.length; i++) {
    var load = reject({
      email: recipients[i].email,
      phone: recipients[i].phone,
      access_token: accessToken,
      amount: amount,
      tweet: tweet
    });

    debug('recipient email is %s', recipients[i].email);
    debug('recipient phone is %s', recipients[i].phone);

    var res = yield venmo.pay(load);

    debug('res is %s', res);
    debug(res);

    // if error, then publish to queue again. add increment.
    // only try twice then delete it.
  }

  debug('job complete');
  ack();
}

/**
 * Add tweet.
 */

queue.add = function(tweet) {
  debug('adding tweet to queue');
  queue.publish('jobs', tweet);
}

/**
 * Helper function to get recipient
 */

function *getRecipients(tweet) {
  debug('getting recipients');
  var tokens = tweet.split(' ');
  var recipients = [];
  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i][0] != '@') continue;
    var venmo = yield User.findOne({ twitter: tokens[i].substr(1) }, { phone: 1, email: 1 });
    recipients.push(venmo);
  }
  return venmo;
}

/**
 * Helper function to get access token.
 */

function *getAccessToken(twitterId) {
  debug('getting access token for %s', twitterId);
  return yield User.findOne({ twitterId: twitterId }, { accessToken: 1 });
}

/**
 * Helper function to get amount
 */

function getAmount(tweet) {
  debug('getting the $ amount from the tweet');
  return +tweet.match(/\$(\d+)/)[1];
}
