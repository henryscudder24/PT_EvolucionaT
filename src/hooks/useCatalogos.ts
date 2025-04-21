import { useEffect, useState } from 'react';

interface CatalogoItem {
  id: number;
  descripcion: string;
}

interface CatalogosData {
  tipo_usuario: CatalogoItem[];
  tipo_objetivo: CatalogoItem[];
  tipo_dieta: CatalogoItem[];
  tipo_nivel_actividad: CatalogoItem[];
  estado_plan: CatalogoItem[];
  estado_meta: CatalogoItem[];
  estado_rutina: CatalogoItem[];
  restricciones: CatalogoItem[];
  dietas_sugeridas: string[];
  alergias_sugeridas: string[];
  favoritos_sugeridos: string[];
}

export const useCatalogos = () => {
  const [catalogos, setCatalogos] = useState<Partial<CatalogosData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalogos = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/catalogos/');
      if (!response.ok) throw new Error('Error al obtener los catálogos');
      const data = await response.json();
      setCatalogos(data);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogos();
  }, []);

  return {
    catalogos,
    loading,
    error,
    refetch: fetchCatalogos,
  };
};