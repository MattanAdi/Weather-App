import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

const Favorites = (props) => {
  const navigate = useNavigate();

  function clickFavorite(id) {
    props.clickFavoritedCity(id);
    navigate('/');
  }

  function deleteFavorite(event, id) {
    event.stopPropagation();
    props.deleteFavorite(id);
  }

  const hasFavorites = Boolean(props.favorite.length);

  return (
    <Box minHeight="100vh" sx={{ background: 'linear-gradient(180deg, #020617, #0f172a)' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" fontWeight={700} color="white">
              Favorites
            </Typography>
            <Typography color="text.secondary">Tap a card to load it back into the explorer.</Typography>
          </Box>

          {hasFavorites ? (
            <Grid container spacing={3}>
              {props.favorite.map((val) => (
                <Grid item xs={12} sm={6} md={4} key={val.id}>
                  <Card
                    onClick={() => clickFavorite(val.id)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 3,
                      background: 'rgba(15,23,42,0.85)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 20px 45px rgba(15,23,42,0.5)',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                      },
                    }}
                  >
                    <CardContent>
                      <div>
                        <Typography variant="caption" color="text.secondary">
                          City
                        </Typography>
                        <Typography variant="h6" color="white">
                          {val.cityname}
                        </Typography>
                      </div>
                      <Box mt={2}>
                        <Typography variant="caption" color="text.secondary">
                          Weather
                        </Typography>
                        <Typography variant="body1" color="white">
                          {val.currentweather}
                        </Typography>
                      </Box>
                      <Box mt={2}>
                        <Typography variant="caption" color="text.secondary">
                          Temp
                        </Typography>
                        <Typography variant="body1" color="white">
                          {val.temperature}°C
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={(event) => deleteFavorite(event, val.id)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary">Save a city from the home view to revisit it later.</Typography>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default Favorites;
