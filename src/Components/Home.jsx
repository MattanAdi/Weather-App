import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import './home.css'

const getDays = async (id, key) => {
    const base = 'https://dataservice.accuweather.com/forecasts/v1/daily/5day/';
    const query = `${id}?apikey=${key}`;

    const response = await fetch(base + query);
    const data = await response.json();

    return data;
};

const getWeather = async (id, key) => {
    const base = 'https://dataservice.accuweather.com/currentconditions/v1/';
    const query = `${id}?apikey=${key}`;

    const response = await fetch(base + query);
    const data = await response.json();

    return data[0];
};

const getCity = async (city, key) => {
    const baseurl = 'https://dataservice.accuweather.com/locations/v1/cities/autocomplete';
    const query = `?apikey=${key}&q=${city}`;

    const response = await fetch(baseurl + query);
    const data = await response.json();

    return data[0];
};

const updateCity = async (city, key) => {
    const cityDets = await getCity(city, key);
    const weather = await getWeather(cityDets.Key, key);
    const day5 = await getDays(cityDets.Key, key);

    return {
        cityDets,
        weather,
        day5,
    };
};

const readStoredKey = () => {
    if (typeof window !== 'undefined') {
        return window.localStorage.getItem('weather_api_key') ?? '';
    }
    return '';
};

