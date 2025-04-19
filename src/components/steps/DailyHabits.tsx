import type React from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { FiCheck } from 'react-icons/fi';

const DailyHabits: React.FC = () => {
  const { surveyData, updateSurveyData } = useSurvey();

  // Manejar la selección única
  const handleSingleSelect = (name: string, value: string) => {
    updateSurveyData({ [name]: value });
  };

  // Verificar si una opción está seleccionada
  const isSelected = (name: string, value: string) => {
    const values = surveyData[name as keyof typeof surveyData];
    return values === value;
  };

  return (
    <div className="survey-step">
      <div className="survey-card">
        <h2 className="survey-title">Hábitos Diarios</h2>
        <p className="survey-subtitle">
          Tus hábitos diarios tienen un gran impacto en tu salud y bienestar general.
          Esta información nos ayudará a personalizar aún más tus recomendaciones.
        </p>

        <div className="mb-6">
          <img
            src="/images/personal/daily-habits.jpg"
            alt="Hábitos Diarios"
            className="w-full max-h-48 object-contain rounded-lg mb-4"
          />
        </div>

        {/* Horas de sueño */}
        <div className="mb-8">
          <h3 className="survey-question">¿Cuántas horas sueles dormir por noche?</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            {[
              'Menos de 6 horas',
              '6-7 horas',
              '7-8 horas',
              '8-9 horas',
              'Más de 9 horas'
            ].map((hours) => (
              <div
                key={`sleep-${hours}`}
                className={`survey-visual-option ${
                  isSelected('sleepHours', hours.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleSingleSelect('sleepHours', hours.toLowerCase())}
              >
                {isSelected('sleepHours', hours.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calidad del sueño */}
        <div className="mb-8">
          <h3 className="survey-question">¿Cómo calificarías la calidad de tu sueño?</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            {[
              'Excelente',
              'Buena',
              'Regular',
              'Mala',
              'Muy mala'
            ].map((quality) => (
              <div
                key={`sleep-quality-${quality}`}
                className={`survey-visual-option ${
                  isSelected('sleepQuality', quality.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleSingleSelect('sleepQuality', quality.toLowerCase())}
              >
                {isSelected('sleepQuality', quality.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{quality}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nivel de estrés */}
        <div className="mb-8">
          <h3 className="survey-question">¿Cómo describirías tu nivel habitual de estrés?</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            {[
              'Muy bajo',
              'Bajo',
              'Moderado',
              'Alto',
              'Muy alto'
            ].map((stress) => (
              <div
                key={`stress-${stress}`}
                className={`survey-visual-option ${
                  isSelected('stressLevel', stress.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleSingleSelect('stressLevel', stress.toLowerCase())}
              >
                {isSelected('stressLevel', stress.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{stress}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ingesta de agua */}
        <div className="mb-8">
          <h3 className="survey-question">¿Cuánta agua bebes diariamente?</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {[
              'Menos de 1 litro',
              '1-1.5 litros',
              '1.5-2 litros',
              '2-3 litros',
              'Más de 3 litros'
            ].map((water) => (
              <div
                key={`water-${water}`}
                className={`survey-visual-option ${
                  isSelected('waterIntake', water.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleSingleSelect('waterIntake', water.toLowerCase())}
              >
                {isSelected('waterIntake', water.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{water}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Frecuencia de comidas */}
        <div className="mb-8">
          <h3 className="survey-question">¿Cuántas comidas principales haces al día?</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            {[
              '1-2 comidas',
              '3 comidas',
              '4-5 comidas',
              '6 o más comidas'
            ].map((frequency) => (
              <div
                key={`meal-${frequency}`}
                className={`survey-visual-option ${
                  isSelected('mealFrequency', frequency.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleSingleSelect('mealFrequency', frequency.toLowerCase())}
              >
                {isSelected('mealFrequency', frequency.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{frequency}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hábitos de snacking */}
        <div className="mb-8">
          <h3 className="survey-question">¿Con qué frecuencia consumes snacks entre comidas?</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {[
              'Nunca o rara vez',
              'Ocasionalmente',
              'Regularmente (1-2 veces al día)',
              'Frecuentemente (3 o más veces al día)'
            ].map((habit) => (
              <div
                key={`snack-${habit}`}
                className={`survey-visual-option ${
                  isSelected('snackingHabits', habit.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleSingleSelect('snackingHabits', habit.toLowerCase())}
              >
                {isSelected('snackingHabits', habit.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{habit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tiempo frente a pantallas */}
        <div className="mb-8">
          <h3 className="survey-question">¿Cuánto tiempo pasas frente a pantallas diariamente?</h3>
          <p className="text-sm text-muted-foreground mb-2">Incluyendo teléfono, computadora, televisión, etc.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {[
              'Menos de 2 horas',
              '2-4 horas',
              '4-6 horas',
              '6-8 horas',
              'Más de 8 horas'
            ].map((time) => (
              <div
                key={`screen-${time}`}
                className={`survey-visual-option ${
                  isSelected('screenTime', time.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleSingleSelect('screenTime', time.toLowerCase())}
              >
                {isSelected('screenTime', time.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tipo de trabajo */}
        <div>
          <h3 className="survey-question">¿Qué tipo de trabajo realizas la mayor parte del tiempo?</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {[
              'Sedentario (sentado la mayor parte del tiempo)',
              'Ligeramente activo (mayormente de pie)',
              'Moderadamente activo (caminando frecuentemente)',
              'Muy activo (trabajo físico constante)'
            ].map((work) => (
              <div
                key={`work-${work}`}
                className={`survey-visual-option ${
                  isSelected('workType', work.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleSingleSelect('workType', work.toLowerCase())}
              >
                {isSelected('workType', work.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{work}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Adaptar tus recomendaciones según tu rutina laboral es clave para lograr un equilibrio sostenible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyHabits;
