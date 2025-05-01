import React from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { FoodPreferencesData } from '../../validationSchemas';
import ContinueButton from '../ContinueButton';

type DietaType = FoodPreferencesData['tipoDieta'][number];
type AlergiaType = FoodPreferencesData['alergias'][number];
type AlimentoFavoritoType = FoodPreferencesData['alimentosFavoritos'][number];

const FoodPreferences: React.FC = () => {
  const { surveyData, updateSurveyData, nextStep } = useSurvey();
  const [showOtherFood, setShowOtherFood] = React.useState(false);

  const handleMultiSelect = (
    name: keyof Pick<FoodPreferencesData, 'tipoDieta' | 'alergias' | 'alimentosFavoritos'>,
    value: DietaType | AlergiaType | AlimentoFavoritoType
  ) => {
    const currentValues = surveyData.foodPreferences[name] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    updateSurveyData({
      foodPreferences: {
        ...surveyData.foodPreferences,
        [name]: newValues
      }
    });

    // Mostrar/ocultar campo de texto para otros alimentos favoritos
    if (name === 'alimentosFavoritos') {
      setShowOtherFood(newValues.includes('Otros'));
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateSurveyData({
      foodPreferences: {
        ...surveyData.foodPreferences,
        [name]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Qué tipo de dieta sigues? (Selección múltiple)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Omnívora',
            'Vegetariana',
            'Vegana',
            'Pescetariana',
            'Paleo',
            'Cetogénica',
            'Sin gluten',
            'Sin lactosa'
          ].map(dieta => (
            <label key={dieta} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={surveyData.foodPreferences.tipoDieta.includes(dieta as DietaType)}
                onChange={() => handleMultiSelect('tipoDieta', dieta as DietaType)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{dieta}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Tienes alguna alergia alimentaria? (Selección múltiple)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Ninguna',
            'Frutos secos',
            'Lácteos',
            'Mariscos',
            'Huevos',
            'Gluten',
            'Soja',
            'Otro'
          ].map(alergia => (
            <label key={alergia} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={surveyData.foodPreferences.alergias.includes(alergia as AlergiaType)}
                onChange={() => handleMultiSelect('alergias', alergia as AlergiaType)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{alergia}</span>
            </label>
          ))}
        </div>
        {surveyData.foodPreferences.alergias.includes('Otro' as AlergiaType) && (
          <textarea
            name="otrosAlergias"
            value={surveyData.foodPreferences.otrosAlergias}
            onChange={handleTextChange}
            placeholder="Especifica otras alergias"
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={2}
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Cuáles son tus alimentos favoritos? (Selección múltiple)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Carnes',
            'Pollo',
            'Pescados',
            'Verduras',
            'Frutas',
            'Pastas',
            'Arroz',
            'Legumbres',
            'Lácteos',
            'Snacks saludables',
            'Otros'
          ].map(alimento => (
            <label key={alimento} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={surveyData.foodPreferences.alimentosFavoritos.includes(alimento as AlimentoFavoritoType)}
                onChange={() => handleMultiSelect('alimentosFavoritos', alimento as AlimentoFavoritoType)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{alimento}</span>
            </label>
          ))}
        </div>
        {showOtherFood && (
          <textarea
            name="otrosAlimentosFavoritos"
            value={surveyData.foodPreferences.otrosAlimentosFavoritos}
            onChange={handleTextChange}
            placeholder="Especifica otros alimentos favoritos"
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={2}
          />
        )}
      </div>

      <div>
        <label htmlFor="alimentosEvitar" className="block text-sm font-medium text-gray-700">
          ¿Qué alimentos prefieres evitar?
        </label>
        <textarea
          id="alimentosEvitar"
          name="alimentosEvitar"
          value={surveyData.foodPreferences.alimentosEvitar}
          onChange={handleTextChange}
          placeholder="Escribe los alimentos que prefieres evitar"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <ContinueButton
        message="¡Excelente! Conocer tus preferencias nos permitirá crear un plan que realmente disfrutes."
        onContinue={nextStep}
      />
    </div>
  );
};

export default FoodPreferences;
