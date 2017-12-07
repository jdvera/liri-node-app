var twitterKeys = require("./twitterKeys.js");
var spotifyKey = require("./spotifyKey.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var open = require("open");

var command = process.argv[2];
var mediaName = process.argv.slice(3).join(" ");

var spotify = new Spotify({
	id: spotifyKey.key,
	secret: spotifyKey.key_secret
});

var client = new Twitter({
	consumer_key: twitterKeys.consumer_key,
	consumer_secret: twitterKeys.consumer_secret,
	access_token_key: twitterKeys.access_token_key,
	access_token_secret: twitterKeys.access_token_secret
});

var params = {screen_name: 'def_not_james', count: 20};


var myTweets = function() {
	client.get("statuses/user_timeline", params, function(err, tweets, response) {
		if (err) {
			console.log("##################\n\nError\n\n##################" + JSON.stringify(err, null, 2));
		};

		console.log("##################");
		console.log("#     Tweets     #");
		console.log("#      from      #");
		console.log("#  def_not_james #");
		console.log("##################");
		for (var i = 0; i < tweets.length; i++) {
			console.log("\n" + (i + 1) + ")  Date: " + tweets[i].created_at.slice(0, 19));
			if (i < 9) {
				console.log("   Tweet: " + tweets[i].text);

			} else {
				console.log("    Tweet: " + tweets[i].text);

			}
		};
	})
};



var spotifyThisSong = function() {
	if (mediaName.length == 0) {
		mediaName = "The Sign ace of base";
	}
	spotify.search({
		type: "track",
		query: mediaName,
		limit: 2
	}, function(err, data) {
		if (err) {
			console.log("#############   " + err);
		}
		else {
			console.log("\nArtist(s): " + data.tracks.items[0].artists[0].name);
			console.log("Title: " + data.tracks.items[0].name);
			console.log("Preview Link: " + data.tracks.items[0].preview_url);
			console.log("Album: " + data.tracks.items[0].album.name);
		};
	})
};



var movieThis = function() {
	if (mediaName.length == 0) {
		mediaName = "Mr. nobody";
	}
	request({
		url: "http://www.omdbapi.com/?apikey=trilogy&t=" + mediaName,
		json: true
	}, function(err, response, body) {
		if(err || typeof body.Title != "string") {
			console.log("######" + err);
		}
		else {
			var arr = body.Ratings;
			var rt = false;
			var index;
			console.log("Title: " + body.Title);
			console.log(typeof body.Title);
			console.log("Year: " + body.Year);
			console.log("IMDB Rating: " + body.imdbRating);
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].Source == "Rotten Tomatoes") {
					rt = true;
					index = i;
				}
			}
			if (rt) {
				console.log("Rotten Tomatoes Rating: " + body.Ratings[i].Value);
			}
			console.log("Countries: " + body.Country);
			console.log("Language(s): " + body.Language);
			console.log("Plot: " + body.Plot);
			console.log("Actors: " + body.Actors);
		}
	})
};



var doWhatItSays = function() {
	open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
	fs.readFile("random.txt", "utf8", function(error, data) {
		var arr = data.split(",");
		command = arr[0];
		mediaName = arr[1];
		commFunc();
	})
};

var commFunc = function() {
	switch (command) {
		case "my-tweets":
			myTweets();
			break;

		case "spotify-this-song":
			spotifyThisSong();
			break;

		case "movie-this":
			movieThis();
			break;

		case "do-what-it-says":
			doWhatItSays();
			break;
	}
}

commFunc();