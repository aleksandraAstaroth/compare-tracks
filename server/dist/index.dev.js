"use strict";

var express = require("express");

var router = express.Router();
var app = express();

var cors = require("cors");

var bodyParser = require("body-parser");

var path = require('path');

var port = process.env.PORT || 3001;
app.use(express["static"](path.resolve(__dirname, '../client/build')));

var parser = require('xml2json');

var inspect = require('eyes').inspector({
  maxLength: 500
}); //reading file asynchronously


var fs = require('fs');

var tracks = [];
fs.readFile('PlaylistXSPF.xspf', 'utf8', function (err, data) {
  if (err) {
    throw err;
  }

  var jsonToObject = parser.toJson(data, options);
  var trackArray = jsonToObject.playlist.trackList.track;
  console.log(Array.isArray(trackArray));

  for (var i = 0; i < trackArray.length; i++) {
    tracks.push(trackArray[i].title); //'console.log(tracks)
  }
}); //creates javascript object 

var options = {
  object: true
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get('/tracks', function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            res.status(200).json({
              tracks: tracks
            });
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
});
app.use(cors());
app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
app.listen(port, function () {
  console.log("Runnning on " + port);
});
module.exports = app;