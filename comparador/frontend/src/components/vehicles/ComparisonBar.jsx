import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Divider,
  Slide,
  styled
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CloseIcon from '@mui/icons-material/Close';
import ClearAllIcon from '@mui/icons-material/ClearAll';

// Componente estilizado
const CompareBar = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: theme.shadows[4],
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const VehicleChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '& .MuiChip-avatar': {
    backgroundColor: theme.palette.primary.light,
  }
}));

const ComparisonBar = ({ selectedVehicles, onClearAll }) => {
  const navigate = useNavigate();
  
  const handleCompare = () => {
    if (selectedVehicles.length < 2) {
      alert('Debes seleccionar al menos 2 vehículos para comparar');
      return;
    }
    
    // Construir URL con IDs de vehículos
    const vehicleIds = selectedVehicles.map(v => v.id).join(',');
    navigate(`/compare?ids=${vehicleIds}`);
  };
  
  // Solo mostrar si hay al menos 1 vehículo seleccionado
  if (selectedVehicles.length === 0) {
    return null;
  }
  
  return (
    <Slide direction="up" in={selectedVehicles.length > 0} mountOnEnter unmountOnExit>
      <CompareBar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, overflow: 'auto' }}>
          <Typography variant="body1" sx={{ mr: 2, whiteSpace: 'nowrap' }}>
            Vehículos seleccionados:
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {selectedVehicles.map(vehicle => (
              <VehicleChip
                key={vehicle.id}
                label={`${vehicle.brand.name} ${vehicle.model}`}
                avatar={
                  <Avatar>
                    {vehicle.brand.name.charAt(0)}
                  </Avatar>
                }
              />
            ))}
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ClearAllIcon />}
            onClick={onClearAll}
            size="small"
            sx={{ mr: 1 }}
          >
            Limpiar
          </Button>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<CompareArrowsIcon />}
            onClick={handleCompare}
            disabled={selectedVehicles.length < 2}
          >
            Comparar ({selectedVehicles.length})
          </Button>
        </Box>
      </CompareBar>
    </Slide>
  );
};

export default ComparisonBar;