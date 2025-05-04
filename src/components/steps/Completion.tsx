import { useState } from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Alert, LinearProgress, Box, Typography } from '@mui/material';
import axios from 'axios';

const Completion: React.FC = () => {
  const { finishSurvey } = useSurvey();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const generatePlans = async () => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Primero completar la encuesta
      const surveyCompleted = await finishSurvey();
      if (!surveyCompleted) {
        throw new Error('Error al completar la encuesta');
      }
      setProgress(20);

      // Simular progreso mientras se procesan las APIs
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prevProgress + 10;
        });
      }, 1000);

      // Llamar a ambas APIs en paralelo y guardar las respuestas
      const [trainingResponse, mealResponse] = await Promise.all([
        axios.post('http://localhost:8000/api/generate-training-plan', {}, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.post('http://localhost:8000/api/generate-meal-plan', {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // Guardar los planes en el localStorage temporalmente
      localStorage.setItem('trainingPlan', JSON.stringify(trainingResponse.data));
      localStorage.setItem('mealPlan', JSON.stringify(mealResponse.data));

      // Completar la barra de progreso
      clearInterval(progressInterval);
      setProgress(100);

      // Pequeña pausa para mostrar el 100% antes de redirigir
      setTimeout(() => {
        navigate('/recommendations');
      }, 500);

    } catch (err) {
      console.error('Error al generar planes:', err);
      setError('Hubo un error al generar tus planes personalizados. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    generatePlans();
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Generando tus planes personalizados...
        </Typography>
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                backgroundColor: '#4CAF50',
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            {progress}% completado
          </Typography>
        </Box>
        <Typography variant="body1" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
          Por favor, espera mientras procesamos tu información...
        </Typography>
      </Box>
    );
  }

  if (error) {
  return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleContinue}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            Intentar de nuevo
          </button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'success.main', mb: 3 }}>
          ¡Felicidades!
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Has completado la encuesta. Ahora generaremos tus planes personalizados.
      </Typography>
      <button
        onClick={handleContinue}
        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
      >
        Generar Planes
      </button>
    </Box>
  );
};

export default Completion;
