import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Card,
  CardMedia,
  Tab,
  Tabs,
  Link,
  Breadcrumbs
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';
import EngineeringIcon from '@mui/icons-material/Engineering';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import PeopleIcon from '@mui/icons-material/People';
import StraightenIcon from '@mui/icons-material/Straighten';
import HomeIcon from '@mui/icons-material/Home';

import { vehicleService } from '../../services/vehicleService';

// Componente para pestañas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vehicle-tabpanel-${index}`}
      aria-labelledby={`vehicle-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const VehicleDetailsPage = () => {
  const { id } = useParams(); // Obtener ID de la URL
  const navigate = useNavigate();
  
  // Estados
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Cargar datos del vehículo
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const response = await vehicleService.getVehicleById(id);
        setVehicle(response.vehicle || null);
        setError(null);
      } catch (err) {
        console.error('Error fetching vehicle:', err);
        setError(err.message || 'Error al cargar los detalles del vehículo');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchVehicle();
    }
  }, [id]);
  
  // Cambiar pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Formatear precio
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Precio no disponible';
    
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Volver a la página anterior
  const handleBack = () => {
    navigate(-1);
  };
  
  // Ir a la página de comparación con este vehículo
  const handleCompare = () => {
    navigate(`/compare?ids=${id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs de navegación */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
          Inicio
        </Link>
        <Typography color="text.primary">Detalles del vehículo</Typography>
      </Breadcrumbs>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : !vehicle ? (
        <Alert severity="warning">
          No se encontró el vehículo solicitado. Puede haber sido eliminado o no existe.
        </Alert>
      ) : (
        <>
          {/* Acciones superiores */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={handleBack}
              variant="outlined"
            >
              Volver
            </Button>
            
            <Button 
              startIcon={<CompareArrowsIcon />} 
              onClick={handleCompare}
              variant="contained"
              color="primary"
            >
              Comparar
            </Button>
          </Box>
          
          {/* Encabezado del vehículo */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom>
                  {vehicle.brand?.name} {vehicle.model}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EventIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1">
                    Año: {vehicle.year}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="h6" color="primary">
                    {formatPrice(vehicle.price)}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                {/* Resumen de especificaciones clave */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SpeedIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Potencia
                        </Typography>
                        <Typography variant="body1">
                          {vehicle.specifications?.horsepower ? `${vehicle.specifications.horsepower} HP` : 'No disponible'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SettingsInputComponentIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Torque
                        </Typography>
                        <Typography variant="body1">
                          {vehicle.specifications?.torque ? `${vehicle.specifications.torque} lb-ft` : 'No disponible'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PeopleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Pasajeros
                        </Typography>
                        <Typography variant="body1">
                          {vehicle.specifications?.passenger_capacity || 'No disponible'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DirectionsCarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Carga
                        </Typography>
                        <Typography variant="body1">
                          {vehicle.specifications?.payload_capacity ? `${vehicle.specifications.payload_capacity} kg` : 'No disponible'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                
                {/* Botón de ver en fabricante */}
                {vehicle.detail_url && (
                  <Button 
                    variant="outlined" 
                    href={vehicle.detail_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ mt: 3 }}
                    fullWidth
                  >
                    Ver en el sitio oficial
                  </Button>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardMedia
                    component="img"
                    height="300"
                    image={vehicle.image_url || `https://via.placeholder.com/800x600?text=${vehicle.brand?.name}+${vehicle.model}`}
                    alt={`${vehicle.brand?.name} ${vehicle.model}`}
                  />
                </Card>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Tabs para detalles */}
          <Paper elevation={2} sx={{ mb: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="detalles del vehículo"
                centered
              >
                <Tab label="Especificaciones Técnicas" />
                <Tab label="Dimensiones y Capacidades" />
                <Tab label="Rendimiento" />
              </Tabs>
            </Box>
            
            {/* Panel de Especificaciones Técnicas */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3} sx={{ px: 3, pb: 3 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Motor y Transmisión
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Tipo de Motor
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.engine_type || 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Cilindrada
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.engine_displacement ? `${vehicle.specifications.engine_displacement}L` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Potencia
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.horsepower ? `${vehicle.specifications.horsepower} HP` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Torque
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.torque ? `${vehicle.specifications.torque} lb-ft` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Transmisión
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.transmission || 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Tracción
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.drivetrain || 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Consumo de Combustible
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Ciudad
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.fuel_economy_city ? `${vehicle.specifications.fuel_economy_city} km/l` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Carretera
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.fuel_economy_highway ? `${vehicle.specifications.fuel_economy_highway} km/l` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Combinado
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.fuel_economy_combined ? `${vehicle.specifications.fuel_economy_combined} km/l` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Panel de Dimensiones y Capacidades */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3} sx={{ px: 3, pb: 3 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Dimensiones
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Longitud
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.length ? `${vehicle.specifications.length} mm` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Ancho
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.width ? `${vehicle.specifications.width} mm` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Alto
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.height ? `${vehicle.specifications.height} mm` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Distancia entre Ejes
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.wheelbase ? `${vehicle.specifications.wheelbase} mm` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Altura al Suelo
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.ground_clearance ? `${vehicle.specifications.ground_clearance} mm` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Capacidades
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Capacidad de Pasajeros
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.passenger_capacity || 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Capacidad de Carga
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.payload_capacity ? `${vehicle.specifications.payload_capacity} kg` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Capacidad de Remolque
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.towing_capacity ? `${vehicle.specifications.towing_capacity} kg` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Capacidad de Tanque
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.fuel_tank_capacity ? `${vehicle.specifications.fuel_tank_capacity} L` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Panel de Rendimiento */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3} sx={{ px: 3, pb: 3 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Rendimiento y Desempeño
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Aceleración 0-100 km/h
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.acceleration_0_100 ? `${vehicle.specifications.acceleration_0_100} segundos` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Velocidad Máxima
                    </Typography>
                    <Typography variant="body1">
                      {/* Esto es un ejemplo, ajusta según tu modelo de datos */}
                      {vehicle.specifications?.max_speed ? `${vehicle.specifications.max_speed} km/h` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Sistema de Frenos
                    </Typography>
                    <Typography variant="body1">
                      {/* Esto es un ejemplo, ajusta según tu modelo de datos */}
                      {vehicle.specifications?.braking_system || 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                {/* Características adicionales - Pueden ajustarse según tu modelo de datos */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Consumo y Emisiones
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Consumo Combinado
                    </Typography>
                    <Typography variant="body1">
                      {vehicle.specifications?.fuel_economy_combined ? `${vehicle.specifications.fuel_economy_combined} km/l` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Emisiones de CO₂
                    </Typography>
                    <Typography variant="body1">
                      {/* Esto es un ejemplo, ajusta según tu modelo de datos */}
                      {vehicle.specifications?.co2_emissions ? `${vehicle.specifications.co2_emissions} g/km` : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
          
          {/* Información de fecha de extracción */}
          {vehicle.fecha_extraccion && (
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary">
                Datos actualizados el: {new Date(vehicle.fecha_extraccion).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default VehicleDetailsPage;