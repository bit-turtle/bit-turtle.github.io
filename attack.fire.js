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
const ref = db.collection("scoreboard")
var scoreboard = [];
var scoreboard_loading = false;
function getScoreboard() {
	ref.get().then((querySnapshot) => {
		scoreboard = [];
		querySnapshot.forEach((doc) => {
			scoreboard.push(doc.data());
		});
		scoreboard.sort(function(a,b){if(a.id<b.id){return -1}if(a.id > b.id){return 1}return 0;});
		scoreboard_loading = false;
	})
	.catch((error) => {
		console.log("Error getting scoreboard");
	});
}
function newScore(highscore){
	getScoreboard();
	if (scoreboard.some(function(e){return e.score<highscore})) {
		var name = window.prompt("You Are On The Scoreboard!\nEnter The Name You Want To Use Below:");
		if (highscore>scoreboard[0].score) {
			ref.doc("5").update({name: scoreboard[3].name,score: scoreboard[3].score});
			ref.doc("4").update({name: scoreboard[2].name,score: scoreboard[2].score});
			ref.doc("3").update({name: scoreboard[1].name,score: scoreboard[1].score});
			ref.doc("2").update({name: scoreboard[0].name,score: scoreboard[0].score});
			ref.doc("1").update({name: name,score: highscore});
			window.alert("#1st Place!\nScoreboard Updated.");
		}
		else if (highscore>scoreboard[1].score) {
			ref.doc("5").update({name: scoreboard[3].name,score: scoreboard[3].score});
			ref.doc("4").update({name: scoreboard[2].name,score: scoreboard[2].score});
			ref.doc("3").update({name: scoreboard[1].name,score: scoreboard[1].score});
			ref.doc("2").update({name: name,score: highscore});
			window.alert("#2nd Place!\nScoreboard Updated.");
		}
		else if (highscore>scoreboard[2].score) {
			ref.doc("5").update({name: scoreboard[3].name,score: scoreboard[3].score});
			ref.doc("4").update({name: scoreboard[2].name,score: scoreboard[2].score});
			ref.doc("3").update({name: name,score: highscore});
			window.alert("#3rd Place!\nScoreboard Updated.");
		}
		else if (highscore>scoreboard[3].score) {
			ref.doc("5").update({name: scoreboard[3].name,score: scoreboard[3].score});
			ref.doc("4").update({name: name,score: highscore});
			window.alert("#4th Place!\nScoreboard Updated.");
		}
		else if (highscore>scoreboard[4].score) {
			ref.doc("5").update({name: name,score: highscore});
			window.alert("#5th Place!\nScoreboard Updated.");
		}
	}
}
