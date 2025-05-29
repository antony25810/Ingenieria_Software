import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';

import { vehicleService } from '../../services/vehicleService';
import ComparisonTable from '../../components/vehicles/ComparisonTable';
import ComparisonCharts from '../../components/vehicles/ComparisonCharts';
import ComparisonCards from '../../components/vehicles/ComparisonCards';

// Componente TabPanel para las pestañas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`comparison-tabpanel-${index}`}
      aria-labelledby={`comparison-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ComparePage = () => {
  // Obtener IDs de URL
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const vehicleIdsParam = queryParams.get('ids');
  
  // Estados
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Cargar datos
  useEffect(() => {
    const loadVehicles = async () => {
      if (!vehicleIdsParam) {
        setError('No se han seleccionado vehículos para comparar');
        setLoading(false);
        return;
      }
      
      const vehicleIds = vehicleIdsParam.split(',').map(id => parseInt(id));
      
      if (vehicleIds.length < 2) {
        setError('Se requieren al menos 2 vehículos para comparar');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Cargar datos de comparación
        const data = await vehicleService.compareVehicles(vehicleIds);
        setVehicles(data.vehicles || []);
        
        setError(null);
      } catch (err) {
        console.error('Error loading comparison data:', err);
        setError(err.message || 'Error al cargar los datos de comparación');
      } finally {
        setLoading(false);
      }
    };
    
    loadVehicles();
  }, [vehicleIdsParam]);
  
  // Cambiar pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Volver a la página anterior
  const handleBack = () => {
    navigate(-1);
  };
  
  // Compartir comparación
  const handleShare = () => {
    // Copiar URL actual al portapapeles
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert('¡Enlace copiado al portapapeles!');
      })
      .catch(err => {
        console.error('Error al copiar enlace:', err);
      });
  };
  
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Comparación de Camionetas
        </Typography>
        
        <Box>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Volver
          </Button>
          
          <Button 
            variant="outlined" 
            startIcon={<ShareIcon />}
            onClick={handleShare}
          >
            Compartir
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : vehicles.length >= 2 ? (
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Tarjetas" />
              <Tab label="Tabla" />
              <Tab label="Gráficos" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <ComparisonCards vehicles={vehicles} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <ComparisonTable vehicles={vehicles} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <ComparisonCharts vehicles={vehicles} />
          </TabPanel>
        </Paper>
      ) : (
        <Alert severity="info">
          Selecciona al menos 2 camionetas para comparar.
        </Alert>
      )}
    </Container>
  );
};

export default ComparePage;