import {React, useState} from 'react';


const Dropdown = props => { 
    const [isOpen, setIsOpen] = useState(true);
    const [value, setValue]= useState("")
    const toggleDropdownProps = {
     className: isOpen ? "value-list open" : setIsOpen(false) &&  "value-list closed"
     }

   const handleSearch = (event) => {
  setValue(event.target.value)
 }

    const results = !value
    ? props.tracks
    : props.tracks.filter(track =>
        track.name.toLowerCase().includes(value.toLowerCase()));


    return ( 
    <div className="dropdown">
        <label className="list-label">Playlist...</label>
        <form>
            <input className="chosen-value" type="text" value={value} placeholder="Search in playlist..."  onChange={handleSearch}/>
            <ul {...toggleDropdownProps}>
               {results && results.map((track, key) => {
                return <li className="item" key={key + 1} value={track.name.value}>{track.name}</li> }
                )} 
            </ul>

        </form>
        </div>

    );
}
export default Dropdown;