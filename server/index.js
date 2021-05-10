const express = require("express");
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");



const path = require('path');
const port = process.env.PORT || 3001;

app.use(express.static(path.resolve(__dirname, '../client/build')));


const fs = require('fs');
const parser = require('xml2json');

//var inspect = require('eyes').inspector({maxLength: 500})

  let tracks = []
fs.readFile('server/PlaylistXSPF.xspf', 'utf8', (err, data) => {
     if(err) {
      console.log("error")
         throw err; 
     }
    let jsonToObject = parser.toJson(data, options)
    let trackArray = jsonToObject.playlist.trackList.track
     console.log(Array.isArray(trackArray))
     
     for(let i = 0; i < trackArray.length; i++) {
      tracks.push(trackArray[i].title)
     } 
     
 })
 //creates javascript object 
const options = {
    object: true,
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//api send rekordbox tracks to frontend
app.get('/tracks', async (req, res) => {
  try {
    res.status(200).json({
      tracks
      
    })
  } catch (err) {
    res.status(400).json({
      message: "Some error occurred", err
    })
  }
})



// //spotify
const scopes = [
  // 'ugc-image-upload',
  // 'user-read-playback-state',
  // 'user-modify-playback-state',
  // 'user-read-currently-playing',
  // 'streaming',
  // 'app-remote-control',
  // 'user-read-email',
  // 'user-read-private',
  'playlist-read-collaborative'
  // 'playlist-modify-public',
  // 'playlist-read-private',
  // 'playlist-modify-private',
  // 'user-library-modify',
  // 'user-library-read',
  // 'user-top-read',
  // 'user-read-playback-position',
  // 'user-read-recently-played',
  // 'user-follow-read',
  // 'user-follow-modify'
];

// credentials 
const spotifyApi = new SpotifyWebApi({
  clientId: '',
  clientSecret: '',
  redirectUri: ''
});

//endpoints
app.get('/login', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      console.log('access_token:', access_token);
      console.log('refresh_token:', refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      res.send('Success! You can now close the window.');

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];

        console.log('The access token has been refreshed!');
        console.log('access_token:', access_token);
        spotifyApi.setAccessToken(access_token);
      }, expires_in / 2 * 1000);
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
});


const getMe = require('../server/getMe.js')

//api send rekordbox tracks to frontend
app.get('/apiSpotify', async (req, res) => {
  try {
    res.status(200).json({
      spotifyData:  await getMe.getMyData()
    })
  } catch (err) {
    res.status(400).json({
      message: "Some error occurred", err
    })
  }
})

app.use(cors());
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
app.listen(port, function() {
  console.log("Runnning on " + port);
});

module.exports = app;