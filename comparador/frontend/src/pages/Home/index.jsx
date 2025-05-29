import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress, 
  Alert,
  Snackbar
} from '@mui/material';
import { vehicleService } from '../../services/vehicleService';
import FilterPanel from '../../components/vehicles/FilterPanel';
import VehicleGrid from '../../components/vehicles/VehicleGrid';
import ComparisonBar from '../../components/vehicles/ComparisonBar';

const HomePage = () => {
  // Estados
  const [vehicles, setVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    brandIds: [],
    minPassengers: '',
    minHorsepower: '',
    minPrice: '',
    maxPrice: ''
  });
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Cargar marcas
        const brandsData = await vehicleService.getBrands();
        setBrands(brandsData.brands || []);
        
        // Cargar vehículos iniciales
        const vehiclesData = await vehicleService.getVehicles();
        setVehicles(vehiclesData.vehicles || []);
        
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  // Manejar cambios en filtros
  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters);
    
    try {
      setLoading(true);
      const vehiclesData = await vehicleService.getVehicles(newFilters);
      setVehicles(vehiclesData.vehicles || []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Error al aplicar filtros',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Manejar selección de vehículos para comparar
  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicles(prev => {
      // Si ya está seleccionado, lo quitamos
      if (prev.some(v => v.id === vehicle.id)) {
        return prev.filter(v => v.id !== vehicle.id);
      }
      
      // Si tenemos 4 o más, mostramos error
      if (prev.length >= 4) {
        setSnackbar({
          open: true,
          message: 'Puedes comparar hasta 4 vehículos a la vez',
          severity: 'warning'
        });
        return prev;
      }
      
      // Añadimos el vehículo a la selección
      return [...prev, vehicle];
    });
  };
  
  // Cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Título principal */}
      <Typography variant="h4" component="h1" gutterBottom>
        Comparador de Camionetas
      </Typography>
      
      {/* Mensaje de error principal */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Panel de filtros */}
        <Grid item xs={12} md={3}>
          <FilterPanel 
            brands={brands} 
            filters={filters} 
            onFilterChange={handleFilterChange}
            disabled={loading}
          />
        </Grid>
        
        {/* Lista de vehículos */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <VehicleGrid 
              vehicles={vehicles} 
              selectedVehicles={selectedVehicles}
              onVehicleSelect={handleVehicleSelect}
            />
          )}
        </Grid>
      </Grid>
      
      {/* Barra de comparación (aparece cuando hay vehículos seleccionados) */}
      {selectedVehicles.length > 0 && (
        <ComparisonBar 
          selectedVehicles={selectedVehicles} 
          onClearAll={() => setSelectedVehicles([])}
        />
      )}
      
      {/* Notificaciones */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HomePage;