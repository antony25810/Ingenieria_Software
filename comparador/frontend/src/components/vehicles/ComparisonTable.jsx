import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  styled
} from '@mui/material';

// Estilos personalizados
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${theme.breakpoints.down('sm')}`]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  }
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 'bold',
  fontSize: '1rem',
  [`&.${theme.breakpoints.down('sm')}`]: {
    fontSize: '0.875rem',
  }
}));

const SectionRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  '& > *': {
    fontWeight: 'bold',
  }
}));

const ComparisonTable = ({ vehicles }) => {
  // Formatear precio
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'No disponible';
    
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
      <Table aria-label="tabla de comparación de vehículos" size="small">
        <TableHead>
          <TableRow>
            <HeaderCell>Característica</HeaderCell>
            {vehicles.map((vehicle) => (
              <HeaderCell key={`header-${vehicle.id}`} align="center">
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {vehicle.brand.name} {vehicle.model}
                  </Typography>
                  <Typography variant="caption">{vehicle.year}</Typography>
                </Box>
              </HeaderCell>
            ))}
          </TableRow>
        </TableHead>
        
        <TableBody>
          {/* Información General */}
          <SectionRow>
            <TableCell colSpan={vehicles.length + 1}>
              Información General
            </TableCell>
          </SectionRow>
          
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">Precio</StyledTableCell>
            {vehicles.map((vehicle) => (
              <StyledTableCell key={`price-${vehicle.id}`} align="center">
                {formatPrice(vehicle.price)}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          
          {/* Motor y Rendimiento */}
          <SectionRow>
            <TableCell colSpan={vehicles.length + 1}>
              Motor y Rendimiento
            </TableCell>
          </SectionRow>
          
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">Tipo de Motor</StyledTableCell>
            {vehicles.map((vehicle) => (
              <StyledTableCell key={`engine-${vehicle.id}`} align="center">
                {vehicle.specifications?.engine_type || 'No disponible'}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">Cilindrada (L)</StyledTableCell>
            {vehicles.map((vehicle) => (
              <StyledTableCell key={`disp-${vehicle.id}`} align="center">
                {vehicle.specifications?.engine_displacement || 'No disponible'}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">Potencia (HP)</StyledTableCell>
            {vehicles.map((vehicle) => (
              <StyledTableCell key={`hp-${vehicle.id}`} align="center">
                {vehicle.specifications?.horsepower || 'No disponible'}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">Torque (lb-ft)</StyledTableCell>
            {vehicles.map((vehicle) => (
              <StyledTableCell key={`torque-${vehicle.id}`} align="center">
                {vehicle.specifications?.torque || 'No disponible'}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">Transmisión</StyledTableCell>
            {vehicles.map((vehicle) => (
              <StyledTableCell key={`trans-${vehicle.id}`} align="center">
                {vehicle.specifications?.transmission || 'No disponible'}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">Tracción</StyledTableCell>
            {vehicles.map((vehicle) => (
              <StyledTableCell key={`drive-${vehicle.id}`} align="center">
                {vehicle.specifications?.drivetrain || 'No disponible'}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          
          {/* Eficiencia de Combustible */}
          <SectionRow>
            <TableCell colSpan={vehicles.length + 1}>
              Eficiencia de Combustible
            </TableCell>
          </SectionRow>
          
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">Ciudad (km/l)</StyledTableCell>
            {vehicles.map((vehicle) => (
              <StyledTableCell key={`city-${vehicle.id}`} align="center">
                {vehicle.specifications?.fuel_economy_city || 'No disponible'}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">Carretera (km/l)</StyledTableCell>
            {vehicles.map((vehicle) => (
              <StyledTableCell key={`hwy-${vehicle.id}`} align="center">
                {vehicle.specifications?.fuel_economy_highway || 'No disponible'}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">Combinado (km/l)</StyledTableCell>
            {vehicles.map((vehicle) => (
              <StyledTableCell key={`comb-${vehicle.id}`} align="center">
                {vehicle.specifications?.fuel_economy_combined || 'No disponible'}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">Capacidad de Tanque (L)</StyledTableCell>
            {vehicles.map((vehicle) => (
              <StyledTableCell key={`tank-${vehicle.id}`} align="center">
                {vehicle.specifications?.fuel_tank_capacity || 'No disponible'}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          
          {/* Dimensiones y Capacidades */}
          <SectionRow>
            <TableCell colSpan={vehicles.length + 1}>
              Dimensiones y Capacidades
            </TableCell>
          </SectionRow>
          
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">Número de Pasajeros</StyledTableCell>
            {vehicles.map((vehicle) => (
              <StyledTableCell key={`pass-${vehicle.id}`} align="center">
                {vehicle.specifications?.passenger_capacity || 'No disponible'}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">Capacidad de Carga (kg)</StyledTableCell>
            {vehicles.map((vehicle) => (
              <StyledTableCell key={`payload-${vehicle.id}`} align="center">
                {vehicle.specifications?.payload_capacity || 'No disponible'}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">Capacidad de Remolque (kg)</StyledTableCell>
            {vehicles.map((vehicle) => (
              <StyledTableCell key={`tow-${vehicle.id}`} align="center">
                {vehicle.specifications?.towing_capacity || 'No disponible'}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">Distancia entre Ejes (mm)</StyledTableCell>
            {vehicles.map((vehicle) => (
              <StyledTableCell key={`wheel-${vehicle.id}`} align="center">
                {vehicle.specifications?.wheelbase || 'No disponible'}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">Altura al Suelo (mm)</StyledTableCell>
            {vehicles.map((vehicle) => (
              <StyledTableCell key={`clear-${vehicle.id}`} align="center">
                {vehicle.specifications?.ground_clearance || 'No disponible'}
              </StyledTableCell>
            ))}
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ComparisonTable;