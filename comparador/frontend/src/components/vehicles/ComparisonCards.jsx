import React from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Divider,
  Chip,
  styled
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';
import PeopleIcon from '@mui/icons-material/People';
import EngineeringIcon from '@mui/icons-material/Engineering';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';

// Estilos personalizados
const SpecItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
  '& .MuiSvgIcon-root': {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(1)
  }
}));

const BrandChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  zIndex: 1
}));

const PriceChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  fontWeight: 'bold',
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  zIndex: 1
}));

const ComparisonCards = ({ vehicles }) => {
  // Formatear precio
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Precio no disponible';
    
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Grid container spacing={3}>
      {vehicles.map((vehicle) => {
        const specs = vehicle.specifications || {};
        
        return (
          <Grid item xs={12} sm={6} md={vehicles.length > 2 ? 3 : 6} key={vehicle.id}>
            <Card sx={{ height: '100%', position: 'relative' }}>
              <BrandChip label={vehicle.brand.name} />
              {vehicle.price && <PriceChip label={formatPrice(vehicle.price)} />}
              
              <CardMedia
                component="img"
                height="200"
                image={vehicle.image_url || `https://via.placeholder.com/400x250?text=${vehicle.brand.name}+${vehicle.model}`}
                alt={`${vehicle.brand.name} ${vehicle.model}`}
              />
              
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {vehicle.model}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {vehicle.year}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Especificaciones
                </Typography>
                
                <SpecItem>
                  <SpeedIcon />
                  <Typography variant="body2">
                    <strong>Potencia:</strong> {specs.horsepower ? `${specs.horsepower} HP` : 'No disponible'}
                  </Typography>
                </SpecItem>
                
                <SpecItem>
                  <SettingsInputComponentIcon />
                  <Typography variant="body2">
                    <strong>Torque:</strong> {specs.torque ? `${specs.torque} lb-ft` : 'No disponible'}
                  </Typography>
                </SpecItem>
                
                <SpecItem>
                  <EngineeringIcon />
                  <Typography variant="body2">
                    <strong>Motor:</strong> {specs.engine_type || 'No disponible'}
                    {specs.engine_displacement ? ` (${specs.engine_displacement}L)` : ''}
                  </Typography>
                </SpecItem>
                
                <SpecItem>
                  <PeopleIcon />
                  <Typography variant="body2">
                    <strong>Pasajeros:</strong> {specs.passenger_capacity || 'No disponible'}
                  </Typography>
                </SpecItem>
                
                <SpecItem>
                  <DirectionsCarIcon />
                  <Typography variant="body2">
                    <strong>Capacidad de carga:</strong> {specs.payload_capacity ? `${specs.payload_capacity} kg` : 'No disponible'}
                  </Typography>
                </SpecItem>
                
                <SpecItem>
                  <LocalGasStationIcon />
                  <Typography variant="body2">
                    <strong>Consumo:</strong> {specs.fuel_economy_combined ? 
                      `${specs.fuel_economy_combined} km/l` : 
                      (specs.fuel_economy_city && specs.fuel_economy_highway) ?
                      `${specs.fuel_economy_city}/${specs.fuel_economy_highway} ciudad/carretera` :
                      'No disponible'
                    }
                  </Typography>
                </SpecItem>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ComparisonCards;