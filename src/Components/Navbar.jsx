import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={10}
      sx={{
        background: 'rgba(2,6,23,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', maxWidth: '1200px', mx: 'auto', width: '100%' }}>
        <Typography variant="h6" sx={{ cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/') }>
          Weather Studio
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="inherit" onClick={() => navigate('/')}>Home</Button>
          <Button variant="outlined" color="inherit" onClick={() => navigate('/favorites')}>Favorites</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