const Home = (props) => {
    const favCityId = props.selectedFavoriteCityId  // 
    const favCity = props.favorites.find((val) => { return val.id === favCityId }) //find val of favorites and check if val.id === favCityId
    const hasSelectedFavorite = Boolean(favCity);

    const [city, addCity] = useState('') // this represents the user input when retrieving API

    const [cityname, setcityname] = useState(hasSelectedFavorite ? favCity.cityname : '')//Main Weather/City Info - middle block
    const [currentweather, setcurrentweather] = useState(hasSelectedFavorite ? favCity.currentweather : '')//Main Weather/City Info - middle block
    const [temperature, settemp] = useState(hasSelectedFavorite ? favCity.temperature : '')//Main Weather/City Info - middle block
    const [id, setid] = useState(hasSelectedFavorite ? favCityId : '')//Main Weather/City Info - middle block

    const [apiKey, setApiKey] = useState(() => readStoredKey());
    const [draftKey, setDraftKey] = useState(apiKey);
    const [fiveday, indays] = useState() // For the fiveday forcest on bottom
    const [isLoading, setIsLoading] = useState(false);
    const [justUpdated, setJustUpdated] = useState(false);
    const highlightTimeout = useRef(null);
    const isFavorite = Boolean(props.favorites.find((val) => val.id === id));
    const keyForFetch = apiKey.trim();
    const missingKey = !keyForFetch;

    useEffect(() => {
        setDraftKey(apiKey);
    }, [apiKey]);

    props.clearSelectedFavorite();

    const updateApp = useCallback((data) => {
        const cityDets = data.cityDets
        const weather = data.weather
        const day5 = data.day5

        console.log('weather: ', weather.WeatherText, 'citydetails: ', cityDets.LocalizedName, 'five day', day5.DailyForecasts)

        setcityname(data.cityDets.LocalizedName)
        setcurrentweather(data.weather.WeatherText)
        settemp(data.weather.Temperature.Metric.Value)
        setid(data.cityDets.Key)
        indays(day5.DailyForecasts)

        setJustUpdated(true);
        if (highlightTimeout.current) {
            clearTimeout(highlightTimeout.current);
        }
        highlightTimeout.current = setTimeout(() => setJustUpdated(false), 1200);

    }, []);

    useEffect(() => {
        if (hasSelectedFavorite || missingKey) return;

        let cancelled = false;

        const fetchDefaultCity = async () => {
            setIsLoading(true);
            try {
                const data = await updateCity('tel', keyForFetch);
                if (!cancelled) {
                    updateApp(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchDefaultCity();

        return () => {
            cancelled = true;
        };
    }, [hasSelectedFavorite, missingKey, updateApp, keyForFetch]);

    useEffect(() => {
        return () => {
            if (highlightTimeout.current) {
                clearTimeout(highlightTimeout.current);
            }
        };
    }, []);

    const persistKey = (nextKey) => {
        if (typeof window !== 'undefined') {
            if (nextKey) {
                window.localStorage.setItem('weather_api_key', nextKey);
            } else {
                window.localStorage.removeItem('weather_api_key');
            }
        }
    };

    function sendFavs() {
        const hasDuplicate = Boolean(props.favorites.find((val) => val.id === id))
        if (!hasDuplicate) {
            props.updateFavorites(cityname, currentweather, temperature, id)
        }

        else {
            window.alert('error: cannot save duplicates')
        }
    }

    const saveApiKey = () => {
        const trimmed = draftKey.trim();
        setApiKey(trimmed);
        persistKey(trimmed);
    };

    async function sendit() {
        const query = city.trim()
        if (!query) return
        if (missingKey) {
            window.alert('Enter your AccuWeather API key to search.');
            return
        }

        setIsLoading(true);
        try {
            const data = await updateCity(query, keyForFetch);
            updateApp(data)
        } catch (error) {
            console.error(error);
            window.alert('Unable to retrieve that city right now.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div id='Bigone' className='home-root'>
            <section className='glass-card search-card'>
                <div className='search-heading'>
                    <p className='eyebrow'>Weather Explorer</p>
                    <h1>Search any city</h1>
                    <p className='search-description'>Type a location, then hit Search or press Enter to see it on the map.</p>
                </div>
                <div className='key-row'>
                    <input
                        className='key-input'
                        value={draftKey}
                        onChange={(e) => setDraftKey(e.target.value)}
                        type='text'
                        placeholder='Paste your AccuWeather API key'
                    />
                    <button type='button' className='primary-button key-save' onClick={saveApiKey}>
                        Save key
                    </button>
                </div>
                <div className='key-status'>
                    {missingKey ? 'API key required for weather data. Save it above to enable searches.' : 'API key saved locally; searches ready.'}
                </div>
                <div className='search-row'>
                    <input
                        className='search-input'
                        value={city}
                        onChange={(e) => {
                            let temp = e.target.value
                            addCity(temp)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                sendit();
                            }
                        }}
                        type="text"
                        placeholder='Search for city here'
                    />
                    <button type='button' className='primary-button' onClick={sendit} disabled={isLoading || missingKey}>
                        {isLoading ? 'Searching…' : 'Search'}
                    </button>
                </div>
                <div className='search-feedback'>
                    {isLoading ? (
                        <div className='loading-indicator' role='status' aria-live='polite'>
                            <span className='spinner' aria-hidden='true'></span>
                            Receiving the latest weather…
                        </div>
                    ) : (
                        <span className='hint-text'>{missingKey ? 'Save your key to preview live weather.' : 'Press Enter or Search to refresh the forecast.'}</span>
                    )}
                </div>
                <button type='button' className='secondary-button' onClick={sendFavs}>Add to Favorites</button>
            </section>

            <section className={`glass-card weather-card ${justUpdated ? 'fresh' : ''}`}>
                <p className='weather-label'>Now in</p>
                <p className='weather-city'>{cityname || 'Tel Aviv'}</p>
                <p className='weather-text'>{currentweather || 'Fetching weather...'}</p>
                <p className='weather-temp'>{temperature ? `${temperature}°C` : '---'}</p>
                {isFavorite && <span className='saved-indicator'>⭐ Saved in Favorites</span>}
                <div className={`result-flash ${justUpdated ? 'active' : ''}`} aria-hidden='true' />
            </section>

            <section className='glass-card forecast-card'>
                <div className='forecast-header'>
                    <h2>5-Day Forecast</h2>
                    <p className='forecast-description'>{cityname ? `Daily highs for ${cityname}` : 'Waiting for your next search'}</p>
                </div>
                {fiveday ? (
                    <div className='forecast-grid'>
                        {fiveday.map((val) => (
                            <article key={val.Date} className='forecast-day'>
                                <p className='day-label'>{new Date(val.Date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                <p className='day-temp'>{val.Temperature.Maximum.Value}°F</p>
                                <p className='day-summary'>{val.Day.IconPhrase}</p>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className='empty-state'>Pulling in the five-day forecast…</p>
                )}
            </section>
        </div>
    );
}

export default Home;
