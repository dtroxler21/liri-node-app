require("dotenv").config();

// Using npm require to grab files and packages
var request = require("request");
var keys = require("./keys.js");
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api")

// Creating variables for the Spotify and Twitter keys from keys.js
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Creating a variable for the console arguments
var nodeArgs = process.argv;

// Finding out what command is being asked and running their respective function
if (process.argv[2] === "my-tweets") {
    getTweets();
} else if (process.argv[2] === "spotify-this-song") {
    getSong();
} else if (process.argv[2] === "movie-this") {
    getMovie();
} else if (process.argv[2] === "do-what-it-says") {
    whatItSays();
};

// Function to get the tweets from alias account
function getTweets() {
    var params = {
        screen_name: 'MyNameIsLiri21'
    };
    // Using the keys we are getting the tweets and displaying them on the console
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        // Only displaying the tweets if there is not an error
        if (!error) {
            for (var i=0; i < 20; i++) {
                console.log(tweets[i].text);
            };
        };
    });
};

// Function to get the song requested by the user
function getSong() {
    // Variable to store the song name
    var songInput = "";
    // If there the user did not specify a song, then the default is The Sign
    if (!process.argv[3]) {
        songInput = "The Sign Ace of Base";
    } else {
        // Creating the song name so that are all arguments are included if the song is more than one word
        for (var i = 3; i < nodeArgs.length; i++) {
            songInput = songInput + " " + nodeArgs[i];
        }
    };
    // Searching spotify with the song name
    spotify.search({
        type: 'track',
        query: songInput
    }, function (err, data) {
        // If there is an error then display it on the console
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // Displaying the different aspects of the song
        console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
        console.log("\nSong Name: " + data.tracks.items[0].name);
        console.log("\nSong Link: " + data.tracks.items[0].preview_url);
        console.log("\nAlbum Name: " + data.tracks.items[0].album.name);
    });
};

// Function to get movie requested by user
function getMovie() {
    // Variable to store the movie name
    var movieInput = "";
    // Default is Mr. Nobody
    if (!process.argv[3]) {
        movieInput = "Mr.+Nobody";
    } else {
        // Looping through to make sure we get every word in the movie name
        for (var i = 3; i < nodeArgs.length; i++) {
            movieInput = movieInput + "+" + nodeArgs[i];
        }
    };
    // Creating the URL so that we can get the API information
    var queryUrl = "http://www.omdbapi.com/?t=" + movieInput + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {
                // If the request is successful display this information
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

// Function for do-what-it-says command
function whatItSays() {
    // Using fs package to read the random.txt file
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If there any errors it will log the error to the console
        if (error) {
          return console.log(error);
        }
        // Splitting the text into an array so that the song is by itself
        var randomArray = data.split(",");
        // Storing the song name in a variable
        var songInput = randomArray[1];
        // Searching spotify with the song name from random.txt and displaying information
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