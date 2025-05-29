import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  SvgIcon
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';

// SVG para ilustración de página no encontrada
const NotFoundSvg = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" sx={{ fontSize: 120 }}>
      <path 
        fill="currentColor" 
        d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z M14.59,8,12,10.59,9.41,8,8,9.41,10.59,12,8,14.59,9.41,16,12,13.41,14.59,16,16,14.59,13.41,12,16,9.41Z"
      />
    </SvgIcon>
  );
};

const NotFoundPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Paper 
        elevation={3} 
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <NotFoundSvg color="primary" />
        
        <Typography variant="h3" component="h1" gutterBottom sx={{ mt: 3 }}>
          Página no encontrada
        </Typography>
        
        <Typography variant="h6" color="text.secondary" paragraph>
          La página que estás buscando no existe o ha sido movida.
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto' }}>
          Puede que hayas accedido a una URL incorrecta o que la página haya sido eliminada.
          Verifica la dirección e inténtalo nuevamente.
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/"
            startIcon={<HomeIcon />}
          >
            Ir al inicio
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={RouterLink}
            to="/"
            startIcon={<SearchIcon />}
          >
            Buscar camionetas
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;