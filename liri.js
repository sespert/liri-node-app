//to read and set any environment variables with the dotenv package
require("dotenv").config();
// fs is a core Node package for reading and writing files
var fs = require("fs");
//Import keys.js file
var keys = require("./keys");
//Axios package included to retrieve data from the APIs
var axios = require("axios");
//Include moment to format dates
var moment = require("moment");
//Include Spotify package
var Spotify = require("node-spotify-api");
//Access keys information for Spotify API 
spotify = new Spotify(keys.spotify);

//Read commands from prompt
var userCommand = process.argv[2];
var userChoice = process.argv;
var nameToSearch = "";

//For loop to grab user input if more than one word
for (var i = 3; i < userChoice.length; i++) {

  if (i > 3 && i < userChoice.length) {
    nameToSearch = nameToSearch + "+" + userChoice[i];
  }
  else {
    nameToSearch += userChoice[i];
  }
}

if (userCommand === "do-what-it-says") {
  readTextFile();
} else {
  readUserInput();
}

//What to do with each user command
function readUserInput() {
  if (userCommand === "concert-this") {
    //Call the function to search concerts for a band with Bands In Town API
    searchBand(nameToSearch);

  } else if (userCommand === "spotify-this-song") {
      //Call the function to search songs with Spotify
      //If no song entered, search the song "The Sign"
      if (!nameToSearch) {
          searchSong("The Sign");
      } else {
          searchSong(nameToSearch);
      }

  } else if (userCommand === "movie-this") {
    //Call the function to search movie info with OMDB API
    //If no movie entered, search Mr.Nobody
    if (!nameToSearch) {
      searchMovie("Mr.Nobody")
    } else {
      searchMovie(nameToSearch);
    }
  }
} 


//Function to search movie info with OMDB API
function searchMovie(string) {
  axios.get(`http://www.omdbapi.com/?t=${string}&y=&plot=short&apikey=trilogy`).then(
    function(response) {
      console.log("==============================================");
      console.log("");
      console.log("Title of the movie: " + response.data.Title);
      console.log("Year the movie came out: " + response.data.Year);
      console.log("IMDB rating of the movie: " + response.data.Ratings[0].Value);
      console.log("Rotten Tomatoes rating of the movie: " + response.data.Ratings[1].Value);
      console.log("Country where the movie was produced: " + response.data.Country);
      console.log("Language of the movie: " + response.data.Language);
      console.log("Plot of the movie: " + response.data.Plot);
      console.log("Actors in the movie: " + response.data.Actors);
      console.log("");
      console.log("==============================================");
    }
  )
};

//Function to search bands concert with Bands In Town API
function searchBand(string) {
  axios.get(`https://rest.bandsintown.com/artists/${string}/events?app_id=codingbootcamp`).then(
    function(response) {
      console.log("==============================================");
      console.log("");
      for (var i=0; i<5;i++){
        console.log("Name of the venue: " + response.data[i].venue.name);
        console.log("Venue location: " + response.data[i].venue.city + ", " + response.data[i].venue.region);
        console.log("Date of the Event: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
        console.log("");
      }
      console.log("==============================================");
    }
  )
};

//Function to search song info with Spotify API
function searchSong(param) {
  spotify.search({ type: 'track', query: param }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }
    console.log("==============================================");
    console.log("");
    var songs = data.tracks.items;
    for (var i=0; i<songs.length;i++){
      console.log("Song's name: " + songs[i].name);
      console.log("Artist: " + songs[i].artists.map(getArtistsNames));
      console.log("Preview link: " + songs[i].preview_url);
      console.log("Album: " + songs[i].album.name);
      console.log("");
    } 
    console.log("==============================================");  
  });
}

//Function that helps us get the artist from the Spotify API object
function getArtistsNames(artist) {
  return artist.name;
}

function readTextFile () {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");
    console.log(dataArr);

    userCommand = dataArr[0];
    nameToSearch = dataArr[1];
    readUserInput();

  })
}
