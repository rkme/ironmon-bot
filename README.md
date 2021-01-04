# Ironmon bot

For ease of use in viewing ironmon playthroughs on Twitch.tv. Currently optimized for Generation 4. Runs in the chat room on twitch.tv/NumotTheNummy. Currently running on repl.it, using UptimeRobot to keep the program running indefinitely.

Currently supports 3 commands:

* !bst pokemonName spits out the combined Base Stat Total of pokemonName.
  * Currently works with multi-word names (looking at you mr. mime)
  * Currently works with mispelled names (to a limit. Picks highest ~~Sørensen–Dice coefficient~~ Jaro-winkler rating amongst all known keys and checks that it's over 0.8 before spitting it back)
  * Need to fix unicode support for the nidorans and flabebe (currently I've added entries with non unicode versions of the names (e.g. nidoran male and nidoran female). As the db fills out with more info, however, this will be made more robust with multiple accepted keys for a single entry)

* !skub
  * Reveals your position on the hotly-debated topic of skub.
 
* !terry mourns Terry :(
  * In NumotTheNummy's channel it's also the 3rd bot to respond to this command so lol.

Planned additions
* !ping
 * returns `pong!` in chat, as long as pinger is the streamer, a mod, or me. Let's the people know it's still alive.

* !nextMove pokemonName lvl 
  * Gives next level for when a move will be learned by leveling up

* !info moveName\
  * If move: Gives basic move info, e.g. description, power, acc, Spe vs Phy
  * If poke: Gives basic poke info, types, BST, HP, learn rate
  * If item: What it does/sells for 
  * Should work similar to Pokemon Showdown /dt command
  
* !team 
 * A dumb lil thing that *kind of* randomly assigns the caller of the command to be either pro-skub or anti-skub. Used to sow pointless discord amongst communities.

* Maybe use a different string similarity detector as Sørensen–Dice gives some weird values sometimes. Possibly will use Jaro-Winkler or just good ol Damerau-Levenshtein, but requires testing first.
