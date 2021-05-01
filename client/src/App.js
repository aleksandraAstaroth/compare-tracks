import {React, useEffect, useState}  from 'react';
import logo from './logo.svg';
import './App.css';


function App() {

    const [data, setData] = useState(null);
  
    useEffect(() => {
      fetch("/tracks")
      .then((response) => response.json())
      .then((data) => setData(data.tracks));
    }, []);


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
        
      
      </header>
    </div>
  );
}

export default App;
