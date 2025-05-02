import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
    horaAcostarse?: string;
    horaLevantarse?: string;
    latencia?: number;
    despertares?: number;
    calidad?: number;
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
}

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

  useEffect(() => {
    if (user) {
      fetchSurveyData();
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

  useEffect(() => {
    if (startDate) {
      generateEmptyProgressData();
    }
  }, [startDate, selectedMetric]);

  const generateEmptyProgressData = () => {
    const data: ProgressData[] = [];
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      data.push({
        id: 0,
        fecha: new Date(d),
        valor: '',
      });
    }
    setProgressData(data);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetricInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setStartDate(date);
    }
  };

  const calculateTMB = (peso: number, altura: number, edad: number, genero: string): number => {
    // Fórmula de Mifflin-St Jeor
    if (genero?.toLowerCase() === 'masculino') {
      return (10 * peso) + (6.25 * altura) - (5 * edad) + 5;
    } else {
      return (10 * peso) + (6.25 * altura) - (5 * edad) - 161;
    }
  };

  const calculateIMC = (peso: number, altura: number): number => {
    return peso / Math.pow(altura / 100, 2);
  };

  const getIMCCategory = (imc: number): string => {
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Normal (saludable)';
    if (imc < 30) return 'Sobrepeso';
    if (imc < 35) return 'Obesidad grado I';
    if (imc < 40) return 'Obesidad grado II';
    return 'Obesidad grado III';
  };

  const calculateWHR = (cintura: number, cadera: number): number => {
    return cintura / cadera;
  };

  const getWHRCategory = (whr: number, genero: string): string => {
    if (genero.toLowerCase() === 'masculino') {
      if (whr < 0.9) return 'Bajo riesgo';
      if (whr < 1.0) return 'Riesgo moderado';
      return 'Alto riesgo';
    } else {
      if (whr < 0.8) return 'Bajo riesgo';
      if (whr < 0.85) return 'Riesgo moderado';
      return 'Alto riesgo';
    }
  };

  const calculateFrecuenciaCardiaca = (mediciones: number[]): number => {
    if (mediciones.length === 0) return 0;
    return mediciones.reduce((a, b) => a + b, 0) / mediciones.length;
  };

  const calculateEficienciaSueño = (
    horaAcostarse: string,
    horaLevantarse: string,
    latencia: number,
    despertares: number
  ): number => {
    const [horaAcostarseH, horaAcostarseM] = horaAcostarse.split(':').map(Number);
    const [horaLevantarseH, horaLevantarseM] = horaLevantarse.split(':').map(Number);
    
    let tiempoTotal = (horaLevantarseH - horaAcostarseH) * 60 + (horaLevantarseM - horaAcostarseM);
    if (tiempoTotal < 0) tiempoTotal += 24 * 60; // Ajuste para cuando pasa la medianoche
    
    const tiempoEfectivo = tiempoTotal - latencia - (despertares * 15); // 15 minutos por despertar
    return (tiempoEfectivo / tiempoTotal) * 100;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let valor: number | string = '';
      let categoria: string | undefined;
      let detalles: any = undefined;

      switch (selectedMetric) {
        case 'Peso corporal':
          valor = metricInput.peso || 0;
          break;

        case 'Tasa metabólica basal (TMB)':
          if (metricInput.peso && userData.altura && userData.edad && userData.genero) {
            valor = calculateTMB(metricInput.peso, userData.altura, userData.edad, userData.genero);
            detalles = {
              formula: 'Mifflin-St Jeor',
              peso: metricInput.peso,
              altura: userData.altura,
              edad: userData.edad,
              genero: userData.genero
            };
          }
          break;

        case 'IMC (Índice de Masa Corporal)':
          if (metricInput.peso && userData.altura) {
            const imc = calculateIMC(metricInput.peso, userData.altura);
            valor = imc.toFixed(2);
            categoria = getIMCCategory(imc);
            detalles = {
              peso: metricInput.peso,
              altura: userData.altura
            };
          }
          break;

        case 'Relación cintura-cadera (WHR)':
          if (metricInput.cintura && metricInput.cadera && userData.genero) {
            const whr = calculateWHR(metricInput.cintura, metricInput.cadera);
            valor = whr.toFixed(2);
            categoria = getWHRCategory(whr, userData.genero);
            detalles = {
              cintura: metricInput.cintura,
              cadera: metricInput.cadera
            };
          }
          break;

        case '1RM y cargas máximas':
          valor = metricInput.cargaMaxima || 0;
          break;

        case 'Frecuencia cardíaca en reposo':
          if (metricInput.frecuenciaCardiaca) {
            const promedio = calculateFrecuenciaCardiaca(metricInput.frecuenciaCardiaca);
            valor = promedio.toFixed(0);
            detalles = {
              mediciones: metricInput.frecuenciaCardiaca
            };
          }
          break;

        case 'Calidad del sueño':
          if (metricInput.horaAcostarse && metricInput.horaLevantarse && 
              metricInput.latencia !== undefined && metricInput.despertares !== undefined) {
            const eficiencia = calculateEficienciaSueño(
              metricInput.horaAcostarse,
              metricInput.horaLevantarse,
              metricInput.latencia,
              metricInput.despertares
            );
            valor = 'Registrado';
            categoria = `Eficiencia: ${eficiencia.toFixed(1)}%`;
            detalles = {
              horaAcostarse: metricInput.horaAcostarse,
              horaLevantarse: metricInput.horaLevantarse,
              latencia: metricInput.latencia,
              despertares: metricInput.despertares,
              calidad: metricInput.calidad,
              eficiencia: eficiencia
            };
          }
          break;
      }

      const dataToSave = {
        tipo_metrica: selectedMetric,
        fecha: new Date().toISOString().split('T')[0],
        valor_principal: typeof valor === 'string' ? parseFloat(valor) || 0 : valor,
        categoria,
        detalles
      };

      await axios.post('http://localhost:8000/api/seguimiento-metrica', dataToSave, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      await fetchProgressData();

      toast.success('Datos registrados correctamente');
      setMetricInput({});
    } catch (error) {
      console.error('Error al guardar datos:', error);
      toast.error('Error al guardar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProgressData = async () => {
    if (!user || !selectedMetric) return;
    
    try {
      const response = await axios.get(`http://localhost:8000/api/seguimiento-metrica`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          tipo_metrica: selectedMetric,
          fecha_inicio: startDate.toISOString().split('T')[0],
          fecha_fin: new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
        }
      });

      const data = response.data.map((item: any) => ({
        id: item.id,
        fecha: new Date(item.fecha),
        valor: item.valor_principal,
        categoria: item.categoria,
        detalles: item.detalles
      }));

      data.sort((a: ProgressData, b: ProgressData) => b.fecha.getTime() - a.fecha.getTime());

      setProgressData(data);
    } catch (error) {
      console.error('Error al cargar datos de seguimiento:', error);
      toast.error('Error al cargar el historial de seguimiento');
    }
  };

  useEffect(() => {
    if (user && selectedMetric) {
      fetchProgressData();
    }
  }, [user, selectedMetric, startDate]);

  const handleDelete = async (id: number, fecha: Date) => {
    try {
      await axios.post(`http://localhost:8000/api/seguimiento-metrica/delete`, {
        id: id,
        tipo_metrica: selectedMetric,
        fecha: fecha.toISOString().split('T')[0]
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      // Actualizar la tabla después de eliminar
      await fetchProgressData();
      toast.success('Registro eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      toast.error('Error al eliminar el registro');
    }
  };

  const renderMetricInput = () => {
    const renderRecommendations = () => {
      switch (selectedMetric) {
        case 'Peso corporal':
          return (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">¿Cómo medir tu peso correctamente?</h3>
              <div className="space-y-3 text-blue-700">
                <p>1. <strong>Momento ideal:</strong> A primera hora de la mañana, después de ir al baño y antes de desayunar.</p>
                <p>2. <strong>Ropa:</strong> Usa ropa ligera o mídete sin ropa.</p>
                <p>3. <strong>Báscula:</strong> Asegúrate de que esté en una superficie plana y estable.</p>
                <p>4. <strong>Postura:</strong> Párate derecho, con los pies juntos y el peso distribuido equitativamente.</p>
                <p>5. <strong>Consistencia:</strong> Usa la misma báscula y mídete siempre a la misma hora.</p>
              </div>
            </div>
          );

        case 'Tasa metabólica basal (TMB)':
          return (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">¿Qué es la Tasa Metabólica Basal?</h3>
              <div className="space-y-3 text-blue-700">
                <p>La TMB es la cantidad de energía que tu cuerpo necesita para mantener sus funciones básicas en reposo.</p>
                <p><strong>Factores que influyen:</strong></p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Edad: A mayor edad, menor TMB</li>
                  <li>Género: Los hombres suelen tener mayor TMB</li>
                  <li>Composición corporal: Mayor masa muscular = mayor TMB</li>
                  <li>Altura: Personas más altas tienen mayor TMB</li>
                </ul>
                <p className="mt-3"><strong>Recuerda:</strong> Este valor es una estimación y puede variar según tu nivel de actividad física.</p>
              </div>
            </div>
          );

        case 'IMC (Índice de Masa Corporal)':
          return (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">¿Qué es el IMC y cómo interpretarlo?</h3>
              <div className="space-y-3 text-blue-700">
                <p>El IMC es una medida que relaciona tu peso con tu altura para estimar si tienes un peso saludable.</p>
                <p><strong>Categorías de IMC:</strong></p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Bajo peso: IMC menor a 18.5</li>
                  <li>Normal: IMC entre 18.5 y 24.9</li>
                  <li>Sobrepeso: IMC entre 25 y 29.9</li>
                  <li>Obesidad Grado I: IMC entre 30 y 34.9</li>
                  <li>Obesidad Grado II: IMC entre 35 y 39.9</li>
                  <li>Obesidad Grado III: IMC mayor o igual a 40</li>
                </ul>
                <p className="mt-3"><strong>Importante:</strong> El IMC es una herramienta de screening, no un diagnóstico médico.</p>
              </div>
            </div>
          );

        case 'Relación cintura-cadera (WHR)':
          return (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">¿Cómo medir la relación cintura-cadera?</h3>
              <div className="space-y-3 text-blue-700">
                <p><strong>Medición de la cintura:</strong></p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>De pie, con los pies separados al ancho de las caderas</li>
                  <li>Localiza la parte más estrecha de tu cintura</li>
                  <li>Mide justo por encima de la cresta iliaca</li>
                  <li>Mantén la cinta métrica horizontal</li>
                </ul>
                <p><strong>Medición de la cadera:</strong></p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>De pie, con el peso distribuido equitativamente</li>
                  <li>Localiza la parte más ancha de tus glúteos</li>
                  <li>Mide alrededor de esta área</li>
                  <li>Mantén la cinta métrica horizontal</li>
                </ul>
                <p className="mt-3"><strong>Recuerda:</strong> Respira normalmente durante la medición.</p>
              </div>
            </div>
          );

        case '1RM y cargas máximas':
          return (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">¿Cómo determinar tu 1RM de forma segura?</h3>
              <div className="space-y-3 text-blue-700">
                <p><strong>Recomendaciones importantes:</strong></p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Realiza un calentamiento adecuado antes</li>
                  <li>Usa un spotter (compañero) para ejercicios con barra</li>
                  <li>Comienza con pesos que puedas manejar con seguridad</li>
                  <li>Aumenta gradualmente el peso</li>
                  <li>Descansa 3-5 minutos entre intentos</li>
                </ul>
                <p className="mt-3"><strong>Seguridad:</strong> Si no estás seguro, consulta con un profesional del ejercicio.</p>
              </div>
            </div>
          );

        case 'Frecuencia cardíaca en reposo':
          return (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">¿Cómo medir tu frecuencia cardíaca en reposo?</h3>
              <div className="space-y-3 text-blue-700">
                <p><strong>Instrucciones para una medición precisa:</strong></p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Mídete a primera hora de la mañana, antes de levantarte</li>
                  <li>Descansa 5 minutos antes de medir</li>
                  <li>Realiza 3 mediciones con 1 minuto de descanso entre cada una</li>
                  <li>Usa el promedio de las 3 mediciones</li>
                </ul>
                <p><strong>Método de medición:</strong></p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Coloca dos dedos en la arteria radial (muñeca) o carótida (cuello)</li>
                  <li>Cuenta los latidos durante 60 segundos</li>
                  <li>No presiones demasiado fuerte</li>
                </ul>
                <p className="mt-3"><strong>Valores normales:</strong> 60-100 latidos por minuto en adultos.</p>
              </div>
            </div>
          );

        case 'Calidad del sueño':
          return (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">¿Cómo mejorar tu calidad de sueño?</h3>
              <div className="space-y-3 text-blue-700">
                <p><strong>Recomendaciones para un mejor sueño:</strong></p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Mantén un horario regular de sueño</li>
                  <li>Evita la cafeína 6 horas antes de dormir</li>
                  <li>Limita la exposición a pantallas antes de dormir</li>
                  <li>Mantén tu habitación oscura, fresca y silenciosa</li>
                  <li>Evita comidas pesadas antes de dormir</li>
                </ul>
                <p><strong>Para medir la latencia:</strong> Tiempo que tardas en quedarte dormido después de acostarte.</p>
                <p><strong>Para medir despertares:</strong> Cuenta las veces que te despiertas durante la noche.</p>
                <p className="mt-3"><strong>Eficiencia del sueño:</strong> Porcentaje de tiempo que realmente duermes del tiempo total en cama.</p>
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
                  <li>Normal: 18.5 - 24.9</li>
                  <li>Sobrepeso: 25 - 29.9</li>
                  <li>Obesidad I: 30 - 34.9</li>
                  <li>Obesidad II: 35 - 39.9</li>
                  <li>Obesidad III: {'≥'} 40</li>
                </ul>
                <p className="mt-3"><strong>IMC Óptimo:</strong> 18.5 - 24.9</p>
                <p className="text-sm italic">Nota: El IMC es una herramienta de screening y no considera la composición corporal.</p>
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
          {(() => {
            switch (selectedMetric) {
              case 'Peso corporal':
                return (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        name="peso"
                        value={metricInput.peso || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        placeholder="Peso (kg)"
                        min="30"
                        max="300"
                        step="0.1"
                      />
                      <button 
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                      >
                        {isLoading ? 'Registrando...' : 'Registrar'}
                      </button>
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
                        Altura: {userData.altura} cm
                        <br />
                        Edad: {userData.edad} años
                        <br />
                        Género: {userData.genero}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        name="peso"
                        value={metricInput.peso || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        placeholder="Peso (kg)"
                        min="30"
                        max="300"
                        step="0.1"
                      />
                      <button 
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                      >
                        {isLoading ? 'Calculando...' : 'Calcular TMB'}
                      </button>
                    </div>
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
                        value={metricInput.peso || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        placeholder="Peso (kg)"
                        min="30"
                        max="300"
                        step="0.1"
                      />
                      <button 
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                      >
                        {isLoading ? 'Calculando...' : 'Calcular IMC'}
                      </button>
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
                        value={metricInput.cintura || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        placeholder="Cintura (cm)"
                        min="50"
                        max="200"
                        step="0.1"
                      />
                      <input
                        type="number"
                        name="cadera"
                        value={metricInput.cadera || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        placeholder="Cadera (cm)"
                        min="50"
                        max="200"
                        step="0.1"
                      />
                    </div>
                    <button 
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                    >
                      {isLoading ? 'Calculando...' : 'Calcular WHR'}
                    </button>
                  </div>
                );

                case '1RM y cargas máximas':
                  return (
                    <div className="space-y-4">
                      <input
                        type="number"
                        name="cargaMaxima"
                        value={metricInput.cargaMaxima || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        placeholder="Carga máxima (kg)"
                        min="0"
                        step="0.1"
                      />
                      <button 
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                      >
                        {isLoading ? 'Registrando...' : 'Registrar'}
                      </button>
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
                            name={`frecuenciaCardiaca${num}`}
                            value={metricInput.frecuenciaCardiaca?.[num - 1] || ''}
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value);
                              const newArray = [...(metricInput.frecuenciaCardiaca || [])];
                              newArray[num - 1] = newValue;
                              setMetricInput(prev => ({
                                ...prev,
                                frecuenciaCardiaca: newArray
                              }));
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            placeholder={`Medición ${num}`}
                            min="40"
                            max="200"
                          />
                        ))}
                      </div>
                      <button 
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                      >
                        {isLoading ? 'Registrando...' : 'Registrar'}
                      </button>
                    </div>
                  );

                case 'Calidad del sueño':
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Hora de acostarse</label>
                          <input
                            type="time"
                            name="horaAcostarse"
                            value={metricInput.horaAcostarse || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Hora de levantarse</label>
                          <input
                            type="time"
                            name="horaLevantarse"
                            value={metricInput.horaLevantarse || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Latencia (minutos)</label>
                          <input
                            type="number"
                            name="latencia"
                            value={metricInput.latencia || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Número de despertares</label>
                          <input
                            type="number"
                            name="despertares"
                            value={metricInput.despertares || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            min="0"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Calidad del sueño</label>
                        <select
                          name="calidad"
                          value={metricInput.calidad || ''}
                          onChange={handleInputChange}
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
                      <button 
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                      >
                        {isLoading ? 'Registrando...' : 'Registrar'}
                      </button>
                    </div>
                  );

                default:
                  return null;
              }
            })()}
        </div>
        <div className="space-y-6">
          {renderRecommendations()}
          {renderOptimalValues()}
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Por favor inicia sesión para ver tu progreso.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Monitorea tu cambio</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/survey')}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Modificar mis datos
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Mi Perfil
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          {surveyData?.perfil_usuario?.columnas?.medicion_progreso ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Métrica seleccionada: {selectedMetric}
                  </h2>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha inicial
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                {renderMetricInput()}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Registro de seguimiento</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor
                        </th>
                        {selectedMetric === 'IMC (Índice de Masa Corporal)' && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Categoría
                          </th>
                        )}
                        {selectedMetric === 'Calidad del sueño' && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Detalles
                          </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {progressData.map((data, index) => (
                        <tr key={index} className={index === 0 ? 'bg-green-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {data.fecha.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.valor}
                          </td>
                          {selectedMetric === 'IMC (Índice de Masa Corporal)' && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {data.categoria}
                            </td>
                          )}
                          {selectedMetric === 'Calidad del sueño' && data.detalles && (
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <div className="space-y-1">
                                <p>Acostarse: {data.detalles.horaAcostarse}</p>
                                <p>Levantarse: {data.detalles.horaLevantarse}</p>
                                <p>Latencia: {data.detalles.latencia} min</p>
                                <p>Despertares: {data.detalles.despertares}</p>
                                <p>Calidad: {data.detalles.calidad}/5</p>
                              </div>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => handleDelete(data.id, data.fecha)}
                              className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                              title="Eliminar registro"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <p className="text-yellow-800">
                No se han encontrado métricas de seguimiento. Por favor, completa la encuesta para establecer tus métricas de progreso.
              </p>
              <button
                onClick={() => navigate('/survey')}
                className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors"
              >
                Completar Encuesta
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProgress; 