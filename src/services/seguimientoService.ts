import axios from 'axios';
import { SeguimientoMetrica, SeguimientoMetricaCreate } from '../types/seguimiento';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const seguimientoService = {
    // Obtener historial de métricas
    getMetricas: async (tipoMetrica?: string, fechaInicio?: string, fechaFin?: string): Promise<SeguimientoMetrica[]> => {
        const params = new URLSearchParams();
        if (tipoMetrica) params.append('tipo_metrica', tipoMetrica);
        if (fechaInicio) params.append('fecha_inicio', fechaInicio);
        if (fechaFin) params.append('fecha_fin', fechaFin);

        const response = await axios.get(`${API_URL}/api/seguimiento-metrica`, {
            params,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    // Crear nueva métrica
    createMetrica: async (metrica: SeguimientoMetricaCreate): Promise<SeguimientoMetrica> => {
        const response = await axios.post(`${API_URL}/api/seguimiento-metrica`, metrica, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    },

    // Eliminar métrica
    deleteMetrica: async (id: number): Promise<void> => {
        await axios.post(`${API_URL}/api/seguimiento-metrica/delete`, { id_metrica: id }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
    }
}; 