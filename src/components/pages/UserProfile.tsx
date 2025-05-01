import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';

const mensajesMotivadores = [
  "¡Cada día es una nueva oportunidad para ser mejor!",
  "Tu dedicación hoy construye tu éxito mañana",
  "Pequeños pasos, grandes resultados",
  "La constancia es la clave del éxito",
  "Tu bienestar es tu prioridad",
  "Cada meta alcanzada es una victoria",
  "Tu potencial es ilimitado",
  "La disciplina supera al talento",
  "Hoy es el día para empezar",
  "Tu salud es tu riqueza"
];

interface SurveyStatus {
  completed: boolean;
  last_updated: string | null;
}

interface HealthMetrics {
  tmb: number;
  peso_ideal: number;
  frecuencia_cardiaca_maxima: number;
  peso_actual: number;
  diferencia_peso: number;
}

const UserProfile: React.FC = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [surveyStatus, setSurveyStatus] = useState<SurveyStatus>({ completed: false, last_updated: null });
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);

  useEffect(() => {
    if (user) {
      // Mostrar mensaje de bienvenida
      toast.success(`¡Bienvenido ${user.nombre}!`, {
        duration: 4000,
        style: {
          background: '#ECFDF5',
          color: '#065F46',
          border: '1px solid #A7F3D0',
        },
      });

      // Mostrar mensaje motivador después de 2 segundos
      setTimeout(() => {
        const mensajeAleatorio = mensajesMotivadores[Math.floor(Math.random() * mensajesMotivadores.length)];
        toast(mensajeAleatorio, {
          duration: 5000,
          style: {
            background: '#EFF6FF',
            color: '#1E40AF',
            border: '1px solid #BFDBFE',
          },
        });
      }, 2000);

      // Verificar estado de la encuesta y obtener métricas de salud
      fetchSurveyStatus();
      fetchHealthMetrics();
    }
  }, [user]);

  const fetchSurveyStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/usuarios/me/survey-status', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSurveyStatus(response.data);
    } catch (error) {
      console.error('Error al obtener estado de la encuesta:', error);
    }
  };

  const fetchHealthMetrics = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/usuarios/me/health-metrics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHealthMetrics(response.data);
    } catch (error) {
      console.error('Error al obtener métricas de salud:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Por favor inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Perfil de Usuario</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Información Personal</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Nombre:</p>
                <p className="font-medium">{user.nombre}</p>
              </div>
              <div>
                <p className="text-gray-600">Email:</p>
                <p className="font-medium">{user.correo}</p>
              </div>
            </div>
          </div>

          {healthMetrics && (
            <div className="pt-4 border-t">
              <h2 className="text-xl font-semibold mb-2">Métricas de Salud</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Tasa Metabólica Basal (TMB):</p>
                  <p className="font-medium">{healthMetrics.tmb} kcal/día</p>
                </div>
                <div>
                  <p className="text-gray-600">Peso Ideal:</p>
                  <p className="font-medium">{healthMetrics.peso_ideal} kg</p>
                </div>
                <div>
                  <p className="text-gray-600">Frecuencia Cardíaca Máxima:</p>
                  <p className="font-medium">{healthMetrics.frecuencia_cardiaca_maxima} lpm</p>
                </div>
                <div>
                  <p className="text-gray-600">Diferencia con Peso Ideal:</p>
                  <p className={`font-medium ${healthMetrics.diferencia_peso > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {healthMetrics.diferencia_peso > 0 ? '+' : ''}{healthMetrics.diferencia_peso} kg
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <h2 className="text-xl font-semibold mb-2">Estado de la Encuesta</h2>
            <div className="flex items-center space-x-2 mb-4">
              {surveyStatus.completed ? (
                <>
                  <FaCheckCircle className="text-green-500 text-xl" />
                  <span className="text-green-600 font-medium">Encuesta completada</span>
                  {surveyStatus.last_updated && (
                    <span className="text-gray-500 text-sm">
                      (Última actualización: {new Date(surveyStatus.last_updated).toLocaleDateString()})
                    </span>
                  )}
                </>
              ) : (
                <span className="text-yellow-600">Encuesta pendiente</span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <h2 className="text-xl font-semibold mb-2">Acciones</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/survey')}
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
              >
                {surveyStatus.completed ? 'Modificar Preferencias' : 'Completar Encuesta'}
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 