require("dotenv").config();

var request = require("request");
var keys = require("./keys.js");
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api")


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var nodeArgs = process.argv;

if (process.argv[2] === "my-tweets") {
    getTweets();
} else if (process.argv[2] === "spotify-this-song") {
    getSong();
} // else if (process.argv[2] === "movie-this") {
//     getMovie();
// } else if (process.argv[2] === "do-what-it-says") {
//     whatItSays();
// };

function getTweets() {
    var params = {
        screen_name: 'MyNameIsLiri21'
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log(tweets.text);
        }
    });
};

function getSong() {
    var songInput = "The Sign Ace of Base";
    spotify.search({
        type: 'track',
        query: songInput
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data.tracks.items[0]);
        console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
        console.log("\nSong Name: " + data.tracks.items[0].name);
        console.log("\nSong Link: " + data.tracks.items[0].preview_url);
        console.log("\nAlbum Name: " + data.tracks.items[0].album.name);
    });
};