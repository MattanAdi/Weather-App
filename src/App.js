import Home from './Components/Home';
import Navbar from './Components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Favorites from './Components/Favorites';
import './App.css';
import { useState } from 'react';
import Try from './Try';

function App() {

  const [favs, setfavs] = useState([])
  const [selectedFavoriteCity, setSelectedFavoriteCityId] = useState(undefined)

  function updateFavorites(cityname, currentweather, temperature, id) {
    let temp = new Favorite(cityname, currentweather, temperature, id)

    setfavs([...favs, temp])
    console.log(favs)
  }

  function clickFavoritedCity(id) {
    setSelectedFavoriteCityId(id) // will be sent to Home from App(previously Favorite)via props with the ID value
  }

  function clearSelectedFavorite() {
    setSelectedFavoriteCityId(undefined);
  }

  function deleteFavorite(id) {
    const updatedFavorites = favs.filter((item) => item.id !== id) // filter says to return everything that doesnt have id of what we clicked
    setfavs(updatedFavorites) // updates new favorites list
  }

  return (
    <div id="App" >

      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home clearSelectedFavorite={clearSelectedFavorite} favorites={favs} selectedFavoriteCityId={selectedFavoriteCity} updateFavorites={updateFavorites} />} />
          <Route path='/try' element={<Try />} />
          <Route path='/favorites' element={<Favorites deleteFavorite={deleteFavorite} favorite={favs} clickFavoritedCity={clickFavoritedCity} />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;


class Favorite {
  cityname = '';
  currentweather = '';
  temperature = '';
  id = ''

  constructor(cityname, currentweather, temperature, id) {

    this.cityname = cityname;
    this.currentweather = currentweather;
    this.temperature = temperature
    this.id = id

  }
}

