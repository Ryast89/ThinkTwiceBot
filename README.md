# ThinkTwiceBot
Bot to play a mafia variant called Think Twice\n

The game rules are as follows:\n
-The game starts when five players have joined.\n
-Each day lasts for 24 hours (shortened to 5 minutes currently for testing).\n
-Players vote on which player they want to be voted out\n
-At the end of the 24 hour day, or when any player reaches 3 votes, the player with the most votes is voted out. If at the end of the 24 hour day votes are tied, one player tied for the most votes will be picked at random.\n
-If a citizen is voted out on the first day, they will live until the end of the second day.\n
-If the mafioso or godfather is voted out, or a citizen is voted out on any day except the first, they will die immediately.\n
-This repeats until a win condition is reached:\n
  -If the mafia has the same number of living players as the citizens or more (for example, 2-1 if a citizen is vote out on day 1 and 2,      or 1-1 if a citizen, then mafioso, then citizen is voted out) the mafia will win.\n
  -If the citizens kill the godfather, the citizens will win.\n
