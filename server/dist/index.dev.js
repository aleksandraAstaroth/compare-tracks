"use strict";

var express = require("express");

var router = express.Router();

var SpotifyWebApi = require('spotify-web-api-node');

var app = express();

var cors = require("cors");

var bodyParser = require("body-parser");

var path = require('path');

var port = process.env.PORT || 3001;
app.use(express["static"](path.resolve(__dirname, '../client/build')));

var fs = require('fs');

var parser = require('xml2json');

var inspect = require('eyes').inspector({
  maxLength: 1000
});

var rekordboxTrackData = [];
fs.readFile('server/PlaylistXSPF.xspf', 'utf8', function (err, data) {
  if (err) {
    console.log("error");
    throw err;
  }

  var jsonToObject = parser.toJson(data, options);
  var trackArray = jsonToObject.playlist.trackList.track;
  console.log(Array.isArray(trackArray));

  for (var i = 0; i < trackArray.length; i++) {
    rekordboxTrackData.push({
      id: trackArray[i].title,
      name: trackArray[i].title,
      artist: trackArray[i].creator
    });
  } //console.log(rekordboxTrackData[0])

}); //creates javascript object 

var options = {
  object: true
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); //api send rekordbox tracks to frontend

app.get('/tracks', function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            res.status(200).json(rekordboxTrackData);
          } catch (err) {
            res.status(400).json({
              message: "Some error occurred",
              err: err
            });
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}); // //spotify

var scopes = [// 'ugc-image-upload',
// 'user-read-playback-state',
// 'user-modify-playback-state',
// 'user-read-currently-playing',
// 'streaming',
// 'app-remote-control',
// 'user-read-email',
// 'user-read-private',
'playlist-read-collaborative' // 'playlist-modify-public',
// 'playlist-read-private',
// 'playlist-modify-private',
// 'user-library-modify',
// 'user-library-read',
// 'user-top-read',
// 'user-read-playback-position',
// 'user-read-recently-played',
// 'user-follow-read',
// 'user-follow-modify'
]; // credentials 

var spotifyApi = new SpotifyWebApi({
  clientId: '',
  clientSecret: '',
  redirectUri: ''
}); //endpoints

app.get('/login', function (req, res) {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});
app.get('/callback', function (req, res) {
  var error = req.query.error;
  var code = req.query.code;
  var state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send("Callback Error: ".concat(error));
    return;
  }

  spotifyApi.authorizationCodeGrant(code).then(function (data) {
    var access_token = data.body['access_token'];
    var refresh_token = data.body['refresh_token'];
    var expires_in = data.body['expires_in'];
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    console.log('access_token:', access_token);
    console.log('refresh_token:', refresh_token);
    console.log("Sucessfully retreived access token. Expires in ".concat(expires_in, " s."));
    res.send('Success! You can now close the window.');
    setInterval(function _callee2() {
      var data, access_token;
      return regeneratorRuntime.async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(spotifyApi.refreshAccessToken());

            case 2:
              data = _context2.sent;
              access_token = data.body['access_token'];
              console.log('The access token has been refreshed!');
              console.log('access_token:', access_token);
              spotifyApi.setAccessToken(access_token);

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      });
    }, expires_in / 2 * 1000);
  })["catch"](function (error) {
    console.error('Error getting Tokens:', error);
    res.send("Error getting Tokens: ".concat(error));
  });
});

var getMe = require('../server/getMe.js'); //api send rekordbox tracks to frontend


app.get('/apiSpotify', function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.t0 = res.status(200);
          _context3.next = 4;
          return regeneratorRuntime.awrap(getMe.getMyData());

        case 4:
          _context3.t1 = _context3.sent;
          _context3.t2 = {
            spotifyData: _context3.t1
          };

          _context3.t0.json.call(_context3.t0, _context3.t2);

          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t3 = _context3["catch"](0);
          res.status(400).json({
            message: "Some error occurred",
            err: _context3.t3
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
app.use(cors());
app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
app.listen(port, function () {
  console.log("Runnning on " + port);
});
module.exports = app;