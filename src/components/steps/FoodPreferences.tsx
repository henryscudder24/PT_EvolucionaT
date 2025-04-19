import type React from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { FiCheck } from 'react-icons/fi';

const FoodPreferences: React.FC = () => {
  const { surveyData, updateSurveyData } = useSurvey();

  // Manejar selección de opciones múltiples
  const handleMultiSelect = (name: string, value: string) => {
    const currentValues = surveyData[name as keyof typeof surveyData] as string[];

    // Si es un array (como se espera)
    if (Array.isArray(currentValues)) {
      // Verificar si el valor ya está seleccionado
      if (currentValues.includes(value)) {
        // Si está seleccionado, eliminarlo
        updateSurveyData({
          [name]: currentValues.filter(item => item !== value)
        });
      } else {
        // Si no está seleccionado, agregarlo
        updateSurveyData({
          [name]: [...currentValues, value]
        });
      }
    }
  };

  // Manejar cambio de texto
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateSurveyData({ [name]: value });
  };

  // Verificar si una opción está seleccionada
  const isSelected = (name: string, value: string) => {
    const values = surveyData[name as keyof typeof surveyData];
    return Array.isArray(values) && values.includes(value);
  };

  return (
    <div className="survey-step">
      <div className="survey-card">
        <h2 className="survey-title">Preferencias Alimentarias</h2>
        <p className="survey-subtitle">
          Dinos tus preferencias alimentarias para crear un plan nutricional que disfrutes.
        </p>

        <div className="mb-6">
          <img
            src="/images/food/food-preferences.jpg"
            alt="Preferencias Alimentarias"
            className="w-full max-h-48 object-contain rounded-lg mb-4"
          />
        </div>

        {/* Tipo de dieta */}
        <div className="mb-8">
          <h3 className="survey-question">Tipo de dieta específica</h3>
          <p className="text-sm text-muted-foreground mb-4">Selecciona todas las que apliquen</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Omnívora', 'Vegetariana', 'Vegana', 'Keto', 'Mediterránea', 'Paleo'].map((diet) => (
              <div
                key={`diet-${diet}`}
                className={`survey-visual-option ${
                  isSelected('dietType', diet.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleMultiSelect('dietType', diet.toLowerCase())}
              >
                {isSelected('dietType', diet.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{diet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Restricciones o alergias */}
        <div className="mb-8">
          <h3 className="survey-question">Restricciones o alergias alimentarias</h3>
          <p className="text-sm text-muted-foreground mb-4">Selecciona todas las que apliquen</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Gluten', 'Lácteos', 'Frutos secos', 'Mariscos', 'Soya', 'Huevo'].map((allergy) => (
              <div
                key={`allergy-${allergy}`}
                className={`survey-visual-option ${
                  isSelected('allergies', allergy.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleMultiSelect('allergies', allergy.toLowerCase())}
              >
                {isSelected('allergies', allergy.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{allergy}</span>
              </div>
            ))}

            <div
              className={`survey-visual-option ${
                isSelected('allergies', 'ninguna') ? 'survey-visual-option-selected' : ''
              }`}
              onClick={() => {
                // Si se selecciona "Ninguna", se borran todas las demás opciones
                if (!isSelected('allergies', 'ninguna')) {
                  updateSurveyData({ allergies: ['ninguna'] });
                } else {
                  updateSurveyData({ allergies: [] });
                }
              }}
            >
              {isSelected('allergies', 'ninguna') && (
                <span className="text-primary">
                  <FiCheck size={18} />
                </span>
              )}
              <span>Ninguna</span>
            </div>
          </div>
        </div>

        {/* Comidas favoritas */}
        <div className="mb-8">
          <h3 className="survey-question">Comidas favoritas</h3>
          <p className="text-sm text-muted-foreground mb-4">Selecciona todas las que apliquen</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Carnes', 'Pollo', 'Pescados', 'Verduras', 'Frutas',
              'Pastas', 'Arroz', 'Legumbres', 'Lácteos', 'Snacks saludables'
            ].map((food) => (
              <div
                key={`food-${food}`}
                className={`survey-visual-option ${
                  isSelected('favoriteFoods', food.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleMultiSelect('favoriteFoods', food.toLowerCase())}
              >
                {isSelected('favoriteFoods', food.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{food}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alimentos a evitar */}
        <div>
          <h3 className="survey-question">Alimentos a evitar</h3>
          <p className="text-sm text-muted-foreground mb-4">Menciona alimentos específicos que prefieres evitar</p>

          <textarea
            name="foodsToAvoid"
            value={surveyData.foodsToAvoid}
            onChange={handleTextChange}
            className="survey-input min-h-[100px]"
            placeholder="Ej: Comida picante, brócoli, berenjenas..."
          />
        </div>
      </div>
    </div>
  );
};

export default FoodPreferences;
