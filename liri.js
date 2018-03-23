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
} else if (process.argv[2] === "movie-this") {
    getMovie();
} else if (process.argv[2] === "do-what-it-says") {
    whatItSays();
};

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
    var songInput = "";
    if (!process.argv[3]) {
        songInput = "The Sign Ace of Base";
    } else {
        for (var i = 3; i < nodeArgs.length; i++) {
            songInput = songInput + " " + nodeArgs[i];
        }
    };
    spotify.search({
        type: 'track',
        query: songInput
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
        console.log("\nSong Name: " + data.tracks.items[0].name);
        console.log("\nSong Link: " + data.tracks.items[0].preview_url);
        console.log("\nAlbum Name: " + data.tracks.items[0].album.name);
    });
};

function getMovie() {
    var movieInput = "";
    if (!process.argv[3]) {
        movieInput = "Mr.+Nobody";
    } else {
        for (var i = 3; i < nodeArgs.length; i++) {
            movieInput = movieInput + "+" + nodeArgs[i];
        }
    };
    
    var queryUrl = "http://www.omdbapi.com/?t=" + movieInput + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {

                // If the request is successful
                if (!error && response.statusCode === 200) {
                    console.log("Movie Name: " + JSON.parse(body).Title);
                    console.log("Release Year: " + JSON.parse(body).Year);
                    console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
                    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                    console.log("Country: " + JSON.parse(body).Country);
                    console.log("Language: " + JSON.parse(body).Language);
                    console.log("Plot: " + JSON.parse(body).Plot);
                    console.log("Actors: " + JSON.parse(body).Actors);
                }
    });
};

function whatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
        
        var randomArray = data.split(",");
        var songInput = randomArray[1];

        spotify.search({
            type: 'track',
            query: songInput
        }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
            console.log("\nSong Name: " + data.tracks.items[0].name);
            console.log("\nSong Link: " + data.tracks.items[0].preview_url);
            console.log("\nAlbum Name: " + data.tracks.items[0].album.name);
        });
    });
};