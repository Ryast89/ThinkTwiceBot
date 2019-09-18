const Discord = require('discord.js');
const client = new Discord.Client();
//const auth = require('./auth.json');
var players = ["empty", "empty", "empty", "empty", "empty"] // stores player usernames. TO BE REMOVED
var roles = ["citizen", "citizen", "citizen", "mafioso", "godfather"] // all possible roles.
var players2 = [
["empty", "role"], ["empty", "role"], ["empty", "role"], ["empty", "role"], ["empty", "role"]
]; // stores players and roles.
var players3; // original playerlist. Currently not in use, will be used to display roles aftr game ends

var votes = [
["empty", "vote"], ["empty", "vote"], ["empty", "vote"], ["empty", "vote"], ["empty", "vote"]
]; // tracks the votes of living players
var voter = -1; // number of player voting
var livingPlayers = 5; // number of live players
var gameStarted = false; // if the game has started or not
var markedPlayer = 0; // the player number of the citizen who dies on the first day
var citDead = false; // if a citizen is dead on the first day
var timer; // game timer
var livingMafia = 2; // number of live mafia players
var livingTown = 3; // number of live town players
var alreadyIn = false; // check if the user is already in the game
client.on('error', console.error); // Error catching - not sure if this even works but I haven't got an error recently when I used to get them after the bot ran for a while
var gameTimer = 1440; //time for each day in minutes.

