import {React, useEffect, useState}  from 'react';
import './App.css';
import Dropdown from './components/Dropdown.js'

function App() {

    const [rekordboxData, setRekordboxData] = useState([]);
    const [spotifyTracks, setSpotifyTracks] = useState([]);
    const [allData, setAllData] = useState([])
    // const [filteredData, setFilteredData] = useState(allData)

    useEffect(() => {
      const fetchRekordboxTracks = async() => {
        const response = await fetch("/tracks")
        const responseData= await response.json()
        setRekordboxData(responseData.map(data => ({
          id: data.id,
          name: data.name.replace(/\(([^\)]+)\)$/, "- $1"),
          artist: data.artist
        }) ))
      };
        fetchRekordboxTracks()

    const fetchSpotifyTracks = async() => {
    const response = await fetch("/apiSpotify")
    const responseData = await response.json()
    setSpotifyTracks(responseData.spotifyData)
  }; fetchSpotifyTracks();
  },[]);

  useEffect(() => {
    if (rekordboxData && spotifyTracks) {
      let filteredArray = rekordboxData.filter(track => !spotifyTracks.map(spotifyTrack => spotifyTrack.name).includes(track.name))
      let filteredArray2 = spotifyTracks.filter(track => !rekordboxData.map(rekordboxTrack => rekordboxTrack.name).includes(track.name))
      let concat =  filteredArray.concat(filteredArray2)
      concat.sort(function(a,b) {
        if(a.name < b.name) { return -1;}
        if(a.name > b.name) { return 1; }
        return 0;
      })
      setAllData(concat)

    }
  }, [rekordboxData, spotifyTracks])

  return (
    <div className="App">
      <Dropdown tracks={rekordboxData} ></Dropdown>
      <Dropdown tracks={spotifyTracks}></Dropdown>
      <Dropdown tracks={allData}></Dropdown>
      {console.log("this is all data ",allData)}
      </div>
  );
}


export default App;
