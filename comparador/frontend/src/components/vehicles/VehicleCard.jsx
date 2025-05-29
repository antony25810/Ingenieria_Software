import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
  CardActions,
  Divider,
  styled
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import InfoIcon from '@mui/icons-material/Info';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';
import PeopleIcon from '@mui/icons-material/People';
import { Link } from 'react-router-dom';

// Componentes estilizados
const StyledCard = styled(Card)(({ theme, selected }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  borderRadius: theme.shape.borderRadius,
  border: selected ? `2px solid ${theme.palette.primary.main}` : 'none',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8]
  }
}));

const PriceChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  zIndex: 1
}));

const SpecItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(1)
  }
}));

const VehicleCard = ({ vehicle, selected, onSelect }) => {
  // Formatear precio
  const formatPrice = (price) => {
    if (!price) return 'Precio no disponible';
    
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Encontrar especificaciones
  const specs = vehicle.specifications || {};
  
  return (
    <StyledCard selected={selected}>
      {/* Etiqueta de precio */}
      {vehicle.price && (
        <PriceChip label={formatPrice(vehicle.price)} />
      )}
      
      {/* Imagen del vehículo */}
      <CardMedia
        component="img"
        height="180"
        image={vehicle.image_url || `https://via.placeholder.com/400x300?text=${vehicle.brand.name}+${vehicle.model}`}
        alt={`${vehicle.brand.name} ${vehicle.model}`}
      />
      
      {/* Contenido principal */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {vehicle.brand.name} {vehicle.model} 
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {vehicle.year}
        </Typography>
        
        <Divider sx={{ my: 1.5 }} />
        
        {/* Especificaciones principales */}
        <SpecItem>
          <SpeedIcon />
          <Typography variant="body2">
            {specs.horsepower ? `${specs.horsepower} HP` : 'Potencia no disponible'}
          </Typography>
        </SpecItem>
        
        <SpecItem>
          <PeopleIcon />
          <Typography variant="body2">
            {specs.passenger_capacity ? `${specs.passenger_capacity} pasajeros` : 'Capacidad no disponible'}
          </Typography>
        </SpecItem>
        
        <SpecItem>
          <LocalGasStationIcon />
          <Typography variant="body2">
            {specs.fuel_economy_combined ? `${specs.fuel_economy_combined} km/l` : 
             (specs.fuel_economy_city && specs.fuel_economy_highway) ? 
             `${specs.fuel_economy_city}/${specs.fuel_economy_highway} ciudad/carretera` : 
             'Consumo no disponible'}
          </Typography>
        </SpecItem>
        
        <SpecItem>
          <DirectionsCarIcon />
          <Typography variant="body2">
            {specs.payload_capacity ? `${specs.payload_capacity} kg carga` : 'Capacidad de carga no disponible'}
          </Typography>
        </SpecItem>
      </CardContent>
      
      {/* Acciones */}
      <CardActions>
        <Button 
          fullWidth 
          variant={selected ? "contained" : "outlined"}
          color={selected ? "primary" : "primary"}
          startIcon={<CompareArrowsIcon />}
          onClick={() => onSelect(vehicle)}
        >
          {selected ? "Quitar comparación" : "Comparar"}
        </Button>
        
        <Button
          component={Link}
          to={`/vehicles/${vehicle.id}`}
          variant="outlined"
          startIcon={<InfoIcon />}
        >
          Detalles
        </Button>
      </CardActions>
    </StyledCard>
  );
};

export default VehicleCard;