//log in
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	
	if (msg.content.startsWith('/playerlist')) {
		msg.channel.send("current playerlist: " + players); 
	}
	
	// vote
	if (msg.content.startsWith('/vote') && gameStarted === true) {
		try {
			var args = msg.content.slice(5).split(' ,'); // the contents of the message after the /vote
			var user1 = msg.author.id // the author of the voting message
			var mentions = msg.mentions.users.first().id; // the user that is mentioned in the vote
			
			for(i = 0; i < players.length; i++) {
				if(players2[i][0] === user1) {
					voter = i
					votes[i][0] = msg.author.id;
				}
			}
			
			if(voter !== -1) {
				for(i = 0; i < players.length; i++) {

					if(players2[i][0] === mentions ) {
						msg.channel.send(msg.author + ' voted for ' + args)
						votes[voter][1] = mentions
					}
				
				}
			} else {
				msg.channel.send('You are either not in the game, or dead. Don\'t vote and don\'t talk please!');
			}
			
			if(voter != -1 && votes[voter][1] !== mentions) {
				msg.channel.send(args + ' is not in this game.');
			}
			voter = -1;
		} catch {
			msg.channel.send('You must tag the player you\'re voting.');
		}
		
		
		
		for(i = 0; i < players2.length; i++) {
			var number = 0;	
			for(j = 0; j < players2.length; j++) {
					
				if(votes[j][1] === players2[i][0]) {
					number++;
					if (number === Math.floor((livingPlayers/2) + 1)) {
						msg.channel.send(':hammer:');
						endDay(msg.channel.id);
					}
				}			
			}		 
		}
	} else if(msg.content.startsWith('/vote') && gameStarted === false) {
		  msg.channel.send("This game has not started yet.");
	}
  
  
	// votecount
	if (msg.content.startsWith('/vc') && gameStarted === true) {
		var output = "";
		for(i = 0; i < players2.length; i++) {
			try {
				output += client.users.get(votes[i][0]).username + ' is voting for ' + client.users.get(votes[i][1]).username + "\n";
			} catch {}
		}
		msg.channel.send(output);
		
		// vote tally
		try {
			var tallyOutput = "";
			for(i = 0; i < players2.length; i++) {
				var number = 0;
				var people = " (";
				for(j = 0; j < players2.length; j++) {
					if(votes[j][1] === players2[i][0]) {
						number++;
						people = people += client.users.get(players2[j][0]).username + ", ";
					}
				}

				people = people.slice(0, people.length - 2);
				people += ")";
				if(number !== 0) {
					tallyOutput += client.users.get(players2[i][0]).username + ":" + number + " " + people + "\n"
				}
				 
			}
			
			if(tallyOutput !== "") {
				msg.channel.send(tallyOutput);
			} else {
				msg.channel.send('Nobody has a vote against them on this lovely day.');
			}
		}catch{}
	} else if(msg.content.startsWith('/vc') && gameStarted === false) {
		  msg.channel.send("This game has not started yet.");
	}
	
	if (msg.content.startsWith('/settime') && gameStarted === false) {
		try {
			var args = msg.content.slice(8).split(' ,');
			const amount = parseInt(args[0]);
			if (isNaN(amount)) {
				return message.reply('that doesn\'t seem to be a valid number.');
			} else if ((amount >= 1) && (amount <= 4320)) {
				gameTimer = args;
				msg.channel.send("the timer is now set for " + args + " minute(s).");
			} else {
				msg.channel.send("no");
			}
		} catch {
			msg.channel.send("no");
		}
	}
		
	
	// out
	if (msg.content.startsWith('/out') && gameStarted === false) {
		try {
			const user1 = msg.member.user.tag
			msg.channel.send(msg.author + ' left the game!');
			for(i = 0; i < players.length; i++) {
				if(players[i] === user1) {	
					players[i] = "empty";
					players2[i][0] = "empty";
					break;
				}
			}
		} catch {}
	} else if(msg.content.startsWith('/out') && gameStarted === false) {
		msg.channel.send('the game already started. Too late!');
	}

	//in
	if (msg.content.startsWith('/in') && gameStarted === false) {
		try {
			const user1 = msg.member.user.tag
		

			for(i = 0; i < players.length; i++) {
				if(players[i] === "empty") {
					for(j = 0; j < players.length; j++) {
						if(players[j] === user1) {
						alreadyIn = true
						}
					}
					if(alreadyIn === false) {
						msg.channel.send(msg.author + ' joined the game!');
						players[i] = user1;
						break;
					} else {
						msg.channel.send('you are already in this game, ' + user1);
						break;
					}
				}
			}
			if(alreadyIn === false) {
				for(i = 0; i < players2.length; i++) {
					if(players2[i][0] === "empty") {
						players2[i][0] = msg.author.id;
						break;
					}else if(players2[i][0] === "empty" && alreadyIn === true) {
						break;
					}
				}
				if(players[4] !== "empty") {
					msg.channel.send('The game is full! Please wait 15 seconds before talking. (or don\'t, I can\'t stop you)');
					players3 = players2;
					for(i = 0; i < players.length;) {
						var rng = Math.floor(Math.random()*5);
						if(players2[rng][1] === "role") {
							players2[rng][1] = roles[i]
							i++
						}
					}
					for(i = 0; i < 5; i++) {
						if(players2[i][1] === "citizen") {
							client.users.get(players2[i][0]).send("You are a Citizen! you win when the godfather is dead. If you are lynched on day 1, you will not die until the end of the following day.");
						} else if(players2[i][1] === "mafioso") {
							for(j = 0; j < players.length; j++) {
								if (players2[j][1] === "godfather") {
									client.users.get(players2[i][0]).send("You are a Mafioso! you win when the mafia has parity with the town. You will lose if the godfather is lynched. Your godfather is " + players[j]);
								}
							}
						} else if(players2[i][1] === "godfather") {
							for(j = 0; j < players.length; j++) {
								if (players2[j][1] === "mafioso") {
									client.users.get(players2[i][0]).send("You are a Godfather! you win when the mafia has parity with the town. You will lose if you are lynched. Your mafioso is " + players[j]);
								}
							}
						}
					}
					msg.channel.send('players:');
					msg.channel.send(players);
					timer = setTimeout(function(){ endDay(msg.channel.id) }, gameTimer * 60000);
					setTimeout(function(){msg.channel.send("15 seconds have passed")}, 15000);
					gameStarted = true;
				}
			} else {
				alreadyIn = false;
			}
		} catch {}
	} else if(msg.content.startsWith('/in') && gameStarted === true) {
		msg.channel.send("This game has already started.");
	}
  
	// help
	if (msg.content.startsWith('/help')) {
		msg.author.send("Thank you for using the Think Twice bot! \nCurrently, the bot is not finished," +
		"but there are a few things you can do.\n-/help: Well, you just used it. I send you this message.\n" +
		"-/in: Join the current game. The game will start when there is five players.\n-/vote [tag]: vote" +
		"for the user you tag.\n-/unvote: unvote the player you're currently voting.\n-/vc: call a votecount.\n" +
		"-/clear: clear the current game.\n-/settime (time): set the timer of the next game in minutes. The number of minutes in 24 hours is 1440 (this is also the default value)\n \nIf I'm not doing anything, I'm probably powered off or broken." +
		"Let Ryast know :)\n\nDo be patient with me, because sometimes it takes a while to send a message!")
	  }
  
	// clear
	if (msg.content.startsWith('/clear')) {
		clear();
		msg.channel.send('cleared.');
	}
  
	// unvote
	if (msg.content.startsWith('/unvote') && gameStarted === true) {
		for(i = 0; i < players.length; i++) {
			if(votes[i][0] === msg.author.id) {
				votes[i][1] = "vote";
				msg.channel.send(msg.author + ' unvoted.');
			}
		}
	} else if (msg.content.startsWith('/unvote') && gameStarted === false) {
		msg.channel.send("This game has not started yet.");
	}
  
  
  
  //end Day
	function endDay(channelToEnd) {
		clearTimeout(timer);
		var mostVotes = 0;
		var mostVoted = ""
		msg.client.channels.get(channelToEnd).send("day has ended");
	
	
		try {
			var tallyOutput = "";
			for(i = 0; i < players2.length; i++) {
				var number = 0;
				var people = " (";
				for(j = 0; j < players2.length; j++) {
					if(votes[j][1] === players2[i][0]) {
						number++;
						people = people += client.users.get(players2[j][0]).username + ", ";
					}	
				}
				people = people.slice(0, people.length - 2);
				people += ")";
				if(number !== 0) {
					tallyOutput += client.users.get(players2[i][0]).username + ":" + number + " " + people + "\n"
					if (number > mostVotes) {
						mostVotes = number;
						mostVoted = players2[i][0];
					} else if (number === mostVotes) {
						mostVoted += " " + players2[i][0] 
					}
				}
			 
			}
			if(tallyOutput !== "") {
				msg.channel.send(tallyOutput);
				if(mostVoted.includes(" ")) {
					msg.channel.send("uh-oh, that's a rand. Choosing a random player with " + mostVotes + ' votes.');
					var mostVoteds = mostVoted.split(" ");
					mostVoted = mostVoteds[Math.floor(Math.random()*mostVoteds.length)]
				}
				msg.channel.send(client.users.get(mostVoted) + ' was voted to be lynched, with ' + mostVotes + ' votes.');
				for(i = 0; i < players2.length; i++) {
					if (players2[i][0] === mostVoted) {
						if(players2[i][1] === "godfather") {
							msg.channel.send('their role was ' + players2[i][1] + '!');
							msg.channel.send('Town has won!\nPlayers & roles (will be fixed):\n' + players3);
							break;
						} else if(players2[i][1] === "mafioso") {
							msg.channel.send('their role was ' + players2[i][1]);			
							players2.splice(i, 1); 								
							players.splice(i, 1);
							msg.channel.send('living players:\n' + players);
							votes = [
							["empty", "vote"], ["empty", "vote"], ["empty", "vote"], ["empty", "vote"], ["empty", "vote"]
							];
							votes.splice(i, 1);
							livingPlayers--;
							livingMafia--;
						} else if(players2[i][1] === "citizen" && (livingPlayers === 5 && citDead === false)) {
							msg.channel.send('their role was ' + players2[i][1] + '\nThey will not die until the end of day 2.');
							markedPlayer = players2[i][0];
							citDead = true;
							votes = [
							["empty", "vote"], ["empty", "vote"], ["empty", "vote"], ["empty", "vote"], ["empty", "vote"]
							];
						} else if(players2[i][1] === "citizen" && (livingPlayers !== 5 || citDead === true)) {
							msg.channel.send('their role was ' + players2[i][1]);			
							players2.splice(i, 1); 								
							players.splice(i, 1);
							msg.channel.send('living players:\n' + players);
							votes = [
							["empty", "vote"], ["empty", "vote"], ["empty", "vote"], ["empty", "vote"], ["empty", "vote"]
							];
							votes.splice(i, 1);
							livingPlayers--;
							livingTown--;
							if(livingMafia >= livingTown) {
								msg.channel.send("Mafia has achieved parity. The mafia wins! (just IDs rn, will be fixed)\nPlayers and roles:\n" + players)
								break;
							}
						}
					
						if(citDead && livingPlayers !== 5) {
							msg.channel.send("a citizen died on day 1, and this was triggered. The player marked to die is" + client.users.get(markedPlayer).username);
							for(i = 0; i < players2.length; i++) {
								if (players2[i][0] === markedPlayer) {
									players2.splice(i, 1); 								
									players.splice(i, 1);
									msg.channel.send('living players:\n' + players);
									votes = [
									["empty", "vote"], ["empty", "vote"], ["empty", "vote"], ["empty", "vote"], ["empty", "vote"]
									];
									votes.splice(i, 1);
									livingPlayers--;
									livingTown--;
								}
							
							}
							citDead = false;
						}
						msg.channel.send('The next day begins')
						timer = setTimeout(function(){ endDay(msg.channel.id) }, gameTimer * 60000);
					}
				}
			}
		}catch{}
	}
//clear the game, reset all variables
	function clear () {
		clearTimeout(timer);
		players = ["empty", "empty", "empty", "empty", "empty"]
		roles = ["citizen", "citizen", "citizen", "mafioso", "godfather"]
		players2 = [
		["empty", "role"], ["empty", "role"], ["empty", "role"], ["empty", "role"], ["empty", "role"]
		];

		votes = [
		["empty", "vote"], ["empty", "vote"], ["empty", "vote"], ["empty", "vote"], ["empty", "vote"]
		];
		voter = 0;
		livingPlayers = 5;
		gameStarted = false;
		markedPlayer = 0;
		citDead = false;
		timer;
		livingMafia = 2;
		livingTown = 3;
		timer = 1440;

	}
});

client.login(process.env.BOT_TOKEN);
