# ThinkTwiceBot

**ThinkTwiceBot is no longer being worked on. This is the non-database version of the bot, which does not save information on restart and is not suitable for longer games. This bot is designed to work with glitch.com hosting.**

This is a discord bot to play a mafia variant called Think Twice<br/><br/>

The game rules are as follows:<br/>
-The game starts when five players have joined.<br/>
-Each day lasts for 24 hours (shortened to 5 minutes currently for testing).<br/>
-Players vote on which player they want to be voted out<br/>
-At the end of the in-game day, or when any player reaches 3 votes, the player with the most votes is voted out. If at the end of the day votes are tied, one player tied for the most votes will be picked at random.<br/>
-If a citizen is voted out on the first day, they will live until the end of the second day.<br/>
-If the mafioso or godfather is voted out, or a citizen is voted out on any day except the first, they will die immediately.<br/>
-This repeats until a win condition is reached:<br/>
  -If the mafia has the same number of living players as the citizens or more (for example, 2-1 if a citizen is voted out on day 1 and 2, or 1-1 if a citizen, then mafioso, then citizen is voted out) the mafia will win.<br/>
  -If the citizens kill the godfather, the citizens will win.<br/>
