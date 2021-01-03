const tmi = require('tmi.js');
const bst = require('./bst.json');
const express = require('express')
const ss = require('string-similarity')

// Using this script to keep_alive.py in node
const app = express()
let runPy = new Promise(function(success, nosuccess) {

    const { spawn } = require('child_process');
    const pyprog = spawn('python', ['./keep_alive.py']);

    pyprog.stdout.on('data', function(data) {

        success(data);
    });

    pyprog.stderr.on('data', (data) => {

        nosuccess(data);
    });
});

app.get('/', (req, res) => {

    res.write('welcome\n');

    runPy.then(function(fromRunpy) {
        console.log(fromRunpy.toString());
        res.end(fromRunpy);
    });
})

var p = 8080; //unsure if this should be a different port
app.listen(p, () => console.log(`Application listening on port ${p}!`))

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ],
  connection: {
    reconnect: true
  }
  
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
  // const keyword = msg.split(' ').slice(1).join(" ")  // Deprecated static entry

  // If the command is known, let's execute it
  if (commandName.toLowerCase() === '!bst') {
    const keyword = findKeyword(msg, bst)
    if (keyword && keyword.toLowerCase() in bst) {
      console.log(`${context["username"]}: ${msg} (found ${bst[keyword]})`)
      var name = keyword.charAt(0).toUpperCase() + keyword.slice(1); // Capitalize name
      client.say(target, `${name} BST: ${bst[keyword]}`);
    } else {client.say(target, "No pokemon with that name found.")
            console.log(`Failed BST search: ${msg}`)}
  } else if (commandName === '!terry') {
    client.say(target, 'RIP Terry :(');
  }
}

// Finds keyword to a command by comparing to dict keys. Also finds multiword keywords
// as long as the full name directly follows the commandName
function findKeyword(message, dict) {
    const keys = Object.keys(dict)
    const words = message.split(' ')  // Splits up all words in message 
    var i;
    for (i = 2; i <= words.length; i++){
        var kw = words.slice(1,i).join(" ").toLowerCase();
        var match = ss.findBestMatch(kw, keys)
        if (match.bestMatch.rating >= 0.65){
          // console.log(`Found keyword: ${kw}`);
          return match.bestMatch.target;
        }
        else {
          console.log(`Searched for ${kw}, closest match was:`)
          console.log(match.bestMatch)}
    }
    // Only gets here if it message contains a valid command but not a valid keyword // directly after it.
    console.log(`No keyword found in ${message}.`)
    return false; // returns False if no keyword provided
}



// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}