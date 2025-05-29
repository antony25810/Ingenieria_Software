import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Grid
} from '@mui/material';
import {
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Colores para los gráficos
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F'];

const ComparisonCharts = ({ vehicles }) => {
  const [chartType, setChartType] = useState('radar');
  
  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };
  
  // Preparar datos para el gráfico radar
  const prepareRadarData = () => {
    if (!vehicles || vehicles.length === 0) return [];
    
    // Definir atributos y valores máximos para normalización
    const attributes = [
      { name: 'Potencia', key: 'horsepower', max: 500 },
      { name: 'Torque', key: 'torque', max: 600 },
      { name: 'Capacidad Carga', key: 'payload_capacity', max: 2000 },
      { name: 'Capacidad Remolque', key: 'towing_capacity', max: 5000 },
      { name: 'Pasajeros', key: 'passenger_capacity', max: 9 }
    ];
    
    // Crear datos para cada vehículo
    return vehicles.map((vehicle, index) => {
      const data = {
        name: `${vehicle.brand.name} ${vehicle.model}`,
        color: COLORS[index % COLORS.length]
      };
      
      // Normalizar valores para cada atributo
      attributes.forEach(attr => {
        const specs = vehicle.specifications || {};
        const value = specs[attr.key] || 0;
        // Normalizar a escala 0-100
        data[attr.name] = Math.round((value / attr.max) * 100);
      });
      
      return data;
    });
  };
  
  // Preparar datos para gráficos de barras
  const prepareBarData = (attribute, label) => {
    return vehicles.map(vehicle => {
      const specs = vehicle.specifications || {};
      return {
        name: `${vehicle.brand.name} ${vehicle.model}`,
        value: specs[attribute] || 0,
        label: label
      };
    });
  };
  
  // Radar data
  const radarData = prepareRadarData();
  
  // Bar chart data
  const horsepowerData = prepareBarData('horsepower', 'Potencia (HP)');
  const torqueData = prepareBarData('torque', 'Torque (lb-ft)');
  const economyData = vehicles.map(vehicle => {
    const specs = vehicle.specifications || {};
    return {
      name: `${vehicle.brand.name} ${vehicle.model}`,
      ciudad: specs.fuel_economy_city || 0,
      carretera: specs.fuel_economy_highway || 0,
      combinado: specs.fuel_economy_combined || 0
    };
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          aria-label="tipo de gráfico"
        >
          <ToggleButton value="radar" aria-label="gráfico radar">
            Radar
          </ToggleButton>
          <ToggleButton value="bars" aria-label="gráficos de barras">
            Barras
          </ToggleButton>
          <ToggleButton value="economy" aria-label="gráfico de economía">
            Consumo
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {/* Gráfico de Radar */}
      {chartType === 'radar' && (
        <Paper elevation={2} sx={{ p: 3, height: 500 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Comparación General (valores normalizados)
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              
              {radarData.map((entry, index) => (
                <Radar
                  key={`radar-${index}`}
                  name={entry.name}
                  dataKey={entry.name}
                  stroke={entry.color}
                  fill={entry.color}
                  fillOpacity={0.6}
                />
              ))}
              
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </Paper>
      )}
      
      {/* Gráficos de Barras */}
      {chartType === 'bars' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" align="center" gutterBottom>
                Comparación de Potencia (HP)
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={horsepowerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Potencia (HP)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" align="center" gutterBottom>
                Comparación de Torque (lb-ft)
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={torqueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Torque (lb-ft)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" align="center" gutterBottom>
                Comparación de Capacidades
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={[
                    ...prepareBarData('payload_capacity', 'Capacidad de Carga (kg)'),
                    ...prepareBarData('towing_capacity', 'Capacidad de Remolque (kg)')
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Capacidad" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Gráfico de Economía de Combustible */}
      {chartType === 'economy' && (
        <Paper elevation={2} sx={{ p: 3, height: 500 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Comparación de Consumo de Combustible (km/l)
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={economyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ciudad" name="Ciudad" fill="#8884d8" />
              <Bar dataKey="carretera" name="Carretera" fill="#82ca9d" />
              <Bar dataKey="combinado" name="Combinado" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}
    </Box>
  );
};

export default ComparisonCharts;