require("dotenv").config();
var fs = require("fs");
var request = require("request");
var keys = require("./key");
var Spotify = require("node-spotify-api");
var omdb = require("omdb");
var spotify = new Spotify(keys.spotify);
var type = process.argv[2];
var research = process.argv.splice(3).join(" ");

console.log(research);

function append() {
  fs.appendFile("log.txt", research + ", ", function(err) {});
}

function music() {
  spotify
    .search({ type: "track", query: research, limit: 1 })
    .then(function(response) {
      var artist = response.tracks.items[0].artists[0].name;
      var album = response.tracks.items[0].album.name;
      var link = response.tracks.items[0].artists[0].external_urls.spotify;
      console.log("==========================================");
      console.log("The Song is: " + research);
      console.log("The Band is: " + artist);
      console.log("The Album is: " + album);
      console.log("The Preview Link is: " + link);
    })
    .catch(function(err) {
      console.log(err);
    });
  append();
}

function concert() {
  var queryURL =
    "https://rest.bandsintown.com/artists/" +
    research +
    "/events?app_id=codingbootcamp";

  request(queryURL, function(error, response, body) {
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++\n");
    var concert = JSON.parse(body)[0];
    console.log("Name of Venue: " + concert.venue.name + "\n");
    console.log(
      "Venue Location: " +
        concert.venue.city +
        ", " +
        concert.venue.region +
        "\n"
    );
    var datetime = concert.datetime;
    var year = datetime.substring(0, 4);
    var month = datetime.substring(5, 7);
    var day = datetime.substring(8, 10);
    console.log("Date of the Event: " + month + "/" + day + "/" + year + "\n");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++\n");
  });
  append();
}

function movie() {
  request("http://www.omdbapi.com/?apikey=trilogy&t=" + research, function(
    err,
    response,
    body
  ) {
    if (err) {
      return console.error(err);
    } else {
      var movie = JSON.parse(body);
      console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++\n");
      console.log("Movie Title: " + movie.Title);
      console.log("Year: " + movie.Year);
      console.log(movie.Ratings[0].Source + ": " + movie.Ratings[0].Value);
      console.log(movie.Ratings[1].Source + ": " + movie.Ratings[1].Value);
      console.log("Conutry: " + movie.Country);
      console.log("Language: " + movie.Language);
      console.log("Plot: " + movie.Plot);
      console.log("Actors: " + movie.Actors);
      console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++\n");
    }
  });
  append();
}

function define() {
  if (type === "spotify-this-song") {
    if (research === "") {
      research = "The Sign";
    }
    music();
  }

  if (type === "concert-this") {
    concert();
  }

  if (type === "movie-this") {
    if (research === "") {
      research = "Mr.Nobody";
    }
    movie();
  }
  if (type === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
      console.log(data);

      var file = data.split(",");
      type = file[0];
      research = file[1];
      define();
    });
  }
}

define();
