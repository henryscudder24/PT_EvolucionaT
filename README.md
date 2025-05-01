# EvolucionaT - Plataforma de Bienestar y Nutrición

EvolucionaT es una plataforma integral de bienestar y nutrición que ayuda a los usuarios a alcanzar sus objetivos de salud a través de un enfoque personalizado y basado en datos.

## 🚀 Características Principales

### Sistema de Autenticación
- Registro de usuarios con validación de datos
- Inicio de sesión seguro
- Protección de rutas privadas
- Gestión de sesiones de usuario

### Encuesta de Bienestar
Sistema de encuesta interactiva de 7 pasos que recopila información detallada sobre:
1. **Información Personal**
   - Datos básicos del usuario
   - Información de contacto
   - Preferencias de comunicación

2. **Preferencias Alimentarias**
   - Restricciones dietéticas
   - Alergias e intolerancias
   - Preferencias de comida
   - Hábitos alimenticios

3. **Objetivos y Metas**
   - Objetivos de salud
   - Metas de peso
   - Expectativas de tiempo
   - Prioridades de bienestar

4. **Nivel de Actividad Física**
   - Frecuencia de ejercicio
   - Tipos de actividades
   - Nivel de condición física
   - Preferencias de entrenamiento

5. **Historial Médico**
   - Condiciones médicas
   - Medicamentos
   - Lesiones previas
   - Historial familiar

6. **Hábitos Diarios**
   - Patrones de sueño
   - Niveles de estrés
   - Consumo de agua
   - Hábitos de tabaco y alcohol

7. **Finalización**
   - Resumen de la encuesta
   - Confirmación de datos
   - Próximos pasos

### Interfaz de Usuario
- Diseño moderno y responsivo
- Navegación intuitiva
- Barra de progreso visual
- Mensajes de retroalimentación
- Notificaciones toast para acciones importantes

### Características Técnicas
- Frontend en React con TypeScript
- Backend en Python con FastAPI
- Base de datos PostgreSQL
- Autenticación JWT
- API RESTful
- Manejo de estado con Context API
- Validación de formularios
- Diseño responsivo con Tailwind CSS

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18
- TypeScript
- React Router v6
- Tailwind CSS
- React Hot Toast
- Framer Motion
- React Hook Form
- Zod (validación)

### Backend
- Python 3.11
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT
- Pydantic
- Alembic (migraciones)

## 📦 Estructura del Proyecto

```
evolucionat/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── steps/
│   │   │   │   └── ui/
│   │   │   ├── context/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   │   └── components/
│   │   └── public/
│   └── backend/
│       ├── app/
│       │   ├── api/
│       │   │   └── routes/
│       │   │   └── core/
│       │   │   └── models/
│       │   │   └── services/
│       │   └── tests/
│       └── venv/
└── README.md
```

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/evolucionat.git
cd evolucionat
```

2. Configurar el frontend:
```bash
cd frontend
npm install
npm run dev
```

3. Configurar el backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 🔧 Variables de Entorno

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/evolucionat
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, lee `CONTRIBUTING.md` para detalles sobre nuestro código de conducta y el proceso para enviarnos pull requests.

## 📞 Contacto

Para soporte o consultas, por favor contacta a [tu-email@ejemplo.com]

