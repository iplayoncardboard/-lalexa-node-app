require("dotenv").config();

const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const keys = require('./keys.js');
const readline = require('readline');
const request = require('request');
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });


let spotify = new Spotify(keys.spotify);
let twitter = new Twitter(keys.twitter);


welcome();

//* `my-tweets`
function myTweets(){

    let params = {screen_name: 'ehurst01'};
    twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
        // console.log(response)
        if(error){
            rl.close();
            console.log(error);
            
        }

        else  if (!error) {
            console.log(JSON.stringify(tweets,null,2));
            for(let i=0; i<20; i++){
                console.log('\n'+tweets[i].text+"\nposted on "+tweets[i].created_at);
            }
            rl.close();
        }
    });
}
//* `spotify-this-song`
  function spotifyThis(song){
      if(song){
            spotify.search({ type: 'track', query: song })
            .then(function(response) {
              rl.close();
                // Artist(s)
                // The song's name
                
                console.log('Artist: ' + JSON.stringify(response.tracks.items[0].album.artists[0].name,null,2));
                // A preview link of the song from Spotify
                console.log('Preview: '+ JSON.stringify(response.tracks.items[0].preview_url,null,2));
                // The album that the song is from
                console.log('Album: '+ JSON.stringify(response.tracks.items[0].album.name,null,2));
                return
            })
            .catch(function(err) {
              console.log(err);
              rl.close();
            });

    }
    else{
        rl.question("Enter a track: ", (response)=>{
            spotify.search({ type: 'track', query: response })
            .then(function(response) {
              rl.close();
                // Artist(s)
                // The song's name
                
                console.log('Artist: ' + JSON.stringify(response.tracks.items[0].album.artists[0].name,null,2));
                // A preview link of the song from Spotify
                console.log('Preview: '+ JSON.stringify(response.tracks.items[0].preview_url,null,2));
                // The album that the song is from
                console.log('Album: '+ JSON.stringify(response.tracks.items[0].album.name,null,2));
            })
            .catch(function(err) {
              console.log(err);
              rl.close();
            });
        });
    }

  }

//* `do-what-it-says`
function doThings(){
    const filePath = './random.txt'
    console.log('Doin Stuff');

    fs.readFile(filePath,'utf8', (err, data)=> {
        if(err){
            return console.log(err);
        }
        //split on ,
        let commandArray = data.split(',');
        processRequest(commandArray[0], commandArray[1]);
    });

}

//for fun
function nukes(){
    console.log('The only winning move is not to play.');
}


// Welcome message to user
function welcome(){
    console.log('Shall we play a game?');
    console.log ('my-tweets');
    console.log ('spotify-this-song');
    console.log ('movie-this');
    console.log ('do-what-it-says');
    console.log ('\nGlobal-Thermalnuclear-War')
    rl.question(':', (response)=> {
        // rl.close();
        let action = response.toLocaleLowerCase().trim();

            
            processRequest(action)
        });
}


function movieThis (){
    rl.question('Enter a movie name: ', (response)=> {
        let movieName = response;
       
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
        rl.close();
        omdbRequest(queryUrl);
        });
    }   

    function omdbRequest(url){
        request(url, (error,response,body)=>{
          if(!error && response.statusCode === 200){
          
               // * Title of the movie.
               console.log(JSON.parse(body).Title);
                // * Year the movie came out.
                console.log("Released in: " + JSON.parse(body).Year);
                // * IMDB Rating of the movie.
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                // * Rotten Tomatoes Rating of the movie.
                JSON.parse(body).Ratings.forEach(element => {
                    if(element.Source==='Rotten Tomatoes')
                    console.log("Rotten Tomatoes Rating: " + element.Value);
                });

                // * Country where the movie was produced.
                console.log("Produced in: " + JSON.parse(body).Country);
                // * Language of the movie.
                console.log("Released in: " + JSON.parse(body).Language);
                // * Plot of the movie.
                console.log(JSON.parse(body).Plot);
                // * Actors in the movie.
                console.log("Starring: " + JSON.parse(body).Actors);
            
          }
        });
      }

function processRequest(request, input){
    switch(request){
        case 'my-tweets':
            myTweets();
            break;
        case 'spotify-this-song':
            spotifyThis(input);
            break;
        case 'global-thermalnuclear-war':
            nukes();
            break;
        case 'movie-this' :
            movieThis(input);
            break;
        case 'do-what-it-says':
            doThings()
            break;
            default: 
            welcome();
    }
}