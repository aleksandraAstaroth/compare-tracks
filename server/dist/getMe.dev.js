"use strict";

var fs = require('fs');

var SpotifyWebApi = require('spotify-web-api-node');

var token = "";
var spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token); //GET MY PROFILE DATA

function getMyData() {
  var me;
  return regeneratorRuntime.async(function getMyData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(spotifyApi.getMe());

        case 2:
          me = _context.sent;
          return _context.abrupt("return", getPlaylistTracks("2XkeiEQvOxJsIXIfCMZspC", "Techno Shite"));

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}

function getPlaylistTracks(playlistId, playlistName) {
  var offset, limit, trackArray, data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, track_obj, track;

  return regeneratorRuntime.async(function getPlaylistTracks$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          offset = 0;
          limit = 100;
          trackArray = [];
          console.log("'" + playlistName + "'" + ' contains these tracks:');

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(spotifyApi.getPlaylistTracks(playlistId, {
            offset: offset,
            limit: limit,
            fields: 'items[0]'
          })["catch"](function (e) {
            console.error(e);
            console.log("promise rejected");
          }));

        case 6:
          data = _context2.sent;
          //tracksInPlaylist = data.body.total
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 10;

          for (_iterator = data.body.items[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            track_obj = _step.value;
            track = track_obj.track;
            trackArray.push({
              id: track.name,
              name: track.name,
              artist: track.artists[0].name
            });
          }

          _context2.next = 18;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](10);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 18:
          _context2.prev = 18;
          _context2.prev = 19;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 21:
          _context2.prev = 21;

          if (!_didIteratorError) {
            _context2.next = 24;
            break;
          }

          throw _iteratorError;

        case 24:
          return _context2.finish(21);

        case 25:
          return _context2.finish(18);

        case 26:
          offset += 100;

        case 27:
          if (data.body.next != null && data.body.next != '') {
            _context2.next = 4;
            break;
          }

        case 28:
          //console.log(typeof(data))
          //console.log("---------------+++++++++++++++++++++++++")
          //console.log(Array.isArray(trackTitles))
          console.log(trackArray);
          return _context2.abrupt("return", trackArray);

        case 30:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[10, 14, 18, 26], [19,, 21, 25]]);
}

module.exports.getMyData = getMyData;