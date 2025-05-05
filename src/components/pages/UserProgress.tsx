import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
    Grid,
    IconButton,
    Alert,
    Snackbar,
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import YouTube from 'react-youtube';

interface SurveyData {
  perfil_usuario: {
    columnas: {
      medicion_progreso: string;
      altura?: string;
      edad?: string;
      genero?: string;
    };
  };
}

interface ProgressData {
  id: number;
  fecha: Date;
  valor: number | string;
  categoria?: string;
  detalles?: {
    unidad?: string;
    horaAcostarse?: string;
    horaLevantarse?: string;
    latencia?: number;
    despertares?: number;
    calidad?: number;
    ejercicio?: string;
    repeticiones?: number;
    notas?: string;
    mediciones?: number[];
    formula?: string;
    peso?: number;
    altura?: number;
    edad?: number;
    genero?: string;
    cintura?: number;
    cadera?: number;
    medidas?: {
      brazo?: number;
      pecho?: number;
      cintura?: number;
      cadera?: number;
      muslo?: number;
      pantorrilla?: number;
    };
  };
}

interface MetricInput {
  peso?: number;
  altura?: number;
  edad?: number;
  genero?: string;
  cintura?: number;
  cadera?: number;
  horaAcostarse?: string;
  horaLevantarse?: string;
  latencia?: number;
  despertares?: number;
  calidad?: number;
  frecuenciaCardiaca?: number[];
  cargaMaxima?: number;
  ejercicio?: string;
  repeticiones?: number;
  notas?: string;
  medidas?: {
    brazo?: number;
    pecho?: number;
    cintura?: number;
    cadera?: number;
    muslo?: number;
    pantorrilla?: number;
  };
}

const METRICAS_PERMITIDAS = [
  'Peso corporal',
  'Medidas corporales',
  'Tasa metabólica basal (TMB)',
  'IMC (Índice de Masa Corporal)',
  'Relación cintura-cadera (WHR)',
  '1RM y cargas máximas',
  'Frecuencia cardíaca en reposo',
  'Calidad del sueño'
] as const;

const EJERCICIOS_COMUNES = [
  'Press de Banca',
  'Sentadilla',
  'Peso Muerto',
  'Press Militar',
  'Remo con Barra',
  'Dominadas',
  'Extensiones de Pierna',
  'Curl de Bíceps',
  'Extensiones de Tríceps',
  'Elevaciones Laterales',
  'Pull-ups',
  'Dips',
  'Zancadas',
  'Extensiones de Hombro',
  'Curl de Piernas',
  'Extensiones de Espalda',
  'Press de Piernas',
  'Remo en Polea',
  'Face Pulls',
  'Otro'
] as const;

// Definir el tipo para las métricas permitidas
type MetricType = typeof METRICAS_PERMITIDAS[number];

// Definir el tipo para el objeto de videos
const METRICAS_VIDEOS: Record<MetricType, string> = {
  'Peso corporal': 'https://www.youtube.com/watch?v=LJJWUm_ycqY', // Cómo medir el peso correctamente
  'Medidas corporales': 'https://www.youtube.com/watch?v=EowTFITG1KI', // Cómo tomar medidas corporales
  'Tasa metabólica basal (TMB)': 'https://www.youtube.com/watch?v=sESIyKwfLJM', // Explicación de TMB
  'IMC (Índice de Masa Corporal)': 'https://www.youtube.com/watch?v=m5I4M071KOA', // Cómo calcular IMC
  'Relación cintura-cadera (WHR)': 'https://www.youtube.com/watch?v=uUBRq0SugEk', // Cómo medir WHR
  '1RM y cargas máximas': 'https://www.youtube.com/watch?v=NIatFT-NDGA', // Cómo calcular 1RM
  'Frecuencia cardíaca en reposo': 'https://www.youtube.com/watch?v=UGoIC4j2ttg', // Cómo medir FCR
  'Calidad del sueño': 'https://www.youtube.com/watch?v=q-Cl34yuODA&t=40s' // Mejores hábitos de sueño
};

