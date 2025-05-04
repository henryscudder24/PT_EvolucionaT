import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

// Definir la interfaz User localmente
interface User {
  id: number;
  email: string;
  nombre?: string;
  apellido?: string;
  [key: string]: any; // Permitir propiedades adicionales
}

interface TrainingPlan {
  fecha: string;
  tipo_dia: string;
  ejercicios: {
    nombre: string;
    series: number;
    repeticiones: number;
    descanso: string;
    notas: string;
  }[];
}

interface PlanComidasDiario {
  fecha: string;
  comidas: {
    tipo_comida: string;
    plato: string;
    proteinas: number;
    grasas: number;
    carbohidratos: number;
    calorias: number;
  }[];
}

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

const UserRecomendations: React.FC = () => {
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan[]>([]);
  const [mealPlan, setMealPlan] = useState<PlanComidasDiario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [searchType, setSearchType] = useState<'recipe' | 'exercise'>('recipe');
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      if (!token || !user) {
        console.log('No hay token o usuario, redirigiendo a login');
        navigate('/login');
        return;
      }

      try {
        console.log('Iniciando fetch de planes para usuario:', (user as any)?.email);
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // Obtener plan de entrenamiento
        const trainingResponse = await axios.get('http://localhost:8000/api/training-plan', { headers });
        if (trainingResponse.data) {
          console.log('Respuesta completa del backend:', trainingResponse);
          console.log('Datos del plan de entrenamiento:', trainingResponse.data);
          // Verificar la estructura de los datos antes de guardarlos
          const datosVerificados = trainingResponse.data.map((dia: any) => ({
            ...dia,
            ejercicios: dia.ejercicios.map((ej: any) => ({
              ...ej,
              nombre: ej.nombre || '',
              series: Number(ej.series) || 0,
              repeticiones: Number(ej.repeticiones) || 0
            }))
          }));
          console.log('Datos verificados antes de guardar:', datosVerificados);
          setTrainingPlan(datosVerificados);
        } else {
          // Si no hay plan, intentar generarlo
          const generateResponse = await axios.post('http://localhost:8000/api/generate-training-plan', {}, { headers });
          if (generateResponse.data) {
            // Después de generar, obtener el plan
            const newTrainingResponse = await axios.get('http://localhost:8000/api/training-plan', { headers });
            if (newTrainingResponse.data) {
              console.log('Datos del nuevo plan de entrenamiento:', newTrainingResponse.data);
              setTrainingPlan(newTrainingResponse.data);
            }
          }
        }

        // Obtener plan de comidas
        const mealResponse = await axios.get('http://localhost:8000/api/meal-plan', { headers });
        if (mealResponse.data) {
          setMealPlan(mealResponse.data);
        } else {
          // Si no hay plan, intentar generarlo
          const generateResponse = await axios.post('http://localhost:8000/api/generate-meal-plan', {}, { headers });
          if (generateResponse.data) {
            // Después de generar, obtener el plan
            const newMealResponse = await axios.get('http://localhost:8000/api/meal-plan', { headers });
            if (newMealResponse.data) {
              setMealPlan(newMealResponse.data);
            }
          }
        }

      } catch (error) {
        console.error('Error al obtener los planes:', error);
        setError('Error al cargar los planes. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [token, user, navigate]);

  const searchYouTubeVideos = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get('http://localhost:8000/api/youtube-search', {
        params: {
          query: searchQuery,
          type: searchType
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setVideos(response.data);
    } catch (error) {
      console.error('Error al buscar videos:', error);
      setError('Error al buscar videos. Por favor, intenta de nuevo.');
    }
  };

  const handleVideoClick = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setIsVideoDialogOpen(true);
  };

  const handleCloseVideoDialog = () => {
    setIsVideoDialogOpen(false);
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        Tus Planes Personalizados
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
        {/* Planes de Entrenamiento y Dieta */}
        <Box sx={{ flex: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* Plan de Entrenamiento */}
            {trainingPlan.length > 0 && (
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
                    Plan de Entrenamiento
                  </Typography>
                  {trainingPlan.map((dia, index) => (
                    <Card key={index} sx={{ mb: 3 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {new Date(dia.fecha).toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Tipo de día: {dia.tipo_dia}
                        </Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Ejercicio</TableCell>
                                <TableCell>Series</TableCell>
                                <TableCell>Repeticiones</TableCell>
                                <TableCell>Descanso</TableCell>
                                <TableCell>Notas</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {dia.ejercicios.map((ejercicio, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{ejercicio.nombre}</TableCell>
                                  <TableCell>{ejercicio.series}</TableCell>
                                  <TableCell>{ejercicio.repeticiones}</TableCell>
                                  <TableCell>{ejercicio.descanso}</TableCell>
                                  <TableCell>{ejercicio.notas}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  ))}
                </Paper>
              </Box>
            )}

            {/* Plan de Comidas */}
            {mealPlan.length > 0 && (
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
                    Plan de Comidas
                  </Typography>
                  {mealPlan.map((dia, index) => (
                    <Card key={index} sx={{ mb: 3 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {new Date(dia.fecha).toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Comida</TableCell>
                                <TableCell>Plato</TableCell>
                                <TableCell>Proteínas</TableCell>
                                <TableCell>Grasas</TableCell>
                                <TableCell>Carbos</TableCell>
                                <TableCell>Calorías</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {dia.comidas.map((comida, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{comida.tipo_comida}</TableCell>
                                  <TableCell>{comida.plato}</TableCell>
                                  <TableCell>{comida.proteinas}g</TableCell>
                                  <TableCell>{comida.grasas}g</TableCell>
                                  <TableCell>{comida.carbohidratos}g</TableCell>
                                  <TableCell>{comida.calorias}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  ))}
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h5" color="primary" gutterBottom>
                      Puedes repetir esta dieta en el tiempo
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      "La constancia vence lo que la dicha niega"
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
        </Box>

        {/* Búsqueda de Videos */}
        <Box sx={{ flex: 1, minWidth: { xs: '100%', lg: '350px' } }}>
          <Paper sx={{ p: 3, position: 'sticky', top: '20px' }}>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
              Videos de Ayuda
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              ¿Necesitas ayuda con tus ejercicios o recetas? Busca videos tutoriales para mejorar tu técnica o encontrar nuevas ideas para tus comidas.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Buscar videos"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchType === 'recipe' ? "Buscar recetas..." : "Buscar ejercicios..."}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={searchType === 'recipe' ? 'contained' : 'outlined'}
                  onClick={() => setSearchType('recipe')}
                  fullWidth
                >
                  Recetas
                </Button>
                <Button
                  variant={searchType === 'exercise' ? 'contained' : 'outlined'}
                  onClick={() => setSearchType('exercise')}
                  fullWidth
                >
                  Ejercicios
                </Button>
              </Box>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={searchYouTubeVideos}
                fullWidth
              >
                Buscar
              </Button>
            </Box>

            {/* Resultados de Videos */}
            {videos.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Resultados encontrados:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {videos.map((video) => (
                    <Card 
                      key={video.id}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { transform: 'scale(1.02)', transition: 'transform 0.2s' }
                      }}
                      onClick={() => handleVideoClick(video)}
                    >
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          style={{ width: '120px', height: '90px', objectFit: 'cover' }}
                        />
                        <CardContent sx={{ flex: 1, p: 1 }}>
                          <Typography variant="subtitle2" noWrap>
                            {video.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {video.channelTitle}
                          </Typography>
                        </CardContent>
                      </Box>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Diálogo de Video */}
      <Dialog
        open={isVideoDialogOpen}
        onClose={handleCloseVideoDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedVideo?.title}
          <IconButton
            aria-label="close"
            onClick={handleCloseVideoDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedVideo && (
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserRecomendations; 