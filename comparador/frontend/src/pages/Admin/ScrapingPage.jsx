import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Alert,
  CircularProgress,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { scrapingService } from '../../services/scrapingService';
import { vehicleService } from '../../services/vehicleService';

const ScrapingPage = () => {
  // Estados
  const [logs, setLogs] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [scrapingUrl, setScrapingUrl] = useState('');
  const [dialogLoading, setDialogLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Cargar logs de scraping
        const logsData = await scrapingService.getScrapingLogs();
        setLogs(logsData.logs || []);
        
        // Cargar marcas para el selector
        const brandsData = await vehicleService.getBrands();
        setBrands(brandsData.brands || []);
        
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
  
  // Recargar logs
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const logsData = await scrapingService.getScrapingLogs();
      setLogs(logsData.logs || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al recargar los logs');
    } finally {
      setLoading(false);
    }
  };
  
  // Abrir diálogo de nuevo scraping
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  
  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBrand('');
    setScrapingUrl('');
  };
  
  // Manejar cambio de marca seleccionada
  const handleBrandChange = (event) => {
    const brandId = event.target.value;
    setSelectedBrand(brandId);
    
    // Auto-completar URL si existe
    const brand = brands.find(b => b.id === brandId);
    if (brand && brand.website_url) {
      setScrapingUrl(brand.website_url);
    } else {
      setScrapingUrl('');
    }
  };
  
  // Iniciar scraping para una marca
  const handleStartScraping = async () => {
    if (!selectedBrand) {
      setSnackbar({
        open: true,
        message: 'Debes seleccionar una marca',
        severity: 'error'
      });
      return;
    }
    
    if (!scrapingUrl) {
      setSnackbar({
        open: true,
        message: 'La URL es obligatoria',
        severity: 'error'
      });
      return;
    }
    
    try {
      setDialogLoading(true);
      
      const result = await scrapingService.runScraping(selectedBrand, scrapingUrl);
      
      setSnackbar({
        open: true,
        message: result.message || 'Scraping iniciado correctamente',
        severity: 'success'
      });
      
      // Cerrar diálogo y recargar logs
      handleCloseDialog();
      await handleRefresh();
      
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Error al iniciar scraping',
        severity: 'error'
      });
    } finally {
      setDialogLoading(false);
    }
  };
  
  // Iniciar scraping para todas las marcas
  const handleStartScrapingAll = async () => {
    try {
      setLoading(true);
      
      const result = await scrapingService.runScrapingForAllBrands();
      
      setSnackbar({
        open: true,
        message: result.message || 'Scraping iniciado para todas las marcas',
        severity: 'success'
      });
      
      // Recargar logs después de un breve retraso
      setTimeout(handleRefresh, 1000);
      
    } catch (err) {
      setError(err.message || 'Error al iniciar scraping para todas las marcas');
      setSnackbar({
        open: true,
        message: err.message || 'Error al iniciar scraping para todas las marcas',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss', { locale: es });
    } catch (e) {
      return dateString;
    }
  };
  
  // Obtener color según estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'success.main';
      case 'error':
        return 'error.main';
      case 'in_progress':
        return 'warning.main';
      default:
        return 'text.primary';
    }
  };
  
  // Cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Administración de Scraping
      </Typography>
      
      <Grid container spacing={3}>
        {/* Panel de acciones */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={handleOpenDialog}
              disabled={loading || brands.length === 0}
            >
              Nuevo Scraping
            </Button>
            
            <Button
              variant="outlined"
              onClick={handleStartScrapingAll}
              disabled={loading || brands.length === 0}
            >
              Ejecutar para Todas las Marcas
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Actualizar
            </Button>
          </Paper>
        </Grid>
        
        {/* Tabla de logs */}
        <Grid item xs={12}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Paper>
            <TableContainer>
              {loading ? (
                <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : logs.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay registros de scraping disponibles.
                  </Typography>
                </Box>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Marca</TableCell>
                      <TableCell>URL</TableCell>
                      <TableCell>Inicio</TableCell>
                      <TableCell>Fin</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Encontrados</TableCell>
                      <TableCell>Añadidos</TableCell>
                      <TableCell>Actualizados</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.id}</TableCell>
                        <TableCell>{log.brand?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Box sx={{ 
                            maxWidth: 250, 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {log.url}
                          </Box>
                        </TableCell>
                        <TableCell>{formatDate(log.start_time)}</TableCell>
                        <TableCell>{formatDate(log.end_time)}</TableCell>
                        <TableCell>
                          <Typography color={getStatusColor(log.status)}>
                            {log.status === 'success' ? 'Exitoso' :
                             log.status === 'error' ? 'Error' :
                             log.status === 'in_progress' ? 'En progreso' :
                             log.status}
                          </Typography>
                        </TableCell>
                        <TableCell>{log.vehicles_found || 0}</TableCell>
                        <TableCell>{log.vehicles_added || 0}</TableCell>
                        <TableCell>{log.vehicles_updated || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Diálogo para nuevo scraping */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Scraping</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="brand-select-label">Marca</InputLabel>
              <Select
                labelId="brand-select-label"
                id="brand-select"
                value={selectedBrand}
                onChange={handleBrandChange}
                label="Marca"
                disabled={dialogLoading}
              >
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              margin="normal"
              label="URL de Scraping"
              type="url"
              fullWidth
              value={scrapingUrl}
              onChange={(e) => setScrapingUrl(e.target.value)}
              disabled={dialogLoading}
              helperText="URL de la página principal de la marca"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={dialogLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleStartScraping} 
            variant="contained" 
            disabled={dialogLoading || !selectedBrand || !scrapingUrl}
            startIcon={dialogLoading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
          >
            {dialogLoading ? 'Iniciando...' : 'Iniciar Scraping'}
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default ScrapingPage;