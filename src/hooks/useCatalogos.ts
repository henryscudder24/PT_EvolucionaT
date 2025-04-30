import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export interface CatalogosData {
  nivelesActividad: Array<{ id: number; nombre: string }>;
  frecuenciasEjercicio: Array<{ id: number; nombre: string }>;
  tiposEjercicio: Array<{ id: number; nombre: string }>;
  objetivosFitness: Array<{ id: number; nombre: string }>;
  tiposDieta: Array<{ id: number; nombre: string }>;
  restriccionesAlimentarias: Array<{ id: number; nombre: string }>;
  alergias: Array<{ id: number; nombre: string }>;
  intolerancias: Array<{ id: number; nombre: string }>;
  objetivosNutricionales: Array<{ id: number; nombre: string }>;
  nivelesExperiencia: Array<{ id: number; nombre: string }>;
  tiposEntrenamiento: Array<{ id: number; nombre: string }>;
  objetivosEntrenamiento: Array<{ id: number; nombre: string }>;
  nivelesIntensidad: Array<{ id: number; nombre: string }>;
  frecuenciasEntrenamiento: Array<{ id: number; nombre: string }>;
  duracionesEntrenamiento: Array<{ id: number; nombre: string }>;
  tiposEquipamiento: Array<{ id: number; nombre: string }>;
  objetivosEspecificos: Array<{ id: number; nombre: string }>;
  nivelesCondicion: Array<{ id: number; nombre: string }>;
  tiposLesion: Array<{ id: number; nombre: string }>;
  tiposCondicion: Array<{ id: number; nombre: string }>;
  tiposObjetivo: Array<{ id: number; nombre: string }>;
  tiposPreferencia: Array<{ id: number; nombre: string }>;
  tiposRestriccion: Array<{ id: number; nombre: string }>;
  tiposAlergia: Array<{ id: number; nombre: string }>;
  tiposIntolerancia: Array<{ id: number; nombre: string }>;
  tiposObjetivoNutricional: Array<{ id: number; nombre: string }>;
  tiposNivelExperiencia: Array<{ id: number; nombre: string }>;
  tiposEntrenamientoFisico: Array<{ id: number; nombre: string }>;
  tiposObjetivoEntrenamiento: Array<{ id: number; nombre: string }>;
  tiposNivelIntensidad: Array<{ id: number; nombre: string }>;
  tiposFrecuenciaEntrenamiento: Array<{ id: number; nombre: string }>;
  tiposDuracionEntrenamiento: Array<{ id: number; nombre: string }>;
  tiposEquipamientoNecesario: Array<{ id: number; nombre: string }>;
  tiposObjetivoEspecifico: Array<{ id: number; nombre: string }>;
  tiposNivelCondicion: Array<{ id: number; nombre: string }>;
  tiposLesionPrevia: Array<{ id: number; nombre: string }>;
  tiposCondicionMedica: Array<{ id: number; nombre: string }>;
}

export const useCatalogos = () => {
  const [catalogos, setCatalogos] = useState<CatalogosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const response = await axios.get<CatalogosData>(
          `${process.env.REACT_APP_API_URL}/catalogos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCatalogos(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los catálogos');
        console.error('Error fetching catalogos:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCatalogos();
    }
  }, [token]);

  return { catalogos, loading, error };
};