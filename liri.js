var keys = require("./keys.js"); // Grab data from keys.js
var fs = require("fs"); // node package for reading and writing files
var request = require("request"); // node package for making http requests
var Twitter = require('twitter'); // node package that handles Twitter requests
var Spotify = require("node-spotify-api"); // node package that handles Spotify requests
//Prompts for command line syntax
var action = process.argv[2];
var value = process.argv[3];

//Spotify Exercise
/**
 * This is an example of a basic node.js script that performs
 * the Client Credentials oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */

//Twitter Exercise
// console.log("Twitter: ", keys.twitterKeys.consumer_key);
var client = new Twitter({
     consumer_key: keys.twitterKeys.consumer_key,
     consumer_secret: keys.twitterKeys.consumer_secret,
     access_token_key: keys.twitterKeys.access_token_key,
     access_token_secret: keys.twitterKeys.access_token_secret
});

function myTweets() {
	var params = {count: 2};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		console.log(tweets);
	  if (!error) {
	       for (var i = 0; i < tweets.length; i++) {
	            console.log(tweets[i].text + " Created on: " + tweets[i].created_at);
	            fs.appendFile('log.txt', tweets[i].text + " Created on: " + tweets[i].created_at + "\n", function(err) {
					if (err) {
						return console.log(err);
					}
	            });
	       }
	  } else {
	       console.log(error);
	  	}
	console.log("log.txt was updated with Twitter info!");
	});
}

// OMDB Exercise
function movieThis() {
	// Grab or assemble the movie name and store it in a variable called "movieName"
	var movieName = 'Mr. Nobody';
	if (value != undefined) {
		movieName = value;
	}

	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&plot=short&apikey=40e9cece";
	// This line is just to help us debug against the actual URL.
	// console.log(queryUrl);

	// Then create a request to the queryUrl
	request(queryUrl, function(error, response, body) {
	  // If the request is successful
		if (!error && response.statusCode === 200) {
            // console.log(JSON.parse(body));
            var movieData = JSON.parse(body);
			// Show the following on the console:
			// * Title of the movie.
			// * Year the movie came out.
			// * IMDB Rating of the movie.
			// * Rotten Tomatoes Rating of the movie.
			// * Country where the movie was produced.
			// * Language of the movie.
			// * Plot of the movie.
			// * Actors in the movie.
			var movieInfo = "* Movie Title: " + movieData.Title +
							"* The movie's Release Year is: " + movieData.Year +
							"* The movie's IMDB Rating is: " + movieData.Ratings[0].Value +
							"* The movie's Rotten Tomatoes Rating is: " + movieData.Ratings[1].Value +
							"* The movie was produced in: " + movieData.Country +
							"* The movie's Language is: " + movieData.Language +
							"* The movie's Plot is: " + movieData.Plot +
							"* The movie's Actors include: " + movieData.Actors
			
			var dataArr = movieInfo.split("*");
			
			for (i=0; i < dataArr.length; i++) {				
				console.log(dataArr[i].trim());
				// This block of code will create a file called "log.txt".
				// It will then print/append all the function responses into the file
				// 											  (err) => {
				fs.appendFile("log.txt", dataArr[i].trim()+"\n", function(err) {
					if (err) {
						return console.log(err);
					}
				});
			} 
		console.log("log.txt was updated with Movie info!");
	  	} else {
	       console.log(error);
	  	  }
	});
}

switch (action) {
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

	default:
		console.log("You must pass an action [my-tweets, spotify-this-song, movie-this, do-what-it-says] and a value");
		console.log("Example node liri.js movie-this Jumanji");
		break;
}