require("dotenv").config();

var request = require("request");
var keys = require("./keys.js");
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api")


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

