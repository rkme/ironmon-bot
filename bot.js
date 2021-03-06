const tmi = require('tmi.js');
const bst = require('./bst.json');
const express = require('express')
const jw = require('jaro-winkler')

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

// Define configuration options for the chatbot
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
// Currently checks each message for a command and then uses a series of if-statements to determine what action to take. Ugly but it works. Will eventually implement more elegantly.
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message and convert command to lowercase
  const commandName = msg.split(' ')[0].toLowerCase();
  const user = context["username"].toLowerCase()

  // If the command is known, let's execute it
  if (commandName === '!bst') {
    const keyword = findKeyword(msg, bst)
    if (keyword && keyword.toLowerCase() in bst) {
      console.log(`${context["username"]}: ${msg} (found ${bst[keyword]})\n`)
      var poke = keyword.charAt(0).toUpperCase() + keyword.slice(1); // Capitalize name
      client.say(target, `${poke} BST: ${bst[keyword]}`);
    } else {client.say(target, "No pokemon with that name found.")}

  } else if (commandName === '!skub') {
    var position = "POSITION"
    if ( setTeam(user) ) {
      position = "anti"
    } else {
      position = "pro"
    }
    client.say(target, `@${user}, you are ${position}-skub.`)
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
        var [m, r] = findBestMatch(kw, keys)
        const minRating = 0.90
        if (r >= minRating){ 
          console.log(`Found keyword: ${kw} as ${m}, with a rating of ${r}.`);
          return m;
        }
        else {
          console.log(`Searched for ${kw}, closest match was: ${m}
          with a rating of ${r}.\n`)}
    }
    // Only gets here if message contains a valid command but not a valid keyword directly after it.
    console.log(`No keyword found in ${message}.\n`)
    return false; // returns False if no keyword provided
}


//Finds the closest match to keyword by finding the highest jaro-winkler rating among a list of keys. keyword should be a string and keys should be a list of strings.
function findBestMatch(keyword, keys){
  var rating = 0 // will return undefined if keys is empty
  let ratedKeys = keys.map(key => jw(keyword, key)) // rates entire list with jaro-winkler
  let highestRating = Math.max(...ratedKeys) // using spread operator
  // console.log(highestRating)
  var [match, rating] = [keys[ratedKeys.indexOf(highestRating)], highestRating]
  return [match, rating]
}


// Adds up the ASCII codes comprising a username and sets team based on whether or not it's even or odd. Not super complex and someone could easily reverse engineer this, but it's a pointless sorter anyway so there is no inherent reason to make this based off a secret hash seed.
function setTeam(name){
  // converts string to array of character codes of each string
  const vals = Array.prototype.map.call(name, char => {return char.charCodeAt(0)})

  // reduces character codes to a single sum value, starting from 0
  const sum = vals.reduce((a,b) => a + b, 0)

  return sum%2 // returns 0 if even, 1 if odd.
}


// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}