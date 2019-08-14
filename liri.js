require("dotenv").config();

var Spotify = require("node-spotify-api");

var keys = require("./key");

var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);



var nodeArgs = process.argv;

var command = process.argv[2];
var userInput = process.argv.slice(3).join(" ");



function spotifySong() {
spotify.search({
    type: "track",
    query: userInput
}, function (err, data) {
    if (err) {
        console.log("There is an error" + err);
        return;
    }
    var songs = data.tracks.items;
    for (var i = 0; i < songs.length; i++){
        console.log("--------------------------");
        console.log("Artist: " + songs[i].artists[0].name);
        console.log("Name: " + songs[i].name);
        console.log("Link: " + songs[i].external_urls.spotify);
        console.log("Album: " + songs[i].album.name);
    }
})
}

function movie () {
    var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);
    
    axios.get(queryUrl).then(
      function(response) {
       console.log("------------------------------")
        console.log("Title: " + response.data.Title);
        console.log("Release Year: " + response.data.Year);
        console.log("Rating: " + response.data.Rated);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
        console.log("Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
      })
      .catch(function(error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log("---------------Data---------------");
          console.log(error.response.data);
          console.log("---------------Status---------------");
          console.log(error.response.status);
          console.log("---------------Status---------------");
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an object that comes back with details pertaining to the error that occurred.
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
    
}

function concert () {
    var queryUrl = "https://rest.bandsintown.com/artists/"+ userInput + "/events?app_id=codingbootcamp";

    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);
    
    axios.get(queryUrl).then(
      function(response) {
        var concerts = response.data

        for (var i=0; i < concerts.length; i++ ){
       console.log("------------------------------")
       console.log("Venue: " + concerts[i].venue.name);
       console.log("Location: " + concerts[i].venue.city + ", " + concerts[i].venue.region);
       console.log("Date: " + moment(concerts[i].datetime).format("MM/DD/YYYY"));
      }

    })
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
      
        // We will then print the contents of data
        console.log(data);
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
        console.log(dataArr);
      
        command = dataArr[0];
        userInput = dataArr[1]

        if(command === "spotify-this-song") {
            spotifySong();
        }else{
            console.log("Liri Doesn't Know That");
        }
      
      });
      
    console.log("do what it says function running");
}


switch (command) {
    case "concert-this": concert();
    break;
    case "movie-this": movie();
    break;
    case "spotify-this-song": spotifySong();
    break;
    case "do-what-it-says": doWhatItSays();
    break;
    default:
        console.log("LIRI doesn't know that");
}