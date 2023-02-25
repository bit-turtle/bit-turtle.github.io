var config = {
    apiKey: "AIzaSyA1XTyTuAzwYFHUruCVUuQ9Og7JeoyGQWg",
    authDomain: "attack-of-the-cubes-scoreboard.firebaseapp.com",
    projectId: "attack-of-the-cubes-scoreboard",
    storageBucket: "attack-of-the-cubes-scoreboard.appspot.com",
    messagingSenderId: "908280368156",
    appId: "1:908280368156:web:35571219fbb5a2934663d9"
};
const app = firebase.initializeApp(config);
const db = app.firestore(app);
const ref = [db.collection("easy"),db.collection("medi"),db.collection("hard")];
var scoreboard = [];
var scoreboards_loaded = 0;
function getScoreboard() {
	scoreboard = [[],[],[]];
	scoreboards_loaded = 0;
	ref[0].get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			scoreboard[0].push(doc.data());
			if(scoreboard[0][scoreboard[0].length-1].name.length>8){scoreboard[0][scoreboard[0].length-1].name.slice(0,7);scoreboard[0][scoreboard[0].length-1].name+="...";}
		});
		scoreboard[0].sort(function(a,b){if(a.id<b.id){return -1}if(a.id > b.id){return 1}return 0;});
		scoreboards_loaded++;
	})
	.catch((error) => {
		console.log("Error getting scoreboard");
	});
	ref[1].get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			scoreboard[1].push(doc.data());
			if(scoreboard[1][scoreboard[1].length-1].name.length>8){scoreboard[1][scoreboard[1].length-1].name.slice(0,7);scoreboard[1][scoreboard[1].length-1].name+="...";}
		});
		scoreboard[1].sort(function(a,b){if(a.id<b.id){return -1}if(a.id > b.id){return 1}return 0;});
		scoreboards_loaded++;
	})
	.catch((error) => {
		console.log("Error getting scoreboard");
	});
	ref[2].get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			scoreboard[2].push(doc.data());
			if(scoreboard[2][scoreboard[2].length-1].name.length>8){scoreboard[2][scoreboard[2].length-1].name.slice(0,7);scoreboard[2][scoreboard[2].length-1].name+="...";}
		});
		scoreboard[2].sort(function(a,b){if(a.id<b.id){return -1}if(a.id > b.id){return 1}return 0;});
		scoreboards_loaded++;
	})
	.catch((error) => {
		console.log("Error getting scoreboard");
	});
}
function addScore(score,diff){
	if (scoreboards_loaded === 3) {
		if (scoreboard[diff].some(function(e){return e.score<score})) {
			if (diff === 0) {
				var name = window.prompt("You Are On The [Easy] Scoreboard!\nEnter The Name You Want To Use Below:");
			}
			else if (diff === 1) {
				var name = window.prompt("You Are On The [Medium] Scoreboard!\nEnter The Name You Want To Use Below:");
			}
			else if (diff === 2) {
				var name = window.prompt("You Are On The [Hard] Scoreboard!\nEnter The Name You Want To Use Below:");
			}
			if (score>scoreboard[diff][0].score) {
				ref[diff].doc("5").update({name: scoreboard[diff][3].name,score: scoreboard[diff][3].score});
				ref[diff].doc("4").update({name: scoreboard[diff][2].name,score: scoreboard[diff][2].score});
				ref[diff].doc("3").update({name: scoreboard[diff][1].name,score: scoreboard[diff][1].score});
				ref[diff].doc("2").update({name: scoreboard[diff][0].name,score: scoreboard[diff][0].score});
				ref[diff].doc("1").update({name: name,score: score});
				window.alert("#1st Place!\nScoreboard Updated.");
			}
			else if (score>scoreboard[diff][1].score) {
				ref[diff].doc("5").update({name: scoreboard[diff][3].name,score: scoreboard[diff][3].score});
				ref[diff].doc("4").update({name: scoreboard[diff][2].name,score: scoreboard[diff][2].score});
				ref[diff].doc("3").update({name: scoreboard[diff][1].name,score: scoreboard[diff][1].score});
				ref[diff].doc("2").update({name: name,score: score});
				window.alert("#2nd Place!\nScoreboard Updated.");
			}
			else if (score>scoreboard[diff][2].score) {
				ref[diff].doc("5").update({name: scoreboard[diff][3].name,score: scoreboard[diff][3].score});
				ref[diff].doc("4").update({name: scoreboard[diff][2].name,score: scoreboard[diff][2].score});
				ref[diff].doc("3").update({name: name,score: score});
				window.alert("#3rd Place!\nScoreboard Updated.");
			}
			else if (score>scoreboard[diff][3].score) {
				ref[diff].doc("5").update({name: scoreboard[diff][3].name,score: scoreboard[diff][3].score});
				ref[diff].doc("4").update({name: name,score: score});
				window.alert("#4th Place!\nScoreboard Updated.");
			}
			else if (score>scoreboard[diff][4].score) {
				ref[diff].doc("5").update({name: name,score: score});
				window.alert("#5th Place!\nScoreboard Updated.");
			}
		}
	}
	else {
		window.setTimeout(function(){addScore(score,diff)},100);
	}
}
function newScore(score,diff){
	getScoreboard();
	addScore(score,diff);
}
