const tmi = require('tmi.js');
const bst = require('./bst.json');

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.split(' ')[0];

  // If the command is known, let's execute it
  if (commandName === '!bst') {
    var keyword = msg.split(' ')[1]
    if (keyword.toLowerCase() in bst) {
      client.say(target, bst[keyword]);
    } else {client.say(target, "No pokemon with that name found.")}
  } else if (commandName === '!terry') {
    client.say(target, 'RIP Terry :(');
  }
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 20;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}