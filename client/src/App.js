import {React, useEffect, useState}  from 'react';

import './App.css';
import Dropdown from './components/Dropdown.js'

function App() {

    const [rekordboxData, setRekordboxData] = useState([]);
    const [spotifyTracks, setSpotifyTracks] = useState([]);


    useEffect(() => {
      const fetchRekordboxTracks = async() => {
        const response = await fetch("/tracks")
        const responseData= await response.json()
        setRekordboxData(responseData)
      };
        fetchRekordboxTracks()
  }, []);

    useEffect(() => {
    const fetchSpotifyTracks = async() => {
    const response = await fetch("/apiSpotify")
    const responseData = await response.json()
    setSpotifyTracks(responseData.spotifyData)
  }; fetchSpotifyTracks();
  },[]);

console.log(rekordboxData)
console.log(spotifyTracks)



  return (
    <div className="App">
      <Dropdown tracks={rekordboxData} ></Dropdown>
      <Dropdown tracks={spotifyTracks}></Dropdown>
     {/* <p>{!rekordboxData ? "Loading..." : rekordboxData}</p> */}
 
      </div>
  );
}


export default App;
