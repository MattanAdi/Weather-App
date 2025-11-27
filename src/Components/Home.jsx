import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Fade,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Chip,
} from '@mui/material';

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
  const favCityId = props.selectedFavoriteCityId;
  const favCity = props.favorites.find((val) => val.id === favCityId);
  const hasSelectedFavorite = Boolean(favCity);

  const [city, addCity] = useState('');

  const [cityname, setcityname] = useState(hasSelectedFavorite ? favCity.cityname : '');
  const [currentweather, setcurrentweather] = useState(hasSelectedFavorite ? favCity.currentweather : '');
  const [temperature, settemp] = useState(hasSelectedFavorite ? favCity.temperature : '');
  const [id, setid] = useState(hasSelectedFavorite ? favCityId : '');

  const [apiKey, setApiKey] = useState(() => readStoredKey());
  const [draftKey, setDraftKey] = useState(apiKey);
  const [fiveday, indays] = useState();
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
    const cityDets = data.cityDets;
    const weather = data.weather;
    const day5 = data.day5;

    setcityname(cityDets.LocalizedName);
    setcurrentweather(weather.WeatherText);
    settemp(weather.Temperature.Metric.Value);
    setid(cityDets.Key);
    indays(day5.DailyForecasts);

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
    const hasDuplicate = Boolean(props.favorites.find((val) => val.id === id));
    if (!hasDuplicate) {
      props.updateFavorites(cityname, currentweather, temperature, id);
    } else {
      window.alert('error: cannot save duplicates');
    }
  }

  const saveApiKey = () => {
    const trimmed = draftKey.trim();
    setApiKey(trimmed);
    persistKey(trimmed);
  };

  async function sendit() {
    const query = city.trim();
    if (!query) return;
    if (missingKey) {
      window.alert('Enter your AccuWeather API key to search.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await updateCity(query, keyForFetch);
      updateApp(data);
    } catch (error) {
      console.error(error);
      window.alert('Unable to retrieve that city right now.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Container maxWidth="lg">
      <Stack spacing={4} mt={4} mb={10}>
        <Paper
          elevation={8}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(2,6,23,0.85))',
            p: { xs: 4, md: 6 },
          }}
        >
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="overline" letterSpacing={3} color="text.secondary">
                Weather Explorer
              </Typography>
              <Typography variant="h3" fontWeight={600}>
                Search any city
              </Typography>
              <Typography color="text.secondary">Type a location, then hit Search or press Enter to refresh the forecast.</Typography>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <TextField
                fullWidth
                label="AccuWeather API key"
                variant="filled"
                value={draftKey}
                onChange={(e) => setDraftKey(e.target.value)}
                InputProps={{
                  sx: { borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.06)' },
                }}
                placeholder="Paste your AccuWeather API key"
              />
              <Button variant="contained" color="secondary" size="large" sx={{ borderRadius: '999px' }} onClick={saveApiKey}>
                Save key
              </Button>
            </Stack>

            <Alert
              severity={missingKey ? 'warning' : 'success'}
              variant="outlined"
              icon={false}
              sx={{ borderRadius: '999px', py: 1.5, px: 3 }}
            >
              {missingKey
                ? 'API key required for weather data. Save it above to enable searches.'
                : 'API key saved locally; searches ready.'}
            </Alert>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <TextField
                fullWidth
                label="Search city"
                variant="filled"
                value={city}
                onChange={(e) => addCity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendit();
                  }
                }}
                InputProps={{
                  sx: { borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.06)' },
                }}
                placeholder="Search for city here"
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ borderRadius: '999px' }}
                onClick={sendit}
                disabled={isLoading || missingKey}
              >
                {isLoading ? 'Searching…' : 'Search'}
              </Button>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              {isLoading ? (
                <>
                  <CircularProgress size={18} />
                  <Typography variant="body2" color="text.secondary">
                    Receiving the latest weather…
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {missingKey ? 'Save your key to preview live weather.' : 'Press Enter or Search to refresh the forecast.'}
                </Typography>
              )}
            </Stack>

            <Button variant="text" color="inherit" sx={{ alignSelf: 'flex-start' }} onClick={sendFavs}>
              Add to Favorites
            </Button>
          </Stack>
        </Paper>

        <Paper
          elevation={8}
          sx={{
            position: 'relative',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'linear-gradient(180deg, rgba(15,23,42,0.95), rgba(2,6,23,0.95))',
            p: { xs: 4, md: 5 },
          }}
        >
          <Fade in={justUpdated} timeout={800}>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle, rgba(245,158,11,0.45), transparent 60%)',
                opacity: justUpdated ? 0.9 : 0,
                transition: 'opacity 0.8s ease',
              }}
            />
          </Fade>
          <Stack spacing={1} position="relative">
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 4 }}>
              Now in
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {cityname || 'Tel Aviv'}
            </Typography>
            <Typography variant="subtitle1" color="secondary">
              {currentweather || 'Fetching weather...'}
            </Typography>
            <Typography variant="h2" fontWeight={700}>
              {temperature ? `${temperature}°C` : '---'}
            </Typography>
            {isFavorite && <Chip label="⭐ Saved in Favorites" color="warning" variant="filled" />}
          </Stack>
        </Paper>

        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'linear-gradient(180deg, rgba(15,23,42,0.95), rgba(2,6,23,0.95))',
            p: { xs: 4, md: 5 },
          }}
        >
          <Box display="flex" alignItems="baseline" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Typography variant="h4" fontWeight={600}>
              5-Day Forecast
            </Typography>
            <Typography color="text.secondary">
              {cityname ? `Daily highs for ${cityname}` : 'Waiting for your next search'}
            </Typography>
          </Box>

          {fiveday ? (
            <Grid container spacing={3} mt={2}>
              {fiveday.map((val) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={val.Date}>
                  <Paper
                    sx={{
                      borderRadius: 3,
                      p: 3,
                      background: 'rgba(15,23,42,0.8)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {new Date(val.Date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </Typography>
                    <Typography variant="h5" fontWeight={600}>
                      {val.Temperature.Maximum.Value}°F
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textTransform="uppercase" letterSpacing={1}>
                      {val.Day.IconPhrase}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography mt={2} color="text.secondary">
              Pulling in the five-day forecast…
            </Typography>
          )}
        </Paper>
      </Stack>
    </Container>
  );
};

export default Home;
