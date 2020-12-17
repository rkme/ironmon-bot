# Ironmon bot

For ease of use in ironmon runs

Currently only support 2 commands:

* !bst pokemonName spits out the combined Base Stat Total of pokemonName.
  * Currently works with multi-word names (looking at you mr. mime)
  * Need to fix unicode support for the nidorans and flabebe (currently I've added entries with non unicode versions of the names aka nidoran male vs nidoran female. As the db fills out with more info, however, this will be made more robust with multiple accepted keys for a single entry)

* !terry mourns Terry :(
  * In NumotTheNummy's channel it's also the 3rd bot to respond to this command so lol.

Planned additions

* !nextMove pokemonName lvl 
  * Gives next level for when a move will be learned by leveling up

* !info moveName\
  * If move: Gives basic move info, e.g. description, power, acc, Spe vs Phy
  * If poke: Gives basic poke info, types, BST, HP 
  * Should work similar to Pokemon Showdown /dt command

* !info 