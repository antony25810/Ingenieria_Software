import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import BuildIcon from '@mui/icons-material/Build';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const drawerWidth = 240;

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  
  // Menú de navegación
  const menuItems = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/' },
    { text: 'Comparar', icon: <CompareArrowsIcon />, path: '/compare' },
    { text: 'Administración', icon: <BuildIcon />, path: '/admin/scraping' }
  ];
  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Barra superior */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="abrir menú"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <DirectionsCarIcon sx={{ mr: 1 }} />
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {process.env.REACT_APP_APP_NAME || 'Comparador de Camionetas'}
          </Typography>
          
          {/* Enlaces de navegación en desktop */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                component={Link}
                to={item.path}
                color="inherit"
                sx={{ 
                  ml: 1,
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  textDecoration: location.pathname === item.path ? 'underline' : 'none'
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Menú lateral (móvil) */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
          display: { sm: 'none' }
        }}
        open={drawerOpen}
        onClose={handleDrawerClose}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Menú
          </Typography>
        </Box>
        
        <Divider />
        
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              component={Link} 
              to={item.path}
              onClick={handleDrawerClose}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 10, // Espacio para la barra superior
          pb: 4,
          width: '100%'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;