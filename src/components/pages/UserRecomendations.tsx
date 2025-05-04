import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

interface TrainingPlan {
  training_plan: string;
  generated_at: string;
}

interface MealPlan {
  meal_plan: string;
  generated_at: string;
}

const UserRecomendations: React.FC = () => {
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      if (!token || !user) {
        navigate('/login');
        return;
      }

      try {
        // Primero intentar obtener los planes del localStorage
        const storedTrainingPlan = localStorage.getItem('trainingPlan');
        const storedMealPlan = localStorage.getItem('mealPlan');

        if (storedTrainingPlan && storedMealPlan) {
          setTrainingPlan(JSON.parse(storedTrainingPlan));
          setMealPlan(JSON.parse(storedMealPlan));
          setLoading(false);
          return;
        }

        // Si no hay planes en localStorage, intentar obtenerlos del servidor
        const [trainingResponse, mealResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/training-plan', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:8000/api/meal-plan', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setTrainingPlan(trainingResponse.data);
        setMealPlan(mealResponse.data);

        // Guardar los planes en localStorage para futuras visitas
        localStorage.setItem('trainingPlan', JSON.stringify(trainingResponse.data));
        localStorage.setItem('mealPlan', JSON.stringify(mealResponse.data));
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('No se encontraron planes generados o no tienes acceso a ellos');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [token, user, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!trainingPlan || !mealPlan) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No se encontraron planes generados. Por favor, completa la encuesta primero.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tus Planes Personalizados
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Plan de Entrenamiento
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <div dangerouslySetInnerHTML={{ __html: trainingPlan.training_plan }} />
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Plan de Comidas
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <div dangerouslySetInnerHTML={{ __html: mealPlan.meal_plan }} />
        </Box>
      </Paper>
    </Box>
  );
};

export default UserRecomendations; 