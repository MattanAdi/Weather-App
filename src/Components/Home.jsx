import React from 'react';
import { useState, useEffect } from 'react';
import './home.css'

const Home = (props) => {
    const key = 'ehuEwGfdtQwJ4ZYlChbVOgD748FqAA1t' //key

    const favCityId = props.selectedFavoriteCityId  // 
    const favCity = props.favorites.find((val) => { return val.id === favCityId }) //find val of favorites and check if val.id === favCityId
    const hasSelectedFavorite = Boolean(favCity);

    console.log("FAV CITY ", hasSelectedFavorite, props.favorites, favCity)


    // Relavant UseStates *** 
    const [city, addCity] = useState('') // this represents the user input when retrieving API


    const [cityname, setcityname] = useState(hasSelectedFavorite ? favCity.cityname : '')//Main Weather/City Info - middle block
    const [currentweather, setcurrentweather] = useState(hasSelectedFavorite ? favCity.currentweather : '')//Main Weather/City Info - middle block
    const [temperature, settemp] = useState(hasSelectedFavorite ? favCity.temperature : '')//Main Weather/City Info - middle block
    const [id, setid] = useState(hasSelectedFavorite ? favCityId : '')//Main Weather/City Info - middle block



    const [fiveday, indays] = useState() // For the fiveday forcest on bottom
    console.log('FIVEDAY', fiveday)
    // Relavant UseStates ***  

    props.clearSelectedFavorite();

    async function loadDefaultCity() {

        const data = await updateCity('tel');

        console.log('USE EFFECT', data.cityDets.LocalizedName)

        updateApp(data)

        // setcityname(data.cityDets.LocalizedName)

    }

    useEffect(() => {
        if (!hasSelectedFavorite) {
            loadDefaultCity()
        }


        // Run default API request (Tel Aviv)
    }, [])


    function sendFavs() {
        const hasDuplicate = Boolean(props.favorites.find((val) => val.id === id))
        if (!hasDuplicate) {
            props.updateFavorites(cityname, currentweather, temperature, id)
        }

        else {
            window.alert('error: cannot save duplicates')
        }
    }


    async function sendit() {
        const data = await updateCity(city);
        updateApp(data)
    }

    const updateApp = (data) => {
        const cityDets = data.cityDets
        const weather = data.weather
        const day5 = data.day5

        console.log('weather: ', weather.WeatherText, 'citydetails: ', cityDets.LocalizedName, 'five day', day5.DailyForecasts)



        setcityname(data.cityDets.LocalizedName)
        setcurrentweather(data.weather.WeatherText)
        settemp(data.weather.Temperature.Metric.Value)
        setid(data.cityDets.Key)
        indays(day5.DailyForecasts)

    }

    //Retreive 5 day forecast data from API
    const getDays = async (id) => {
        const base = 'https://dataservice.accuweather.com/forecasts/v1/daily/5day/'
        const query = `${id}?apikey=${key}`;

        const response = await fetch(base + query);
        const data = await response.json();

        return data
    }

    //retreive weather data from API
    const getWeather = async (id) => {
        const base = 'https://dataservice.accuweather.com/currentconditions/v1/'
        const query = `${id}?apikey=${key}`

        const response = await fetch(base + query)
        const data = await response.json()

        return data[0];
    }

    //retreive city data from API 
    const getCity = async (city) => {
        const baseurl = 'https://dataservice.accuweather.com/locations/v1/cities/autocomplete'
        const query = `?apikey=${key}&q=${city}`

        const response = await fetch(baseurl + query);
        const data = await response.json()

        return data[0]
    }

    const updateCity = async (city) => { // retreive relevant selected data and create workable object to be used in JSX, Data input ,etc.

        const cityDets = await getCity(city)
        const weather = await getWeather(cityDets.Key)
        const day5 = await getDays(cityDets.Key)

        return {
            cityDets: cityDets,
            weather: weather,
            day5: day5
        }
    }

    const updateInfo = async (city) => {

        const cityDets = await getCity(city)
        const weather = await getWeather(cityDets.Key)
        const day5 = await getDays(cityDets.Key)
        const result = {
            cityDets: cityDets,
            weather: weather,
            day5: day5
        }


        return {
            cityDets: cityDets,
            weather: weather,
            day5: day5
        }
    }



    return (
        <div style={{ textAlign: 'center' }} id='Bigone'   >

            <h1>Home</h1>

            <br /><br /> <br />

            <div id="userinterface">

                <input id='Search' onChange={(e) => {
                    let temp = e.target.value
                    addCity(temp)
                }} type="text" placeholder='Search for city here' />

                <br />

                <div id="buttoncontainer">
                    <button id='searchbutton' onClick={sendit} >Search </button>
                    <button id='favbutton' onClick={() => { sendFavs() }} >Add Favorites</button>
                </div>

            </div>

            <br />

            <div className='anscontainer' >
                {currentweather.length ? (  // removes the unwanted text until first render with data is loaded 
                    <div id='weathercont'>
                        <p className='change' >{currentweather}</p>
                        <p className='change' >{cityname}</p>
                        <p className='change' >{temperature + '°C'}</p>

                        {(Boolean(props.favorites.find((val) => val.id === id))) ? (
                            <p>⭐</p>
                        ) : null}
                    </div>
                ) : null}
            </div>

            <div className='anscontainer2' >
                {fiveday ? ( // if fiveday is undefined , return my data as null (as apposed to undefined im assuming) which stops the screen from crashing

                    fiveday.map((val) => {

                        return <div key={val.Date} className='blocks'>

                            <p  >{val.Date.substring(5, 10)}</p>
                            <p>{val.Temperature.Maximum.Value + '°F'}</p>
                        </div>
                    })

                ) : null}


            </div>


        </div>

    );
}

export default Home;
