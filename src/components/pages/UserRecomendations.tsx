import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

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
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // Obtener planes del localStorage
        const storedTrainingPlan = localStorage.getItem('trainingPlan');
        const storedMealPlan = localStorage.getItem('mealPlan');

        if (storedTrainingPlan && storedMealPlan) {
          setTrainingPlan(JSON.parse(storedTrainingPlan));
          setMealPlan(JSON.parse(storedMealPlan));
        } else {
          setError('No se encontraron planes generados');
        }
      } catch (err) {
        setError('Error al cargar los planes');
        console.error(err);
      }
    };

    fetchPlans();
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!trainingPlan || !mealPlan) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
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