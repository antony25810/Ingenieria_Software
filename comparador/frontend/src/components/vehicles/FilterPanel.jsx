import React, { useState } from 'react';
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  TextField,
  Button,
  Box,
  Divider,
  Chip,
  OutlinedInput
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const FilterPanel = ({ brands, filters, onFilterChange, disabled }) => {
  // Clonar filtros para trabajar localmente
  const [localFilters, setLocalFilters] = useState({ ...filters });
  
  // Manejar cambio en marcas seleccionadas
  const handleBrandChange = (event) => {
    const {
      target: { value },
    } = event;
    
    // Usar array spread para evitar que Material-UI controle el valor internamente
    setLocalFilters({
      ...localFilters,
      brandIds: typeof value === 'string' ? value.split(',') : value,
    });
  };
  
  // Manejar cambio en otros filtros
  const handleFilterChange = (field) => (event) => {
    setLocalFilters({
      ...localFilters,
      [field]: event.target.value,
    });
  };
  
  // Aplicar filtros
  const applyFilters = () => {
    onFilterChange(localFilters);
  };
  
  // Resetear filtros
  const resetFilters = () => {
    const emptyFilters = {
      brandIds: [],
      minPassengers: '',
      minHorsepower: '',
      minPrice: '',
      maxPrice: ''
    };
    
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };
  
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filtros de Búsqueda
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Selector de marcas */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="brands-label">Marcas</InputLabel>
        <Select
          labelId="brands-label"
          id="brands-select"
          multiple
          value={localFilters.brandIds}
          onChange={handleBrandChange}
          input={<OutlinedInput id="select-multiple-chip" label="Marcas" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((brandId) => {
                const brand = brands.find(b => b.id === parseInt(brandId));
                return (
                  <Chip key={brandId} label={brand ? brand.name : brandId} />
                );
              })}
            </Box>
          )}
          disabled={disabled || brands.length === 0}
        >
          {brands.map((brand) => (
            <MenuItem key={brand.id} value={brand.id}>
              {brand.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {/* Filtro de número de pasajeros */}
      <FormControl fullWidth margin="normal">
        <TextField
          label="Pasajeros (mínimo)"
          type="number"
          value={localFilters.minPassengers}
          onChange={handleFilterChange('minPassengers')}
          InputProps={{ inputProps: { min: 0 } }}
          disabled={disabled}
        />
      </FormControl>
      
      {/* Filtro de potencia */}
      <FormControl fullWidth margin="normal">
        <TextField
          label="Potencia (HP mínima)"
          type="number"
          value={localFilters.minHorsepower}
          onChange={handleFilterChange('minHorsepower')}
          InputProps={{ inputProps: { min: 0 } }}
          disabled={disabled}
        />
      </FormControl>
      
      {/* Filtro de rango de precios */}
      <Typography gutterBottom sx={{ mt: 2 }}>
        Rango de Precios (USD)
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Mínimo"
          type="number"
          value={localFilters.minPrice}
          onChange={handleFilterChange('minPrice')}
          disabled={disabled}
          size="small"
          InputProps={{ inputProps: { min: 0 } }}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Máximo"
          type="number"
          value={localFilters.maxPrice}
          onChange={handleFilterChange('maxPrice')}
          disabled={disabled}
          size="small"
          InputProps={{ inputProps: { min: 0 } }}
          sx={{ flex: 1 }}
        />
      </Box>
      
      {/* Botones de acción */}
      <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<FilterAltIcon />}
          onClick={applyFilters}
          disabled={disabled}
          fullWidth
        >
          Aplicar Filtros
        </Button>
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={resetFilters}
          disabled={disabled}
          fullWidth
        >
          Resetear
        </Button>
      </Box>
    </Paper>
  );
};

export default FilterPanel;