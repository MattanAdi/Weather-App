import Home from './Components/Home';
import Navbar from './Components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Favorites from './Components/Favorites';
import './App.css';
import { useState } from 'react';

function App() {

  const key = '6b7MnAVRBQylZyNnnJkqeFQ9ehBu5Tzm'
  const [citynew, cityinp] = useState()

  function receiveCity(city) {

    cityinp(city)



  }


  //get weather information

  const getWeather = async (id) => {

    const base = 'http://dataservice.accuweather.com/currentconditions/v1/'
    const query = `${id}?apikey=${key}`



    const response = await fetch(base + query)
    const data = await response.json()

    console.log(data)

  }

  //get city information
  const getCity = async (city) => {

    const baseurl = 'http://dataservice.accuweather.com/locations/v1/cities/autocomplete'
    const query = `?apikey=${key}&q=${city} `

    const response = await fetch(baseurl + query);

    const data = await response.json()
    return data[0]
  }
  getCity(citynew)
    .then(data => {
      return getWeather(data.Key)
    }).then(data => {
      console.log(data)
    })
    .catch(err => console.log(err))

  // getWeather("329260")





  return (
    <div className="App">

      <BrowserRouter>
        <Navbar />
        <h1>City Search</h1>

        <Routes>
          <Route path='/' element={<Home sendCity={(city) => { receiveCity(city) }} />} />
          <Route path='/favorites' element={<Favorites />} />
        </Routes>

      </BrowserRouter>

    </div>
  );
}

export default App;
