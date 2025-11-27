import Home from './Components/Home';
import Navbar from './Components/Navbar';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Favorites from './Components/Favorites';
import { useState } from 'react';
import Try from './Try';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#fbbf24',
    },
    background: {
      default: '#020617',
      paper: 'rgba(15, 23, 42, 0.9)',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
});

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: 'radial-gradient(circle at top, rgba(99, 102, 241, 0.35), transparent 45%), linear-gradient(180deg, #020617 0%, #0f172a 60%, #111827 100%)',
        }}
      >
        <HashRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home clearSelectedFavorite={clearSelectedFavorite} favorites={favs} selectedFavoriteCityId={selectedFavoriteCity} updateFavorites={updateFavorites} />} />
            <Route path='/try' element={<Try />} />
            <Route path='/favorites' element={<Favorites deleteFavorite={deleteFavorite} favorite={favs} clickFavoritedCity={clickFavoritedCity} />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
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

