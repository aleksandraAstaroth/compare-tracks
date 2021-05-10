import {React, useEffect, useState}  from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

    const [data, setData] = useState(null);
    const [dataApi, setDataApi] = useState(null);

    useEffect(() => {
      fetch("/tracks")
      .then((response) => response.json())
      .then((data) => setData(data.tracks)).catch(err => {
        console.log(err);
      });

      fetch("/apiSpotify")
      .then((responseSpotify) => responseSpotify.json())
      .then((dataApi) => setDataApi(dataApi.spotifyData)).catch(err => {
        console.log(err);
        console.log(dataApi)
      });

    }, []);


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
        <p>{!dataApi ? "Loading..." : dataApi}</p>
        
      
      </header>
    </div>
  );
}

export default App;
