# Ironmon bot

For ease of use in viewing ironmon playthroughs on Twitch.tv. Currently optimized for Generation 4. Runs in the chat room on twitch.tv/NumotTheNummy. Currently running on repl.it, using UptimeRobot to keep the program running indefinitely.

Currently only support 2 commands:

* !bst pokemonName spits out the combined Base Stat Total of pokemonName.
  * Currently works with multi-word names (looking at you mr. mime)
  * Need to fix unicode support for the nidorans and flabebe (currently I've added entries with non unicode versions of the names (e.g. nidoran male and nidoran female). As the db fills out with more info, however, this will be made more robust with multiple accepted keys for a single entry)

* !terry mourns Terry :(
  * In NumotTheNummy's channel it's also the 3rd bot to respond to this command so lol.

Planned additions

* !nextMove pokemonName lvl 
  * Gives next level for when a move will be learned by leveling up

* !info moveName\
  * If move: Gives basic move info, e.g. description, power, acc, Spe vs Phy
  * If poke: Gives basic poke info, types, BST, HP, learn rate
  * If item: What it does/sells for 
  * Should work similar to Pokemon Showdown /dt command

* 
