export interface SeguimientoMetrica {
    id: number;
    id_usuario: number;
    tipo_metrica: string;
    fecha: string;
    valor_principal: number;
    categoria?: string;
    detalles?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface SeguimientoMetricaCreate {
    tipo_metrica: string;
    fecha: string;
    valor_principal: number;
    categoria?: string;
    detalles?: Record<string, any>;
}

export interface MedidasCorporales {
    brazo?: number;
    pecho?: number;
    cintura?: number;
    cadera?: number;
    muslo?: number;
    pantorrilla?: number;
}

export interface TMB {
    formula: string;
    peso: number;
    altura: number;
    edad: number;
    genero: 'masculino' | 'femenino';
}

export interface IMC {
    peso: number;
    altura: number;
}

export interface WHR {
    cintura: number;
    cadera: number;
}

export interface OneRM {
    ejercicio: string;
    repeticiones: number;
    notas?: string;
}

export interface FrecuenciaCardiaca {
    mediciones: number[];
}

export interface CalidadSueno {
    horaAcostarse: string;
    horaLevantarse: string;
    latencia: number;
    despertares: number;
    calidad: number;
} 