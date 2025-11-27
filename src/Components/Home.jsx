import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';

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
        <div className="mx-auto max-w-5xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-900/40 backdrop-blur-xl transition-all duration-300">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.4rem] text-slate-400">Weather Explorer</p>
                    <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Search any city</h1>
                    <p className="text-sm text-slate-300">Type a location, then hit Search or press Enter to refresh the forecast.</p>
                </div>

                <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
                    <input
                        className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                        value={draftKey}
                        onChange={(e) => setDraftKey(e.target.value)}
                        type='text'
                        placeholder='Paste your AccuWeather API key'
                    />
                    <button
                        type='button'
                        onClick={saveApiKey}
                        className="rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:translate-y-0.5 hover:shadow-cyan-500/50"
                    >
                        Save key
                    </button>
                </div>
                <p className="mt-2 text-xs text-slate-300">{missingKey ? 'Save your API key above to unlock live weather data.' : 'Key saved locally so the explorer can refresh automatically.'}</p>

                <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
                    <input
                        className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
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
                    <button
                        type='button'
                        className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/30 transition disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={sendit}
                        disabled={isLoading || missingKey}
                    >
                        {isLoading ? 'Searching…' : 'Search'}
                    </button>
                </div>

                <div className="mt-4">
                    {isLoading ? (
                        <div className="flex items-center gap-3 text-sm text-slate-200">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-yellow-400"></span>
                            Receiving the latest weather…
                        </div>
                    ) : (
                        <span className="text-sm text-slate-400">{missingKey ? 'Save a key to start searching, then press Search or Enter.' : 'Search whenever you want to fetch fresh data.'}</span>
                    )}
                </div>

                <button
                    type='button'
                    className="mt-4 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                    onClick={sendFavs}
                >
                    Add to Favorites
                </button>
            </section>

            <section className={`rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-900/50 transition ${justUpdated ? 'ring-2 ring-yellow-400/60 shadow-[0_0_40px_rgba(245,158,11,0.45)]' : ''}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.4rem] text-slate-400">Now in</p>
                <p className="mt-1 text-3xl font-semibold text-white">{cityname || 'Tel Aviv'}</p>
                <p className="text-sm text-cyan-300">{currentweather || 'Fetching weather...'}</p>
                <p className="mt-3 text-4xl font-bold text-white">{temperature ? `${temperature}°C` : '---'}</p>
                {isFavorite && <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-semibold text-amber-200">⭐ Saved in Favorites</span>}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-900/40">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="text-2xl font-semibold text-white">5-Day Forecast</h2>
                    <p className="text-sm text-slate-400">{cityname ? `Daily highs for ${cityname}` : 'Waiting for your next search'}</p>
                </div>
                {fiveday ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {fiveday.map((val) => (
                            <article key={val.Date} className="rounded-2xl border border-white/5 bg-white/5 p-4 text-center shadow-inner shadow-slate-900/20">
                                <p className="text-xs text-slate-400">{new Date(val.Date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                <p className="mt-2 text-xl font-semibold text-white">{val.Temperature.Maximum.Value}°F</p>
                                <p className="text-xs uppercase tracking-[0.2rem] text-slate-400">{val.Day.IconPhrase}</p>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-slate-400">Pulling in the five-day forecast…</p>
                )}
            </section>
        </div>
    );
}

export default Home;
