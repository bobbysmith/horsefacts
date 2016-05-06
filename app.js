var Botkit = require('botkit');
var config = require('./config');
var facts = require('./facts');

var controller = Botkit.slackbot({
  debug: true,
});

var bot = controller.spawn({
  token: config.secret
}).startRTM();


controller.hears(['hello', 'hi', 'yo'], 'direct_message,direct_mention,mention', function(bot, message) {
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'horse',
  }, function(err, res) {
    if (err) {
      bot.botkit.log('Failed to add emoji reaction :(', err);
    }
  });

  controller.storage.users.get(message.user, function(err, user) {
    if (user && user.name) {
      bot.reply(message, 'Hello ' + user.name + '!!');
    } else {
      bot.reply(message, 'Hello.');
    }
  });
});

controller.hears(['tell me about horses', 'horse', 'horses', 'fact', 'facts', 'tell me a fact', 'whoa'], 'direct_message,direct_mention,mention', function(bot, message) {
  bot.reply(message, randomFact());
});

controller.hears(['shut up'], 'direct_message,direct_mention,mention', function(bot, message) {
  bot.reply(message, 'I don\'t shut up, I grow up, and when I look at you I throw up');
});

controller.hears(['call me (.*)', 'my name is (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
  var name = message.match[1];
  controller.storage.users.get(message.user, function(err, user) {
    if (!user) {
      user = {
        id: message.user,
      };
    }
    user.name = name;
    controller.storage.users.save(user, function(err, id) {
      bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
    });
  });
});

controller.hears(['who are you', 'what is your name', 'who is @horsefacts', 'who is horsefacts', 'who is horse facts'], 'direct_message,direct_mention,mention', function(bot, message) {

  bot.reply(message, 'I am <@' + bot.identity.name + '> and I\'m here to teach you about horses :horse: :carousel_horse: :racehorse: ');
});

function randomFact() {
  var num = Math.floor(Math.random() * (facts.length - 1) + 1);
  return facts[num];
}

