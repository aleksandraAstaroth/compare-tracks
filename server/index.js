const express = require("express");
const router = express.Router();
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');
const port = process.env.PORT || 3001;
app.use(express.static(path.resolve(__dirname, '../client/build')));

const parser = require('xml2json');
var inspect = require('eyes').inspector({maxLength: 500})

//reading file asynchronously
  const fs = require('fs')
  let tracks = []
fs.readFile('PlaylistXSPF.xspf', 'utf8', (err, data) => {
     if(err) {
         throw err;
     }
    let jsonToObject = parser.toJson(data, options)
    let trackArray = jsonToObject.playlist.trackList.track
    console.log(Array.isArray(trackArray))
     
     for(let i = 0; i < trackArray.length; i++) {
      tracks.push(trackArray[i].title)
      //'console.log(tracks)
     } 
 })
 //creates javascript object 
const options = {
    object: true,
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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



app.use(cors());
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
app.listen(port, function() {
  console.log("Runnning on " + port);
});
module.exports = app;