// Función para extraer el ID del video de YouTube
const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const UserProgress: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [metricInput, setMetricInput] = useState<MetricInput>({});
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<{
    altura?: number;
    edad?: number;
    genero?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (user) {
      fetchSurveyData();
      loadProgressData();
    }
  }, [user]);

  useEffect(() => {
    if (surveyData?.perfil_usuario?.columnas) {
      const { altura, edad, genero } = surveyData.perfil_usuario.columnas;
      setUserData({
        altura: altura ? parseFloat(altura) : undefined,
        edad: edad ? parseInt(edad) : undefined,
        genero: genero || undefined
      });
    }
  }, [surveyData]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const response = await axios.get('http://localhost:8000/api/seguimiento-metrica', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          tipo_metrica: selectedMetric,
          fecha_inicio: startDate.toISOString().split('T')[0],
          fecha_fin: endDate.toISOString().split('T')[0]
        }
      });

      if (response.data) {
        const formattedData = response.data.map((item: any) => {
          // Para medidas corporales, calcular el promedio de las medidas no cero
          let valor = item.valor_principal;
          if (item.tipo_metrica === 'Medidas corporales' && item.detalles) {
            const medidasNoCero = Object.values(item.detalles)
              .filter((val: any) => val !== 0)
              .map((val: any) => Number(val)) as number[];
            if (medidasNoCero.length > 0) {
              valor = medidasNoCero.reduce((sum: number, val: number) => sum + val, 0) / medidasNoCero.length;
            }
          }

          return {
            id: item.id,
            fecha: new Date(item.fecha),
            valor: valor,
            categoria: item.categoria,
            detalles: item.detalles
          };
        });
        setProgressData(formattedData.sort((a: ProgressData, b: ProgressData) => 
          b.fecha.getTime() - a.fecha.getTime()
        ));
      }
    } catch (error: any) {
      console.error('Error al cargar datos de progreso:', error);
      if (error.response?.status !== 404 && error.response?.status !== 422) {
        toast.error('Error al cargar el historial de registros');
      }
    } finally {
      setLoading(false);
    }
  };

  // Actualizar loadProgressData cuando cambie la métrica seleccionada
  useEffect(() => {
    if (selectedMetric) {
      loadProgressData();
    }
  }, [selectedMetric]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMetric) return;

    try {
      setIsLoading(true);
      let newMetrica: any = {
        tipo_metrica: selectedMetric,
        fecha: new Date().toISOString().split('T')[0],
        valor_principal: 0,
        categoria: '',
        detalles: {}
      };

      // Procesar según el tipo de métrica
      switch (selectedMetric) {
        case 'Peso corporal':
          if (!formData.peso) {
            throw new Error('El peso es requerido');
          }
          newMetrica.valor_principal = Number(formData.peso);
          newMetrica.detalles = { unidad: 'kg' };
          break;

        case 'Medidas corporales':
          const medidas = {
            brazo: Number(formData.brazo) || 0,
            pecho: Number(formData.pecho) || 0,
            cintura: Number(formData.cintura) || 0,
            cadera: Number(formData.cadera) || 0,
            muslo: Number(formData.muslo) || 0,
            pantorrilla: Number(formData.pantorrilla) || 0
          };
          newMetrica.detalles = medidas;
          
          // Calcular el promedio solo de las medidas que no son cero
          const medidasNoCero = Object.entries(medidas)
            .filter(([_, value]) => value !== 0)
            .map(([_, value]) => Number(value));
          
          if (medidasNoCero.length > 0) {
            const suma = medidasNoCero.reduce((sum: number, val: number) => sum + val, 0);
            newMetrica.valor_principal = suma / medidasNoCero.length;
          } else {
            newMetrica.valor_principal = 0;
          }
          break;

        case 'Tasa metabólica basal (TMB)':
          if (!formData.peso || !userData.altura || !userData.edad || !userData.genero) {
            throw new Error('Faltan datos necesarios para calcular la TMB');
          }

          const tmb = {
              formula: 'Mifflin-St Jeor',
            peso: Number(formData.peso),
            altura: Number(userData.altura),
            edad: Number(userData.edad),
              genero: userData.genero
            };
          newMetrica.detalles = tmb;
          
          if (tmb.genero === 'masculino') {
            newMetrica.valor_principal = (10 * tmb.peso) + (6.25 * tmb.altura) - (5 * tmb.edad) + 5;
          } else {
            newMetrica.valor_principal = (10 * tmb.peso) + (6.25 * tmb.altura) - (5 * tmb.edad) - 161;
          }
          break;

        case 'IMC (Índice de Masa Corporal)':
          if (!formData.peso || !userData.altura) {
            throw new Error('Se requieren peso y altura para calcular el IMC');
          }
          const imc = {
            peso: Number(formData.peso),
            altura: Number(userData.altura) / 100 // Convertir a metros
          };
          newMetrica.detalles = imc;
          newMetrica.valor_principal = imc.peso / (imc.altura * imc.altura);
          break;

        case 'Relación cintura-cadera (WHR)':
          if (!formData.cintura || !formData.cadera) {
            throw new Error('Se requieren medidas de cintura y cadera');
          }
          const whr = {
            cintura: Number(formData.cintura),
            cadera: Number(formData.cadera)
          };
          newMetrica.detalles = whr;
          newMetrica.valor_principal = whr.cintura / whr.cadera;
          break;

        case '1RM y cargas máximas':
          if (!formData.ejercicio || !formData.carga) {
            throw new Error('Se requiere ejercicio y carga');
          }
          const oneRM = {
            ejercicio: formData.ejercicio,
            repeticiones: Number(formData.repeticiones) || 1,
            notas: formData.notas || ''
          };
          newMetrica.detalles = oneRM;
          newMetrica.valor_principal = Number(formData.carga);
          break;

        case 'Frecuencia cardíaca en reposo':
          if (!formData.mediciones) {
            throw new Error('Se requieren las mediciones de frecuencia cardíaca');
          }
          const mediciones = formData.mediciones.split(',')
            .map((m: string) => Number(m.trim()))
            .filter((m: number) => !isNaN(m));
          
          if (mediciones.length === 0) {
            throw new Error('Las mediciones deben ser números válidos');
          }
          
          newMetrica.detalles = { mediciones };
          newMetrica.valor_principal = mediciones.reduce((a: number, b: number) => a + b, 0) / mediciones.length;
          break;

        case 'Calidad del sueño':
          if (!formData.horaAcostarse || !formData.horaLevantarse || !formData.calidad) {
            throw new Error('Se requieren hora de acostarse, levantarse y calidad del sueño');
          }
          const sueno = {
            horaAcostarse: formData.horaAcostarse,
            horaLevantarse: formData.horaLevantarse,
            latencia: Number(formData.latencia) || 0,
            despertares: Number(formData.despertares) || 0,
            calidad: Number(formData.calidad)
          };
          newMetrica.detalles = sueno;
          newMetrica.valor_principal = sueno.calidad;
          break;
      }

      const response = await axios.post('http://localhost:8000/api/seguimiento-metrica', newMetrica, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.data) {
        setSuccess('Medición registrada correctamente');
        setFormData({});
        const updatedData = [...progressData];
        const newRecord = {
          id: response.data.id,
          fecha: new Date(response.data.fecha),
          valor: response.data.valor_principal,
          categoria: response.data.categoria,
          detalles: response.data.detalles
        };
        updatedData.unshift(newRecord);
        setProgressData(updatedData);
      }
    } catch (err: any) {
      console.error('Error al registrar la medición:', err.response?.data || err);
      setError(err.response?.data?.detail || err.message || 'Error al registrar la medición');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Obtener el registro a eliminar
      const recordToDelete = progressData.find(data => data.id === id);
      if (!recordToDelete) {
        toast.error('Registro no encontrado');
        return;
      }

      await axios.post('http://localhost:8000/api/seguimiento-metrica/delete', {
        id: id,
        tipo_metrica: selectedMetric,
        fecha: recordToDelete.fecha.toISOString().split('T')[0]
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Recargar los datos después de eliminar
      await loadProgressData();
      toast.success('Registro eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar registro:', error);
      toast.error('Error al eliminar el registro');
    }
  };

  const renderMetricInput = () => {
    const renderRecommendations = () => {
      switch (selectedMetric) {
        case 'Peso corporal':
          return (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  name="peso"
                  value={formData.peso || ''}
                  onChange={(e) => handleFormChange('peso', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="Peso (kg)"
                  min="30"
                  max="300"
                  step="0.1"
                />
              </div>
            </div>
          );

        case 'Medidas corporales':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Brazo (cm)</label>
                  <input
                    type="number"
                    name="brazo"
                    value={formData.brazo || ''}
                    onChange={(e) => handleFormChange('brazo', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pecho (cm)</label>
                  <input
                    type="number"
                    name="pecho"
                    value={formData.pecho || ''}
                    onChange={(e) => handleFormChange('pecho', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cintura (cm)</label>
                  <input
                    type="number"
                    name="cintura"
                    value={formData.cintura || ''}
                    onChange={(e) => handleFormChange('cintura', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cadera (cm)</label>
                  <input
                    type="number"
                    name="cadera"
                    value={formData.cadera || ''}
                    onChange={(e) => handleFormChange('cadera', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Muslo (cm)</label>
                  <input
                    type="number"
                    name="muslo"
                    value={formData.muslo || ''}
                    onChange={(e) => handleFormChange('muslo', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pantorrilla (cm)</label>
                  <input
                    type="number"
                    name="pantorrilla"
                    value={formData.pantorrilla || ''}
                    onChange={(e) => handleFormChange('pantorrilla', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          );

        case 'Tasa metabólica basal (TMB)':
          return (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Datos actuales:
                  <br />
                  Altura: {userData.altura || 'No disponible'} cm
                  <br />
                  Edad: {userData.edad || 'No disponible'} años
                  <br />
                  Género: {userData.genero || 'No disponible'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  name="peso"
                  value={formData.peso || ''}
                  onChange={(e) => handleFormChange('peso', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="Peso (kg)"
                  min="30"
                  max="300"
                  step="0.1"
                  required
                />
              </div>
              {(!userData.altura || !userData.edad || !userData.genero) && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Para calcular la TMB necesitas completar tu perfil con altura, edad y género.
                </Alert>
              )}
            </div>
          );

        case 'IMC (Índice de Masa Corporal)':
          return (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Altura actual: {userData.altura} cm
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  name="peso"
                  value={formData.peso || ''}
                  onChange={(e) => handleFormChange('peso', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="Peso (kg)"
                  min="30"
                  max="300"
                  step="0.1"
                />
              </div>
            </div>
          );

        case 'Relación cintura-cadera (WHR)':
          return (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Instrucciones de medición:</h3>
                <div className="text-sm text-blue-700 space-y-2">
                  <p><strong>Cintura:</strong> De pie, pies separados al ancho de las caderas. Medir justo por encima de la cresta iliaca.</p>
                  <p><strong>Cadera:</strong> De pie, peso distribuido equitativamente. Medir en la parte más ancha de los glúteos.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="cintura"
                  value={formData.cintura || ''}
                  onChange={(e) => handleFormChange('cintura', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="Cintura (cm)"
                  min="50"
                  max="200"
                  step="0.1"
                />
                <input
                  type="number"
                  name="cadera"
                  value={formData.cadera || ''}
                  onChange={(e) => handleFormChange('cadera', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="Cadera (cm)"
                  min="50"
                  max="200"
                  step="0.1"
                />
              </div>
            </div>
          );

        case '1RM y cargas máximas':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ejercicio</label>
                  <select
                    name="ejercicio"
                    value={formData.ejercicio || ''}
                    onChange={(e) => {
                      if (e.target.value === 'Otro') {
                        setFormData(prev => ({ ...prev, ejercicio: '' }));
                      } else {
                        setFormData(prev => ({ ...prev, ejercicio: e.target.value }));
                      }
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                    <option value="">Selecciona un ejercicio</option>
                    {EJERCICIOS_COMUNES.map((ejercicio) => (
                      <option key={ejercicio} value={ejercicio}>
                        {ejercicio}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Carga máxima (kg)</label>
                  <input
                    type="number"
                    name="carga"
                    value={formData.carga || ''}
                    onChange={(e) => handleFormChange('carga', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    placeholder="Carga máxima"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Repeticiones</label>
                  <input
                    type="number"
                    name="repeticiones"
                    value={formData.repeticiones || ''}
                    onChange={(e) => handleFormChange('repeticiones', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    placeholder="Número de repeticiones"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Notas (opcional)</label>
                  <textarea
                    name="notas"
                    value={formData.notas || ''}
                    onChange={(e) => handleFormChange('notas', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    placeholder="Agrega notas sobre el ejercicio"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          );

        case 'Frecuencia cardíaca en reposo':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((num) => (
                  <input
                    key={num}
                    type="number"
                    name={`mediciones${num}`}
                    value={formData.mediciones?.[num - 1] || ''}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value);
                      const newArray = [...(formData.mediciones || [])];
                      newArray[num - 1] = newValue;
                      setFormData(prev => ({
                        ...prev,
                        mediciones: newArray
                      }));
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    placeholder={`Medición ${num}`}
                    min="40"
                    max="200"
                  />
                ))}
              </div>
            </div>
          );

        case 'Calidad del sueño':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <TextField
                    type="time"
                    name="horaAcostarse"
                    value={formData.horaAcostarse || ''}
                    onChange={(e) => handleFormChange('horaAcostarse', e.target.value)}
                    label="Hora de acostarse"
                    fullWidth
                    required
                  />
                </div>
                <div>
                  <TextField
                    type="time"
                    name="horaLevantarse"
                    value={formData.horaLevantarse || ''}
                    onChange={(e) => handleFormChange('horaLevantarse', e.target.value)}
                    label="Hora de levantarse"
                    fullWidth
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Latencia (minutos)</label>
                  <input
                    type="number"
                    name="latencia"
                    value={formData.latencia || ''}
                    onChange={(e) => handleFormChange('latencia', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Número de despertares</label>
                  <input
                    type="number"
                    name="despertares"
                    value={formData.despertares || ''}
                    onChange={(e) => handleFormChange('despertares', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Calidad del sueño</label>
                <select
                  name="calidad"
                  value={formData.calidad || ''}
                  onChange={(e) => handleFormChange('calidad', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                >
                  <option value="">Selecciona la calidad</option>
                  <option value="1">1 - Muy malo</option>
                  <option value="2">2 - Malo</option>
                  <option value="3">3 - Regular</option>
                  <option value="4">4 - Bueno</option>
                  <option value="5">5 - Muy bueno</option>
                </select>
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    const renderOptimalValues = () => {
      switch (selectedMetric) {
        case 'Peso corporal':
          return (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Valores de Referencia</h3>
              <div className="space-y-3 text-green-700">
                <p><strong>Peso Saludable:</strong> Se considera un peso saludable cuando el IMC está entre 18.5 y 24.9.</p>
                <p><strong>Pérdida de Peso Segura:</strong> 0.5-1 kg por semana es una pérdida de peso saludable y sostenible.</p>
                <p><strong>Ganancia de Peso:</strong> Para ganancia muscular, 0.25-0.5 kg por semana es óptimo.</p>
                <p className="mt-3 text-sm italic">Recuerda: El peso ideal varía según tu composición corporal, altura y objetivos específicos.</p>
              </div>
            </div>
          );

        case 'Medidas corporales':
          return (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Valores de Referencia</h3>
              <div className="space-y-3 text-green-700">
                <p><strong>Proporciones ideales:</strong></p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Hombres:</strong></li>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Pecho: 1.6 veces la cintura</li>
                    <li>Brazo: 0.36 veces el pecho</li>
                    <li>Muslo: 0.53 veces el pecho</li>
                    <li>Pantorrilla: 0.34 veces el pecho</li>
                  </ul>
                  <li><strong>Mujeres:</strong></li>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Pecho: 1.4 veces la cintura</li>
                    <li>Brazo: 0.32 veces el pecho</li>
                    <li>Muslo: 0.5 veces el pecho</li>
                    <li>Pantorrilla: 0.32 veces el pecho</li>
                  </ul>
                </ul>
                <p className="mt-3 text-sm italic">Estas proporciones son aproximadas y pueden variar según tu tipo de cuerpo y objetivos.</p>
              </div>
            </div>
          );

        case 'Tasa metabólica basal (TMB)':
          return (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Valores de Referencia</h3>
              <div className="space-y-3 text-green-700">
                <p><strong>Hombres:</strong> 1600-2000 kcal/día (promedio)</p>
                <p><strong>Mujeres:</strong> 1400-1800 kcal/día (promedio)</p>
                <p><strong>Factores que Aumentan la TMB:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Mayor masa muscular</li>
                  <li>Actividad física regular</li>
                  <li>Dieta rica en proteínas</li>
                </ul>
                <p className="mt-3 text-sm italic">Nota: Estos valores son aproximados y pueden variar según tu composición corporal y nivel de actividad.</p>
              </div>
            </div>
          );

        case 'IMC (Índice de Masa Corporal)':
          return (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Valores de Referencia</h3>
              <div className="space-y-3 text-green-700">
                <p><strong>Rangos de IMC:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Bajo peso: {'<'} 18.5</li>
                  <li>Normal: 18.5 - 26.9</li>
                  <li>Sobrepeso: 27 - 31.9</li>
                  <li>Obesidad I: 32 - 36.9</li>
                  <li>Obesidad II: 37 - 41.9</li>
                  <li>Obesidad III: {'≥'} 42</li>
                </ul>
                <p className="mt-3"><strong>IMC Óptimo:</strong> 18.5 - 26.9</p>
                <p className="text-sm italic">Nota: El IMC es una herramienta de screening y no considera la composición corporal ni otros factores de salud individuales.</p>
              </div>
            </div>
          );

        case 'Relación cintura-cadera (WHR)':
          return (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Valores de Referencia</h3>
              <div className="space-y-3 text-green-700">
                <p><strong>Hombres:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Bajo riesgo: {'<'} 0.9</li>
                  <li>Riesgo moderado: 0.9 - 1.0</li>
                  <li>Alto riesgo: {'>'} 1.0</li>
                </ul>
                <p><strong>Mujeres:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Bajo riesgo: {'<'} 0.8</li>
                  <li>Riesgo moderado: 0.8 - 0.85</li>
                  <li>Alto riesgo: {'>'} 0.85</li>
                </ul>
                <p className="mt-3 text-sm italic">Un WHR más bajo indica una distribución de grasa más saludable.</p>
              </div>
            </div>
          );

        case '1RM y cargas máximas':
          return (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Valores de Referencia</h3>
              <div className="space-y-3 text-green-700">
                <p><strong>Progresión Recomendada:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Principiante: 5-10% de incremento por mes</li>
                  <li>Intermedio: 2-5% de incremento por mes</li>
                  <li>Avanzado: 1-2% de incremento por mes</li>
                </ul>
                <p><strong>Frecuencia de Prueba:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Principiante: Cada 2-3 meses</li>
                  <li>Intermedio: Cada 3-4 meses</li>
                  <li>Avanzado: Cada 4-6 meses</li>
                </ul>
                <p className="mt-3 text-sm italic">La progresión debe ser gradual y segura para evitar lesiones.</p>
              </div>
            </div>
          );

        case 'Frecuencia cardíaca en reposo':
          return (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Valores de Referencia</h3>
              <div className="space-y-3 text-green-700">
                <p><strong>Rangos Normales:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Atletas: 40-60 lpm</li>
                  <li>Adultos activos: 60-80 lpm</li>
                  <li>Adultos promedio: 60-100 lpm</li>
                </ul>
                <p><strong>Indicadores de Mejora:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Disminución gradual con el entrenamiento</li>
                  <li>Mayor variabilidad entre latidos</li>
                  <li>Recuperación más rápida post-ejercicio</li>
                </ul>
                <p className="mt-3 text-sm italic">Una frecuencia cardíaca en reposo más baja generalmente indica mejor condición cardiovascular.</p>
              </div>
            </div>
          );

        case 'Calidad del sueño':
          return (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Valores de Referencia</h3>
              <div className="space-y-3 text-green-700">
                <p><strong>Duración Óptima:</strong> 7-9 horas por noche</p>
                <p><strong>Eficiencia del Sueño:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Excelente: {'>'} 90%</li>
                  <li>Buena: 85-90%</li>
                  <li>Aceptable: 80-85%</li>
                  <li>Necesita mejorar: {'<'} 80%</li>
                </ul>
                <p><strong>Latencia del Sueño:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Óptima: {'<'} 15 minutos</li>
                  <li>Aceptable: 15-30 minutos</li>
                  <li>Necesita mejorar: {'>'} 30 minutos</li>
                </ul>
                <p><strong>Despertares:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Óptimo: 0-1 por noche</li>
                  <li>Aceptable: 2-3 por noche</li>
                  <li>Necesita mejorar: {'>'} 3 por noche</li>
                </ul>
                <p className="mt-3 text-sm italic">La calidad del sueño es crucial para la recuperación y el rendimiento.</p>
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {renderRecommendations()}
        </div>
        <div className="space-y-6">
          {renderOptimalValues()}
        </div>
      </div>
    );
  };

  const fetchSurveyData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/survey-data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSurveyData(response.data);
      if (response.data?.perfil_usuario?.columnas?.medicion_progreso) {
        setSelectedMetric(response.data.perfil_usuario.columnas.medicion_progreso);
      }
    } catch (error) {
      console.error('Error al obtener datos de la encuesta:', error);
      toast.error('Error al cargar los datos de progreso');
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Mejorar la función formatDetalles para todas las métricas
  const formatDetalles = (detalles: any, tipoMetrica: string) => {
    if (!detalles) return '';
    
    switch (tipoMetrica) {
      case 'Peso corporal':
        return `${detalles.unidad}`;
      
      case 'Medidas corporales':
        const medidasNoCero = Object.entries(detalles)
          .filter(([_, value]) => value !== 0);
        return medidasNoCero
          .map(([key, value]) => `${key}: ${value} cm`)
          .join(', ');
      
      case 'Tasa metabólica basal (TMB)':
        if (!detalles.formula || !detalles.genero) return 'Datos incompletos';
        return `${detalles.formula} - ${detalles.genero} (Peso: ${detalles.peso} kg, Altura: ${detalles.altura} cm, Edad: ${detalles.edad} años)`;
      
      case 'IMC (Índice de Masa Corporal)':
        return `Peso: ${detalles.peso} kg, Altura: ${detalles.altura} m`;
      
      case 'Relación cintura-cadera (WHR)':
        return `Cintura: ${detalles.cintura} cm, Cadera: ${detalles.cadera} cm`;
      
      case '1RM y cargas máximas':
        return `${detalles.ejercicio}${detalles.repeticiones ? ` - ${detalles.repeticiones} rep` : ''}${detalles.notas ? ` (${detalles.notas})` : ''}`;
      
      case 'Frecuencia cardíaca en reposo':
        if (!detalles.mediciones?.length) return 'Sin mediciones';
        const promedio = detalles.mediciones.reduce((a: number, b: number) => a + b, 0) / detalles.mediciones.length;
        return `Promedio: ${promedio.toFixed(1)} lpm (${detalles.mediciones.join(', ')} lpm)`;
      
      case 'Calidad del sueño':
        return `Calidad: ${detalles.calidad}/5, Latencia: ${detalles.latencia} min, Despertares: ${detalles.despertares}`;
      
      default:
        return JSON.stringify(detalles);
    }
  };

  const renderYouTubeVideo = () => {
    return (
      <Box sx={{ 
        position: 'relative', 
        width: '100%',  // Asegura que ocupe todo el ancho disponible
        height: 0, 
        paddingBottom: '56.25%', // Mantiene la relación 16:9 para el video
        '& iframe': {
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', // Asegura que el iframe ocupe todo el ancho del contenedor
          height: '100%' // Asegura que el iframe tenga la altura completa del contenedor
        }
      }}>
        <YouTube
          videoId={getYouTubeVideoId(METRICAS_VIDEOS[selectedMetric as MetricType])}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 0,
              modestbranding: 1,
              rel: 0
            }
          }}
        />
      </Box>
    );
  };

  if (!user) {
    return (
      <Container>
        <Typography variant="h5" gutterBottom>
          Por favor, inicia sesión para ver tu progreso
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Seguimiento de {selectedMetric || 'Métricas'}
        </Typography>

        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Nueva Medición
              </Typography>
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 2 }}>
                  {renderMetricInput()}
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  Registrar Medición
                </Button>
              </form>
            </Paper>
          </Box>

          {selectedMetric && METRICAS_VIDEOS[selectedMetric as MetricType] && (
            <Box>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Video Tutorial
                </Typography>
                {renderYouTubeVideo()}
              </Paper>
            </Box>
          )}

          <Box>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Historial de Mediciones
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Categoría</TableCell>
                      <TableCell>Detalles</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {progressData.map((data) => (
                      <TableRow key={data.id}>
                        <TableCell>
                          {data.fecha.toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          {selectedMetric === 'Medidas corporales' 
                            ? `Promedio: ${typeof data.valor === 'number' ? data.valor.toFixed(1) : data.valor} cm`
                            : typeof data.valor === 'number' 
                              ? data.valor.toFixed(2)
                              : data.valor}
                        </TableCell>
                        <TableCell>{data.categoria || '-'}</TableCell>
                        <TableCell>
                          {formatDetalles(data.detalles, selectedMetric)}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleDelete(data.id)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default UserProgress; 