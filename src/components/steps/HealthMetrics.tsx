import React from 'react';
import { motion } from 'framer-motion';

interface HealthMetricsProps {
  tmb: number;
  pesoIdeal: number;
  frecuenciaCardiacaMaxima: number;
  pesoActual: number;
  diferenciaPeso: number;
}

const HealthMetrics: React.FC<HealthMetricsProps> = ({
  tmb,
  pesoIdeal,
  frecuenciaCardiacaMaxima,
  pesoActual,
  diferenciaPeso
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 mt-6"
    >
      <h3 className="text-xl font-semibold mb-4">Tus Métricas de Salud</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Tasa Metabólica Basal (TMB)</p>
          <p className="text-lg font-semibold text-blue-700">{tmb} kcal/día</p>
          <p className="text-xs text-gray-500 mt-1">Calorías que quemas en reposo</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Peso Ideal</p>
          <p className="text-lg font-semibold text-green-700">{pesoIdeal} kg</p>
          <p className="text-xs text-gray-500 mt-1">Según tu altura y género</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Frecuencia Cardíaca Máxima</p>
          <p className="text-lg font-semibold text-purple-700">{frecuenciaCardiacaMaxima} lpm</p>
          <p className="text-xs text-gray-500 mt-1">Límite seguro para ejercicio</p>
        </div>
        
        <div className={`p-4 rounded-lg ${diferenciaPeso > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <p className="text-sm text-gray-600">Diferencia con Peso Ideal</p>
          <p className={`text-lg font-semibold ${diferenciaPeso > 0 ? 'text-red-700' : 'text-green-700'}`}>
            {diferenciaPeso > 0 ? '+' : ''}{diferenciaPeso} kg
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {diferenciaPeso > 0 ? 'Peso por encima del ideal' : 'Peso por debajo del ideal'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default HealthMetrics; 