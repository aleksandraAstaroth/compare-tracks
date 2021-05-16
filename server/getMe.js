const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node');
const token = "XXXXX";

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

//GET MY PROFILE DATA
 async function getMyData() {
      const me = await spotifyApi.getMe();
       //console.log(me.body);
       return getPlaylistTracks("2XkeiEQvOxJsIXIfCMZspC", "Techno Shite")
    }
 async function getPlaylistTracks(playlistId, playlistName) {

let offset = 0
let limit = 100
let trackArray = [];
let data;

console.log("'" + playlistName + "'" + ' contains these tracks:'); 

 do {
    data = await spotifyApi.getPlaylistTracks(playlistId, {
       offset: offset, 
       limit: limit,
       fields: 'items[0]'
   }).catch(e => {
    console.error(e);
    console.log("promise rejected")
  });
   //tracksInPlaylist = data.body.total

   for (let track_obj of data.body.items) {
    const track = track_obj.track
    trackArray.push({
        id: track.name,
        name: track.name,
        artist: track.artists[0].name
    })
}
    offset += 100
    } while (data.body.next != null && data.body.next != '');

//console.log(typeof(data))
//console.log("---------------+++++++++++++++++++++++++")
//console.log(Array.isArray(trackTitles))
console.log(trackArray)
return trackArray ;
} 

module.exports.getMyData = getMyData 
