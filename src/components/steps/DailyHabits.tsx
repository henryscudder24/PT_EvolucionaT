import React from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { DailyHabitsData } from '../../validationSchemas';

type HorasSuenoType = DailyHabitsData['horasSueno'];
type CalidadSuenoType = DailyHabitsData['calidadSueno'];
type NivelEstresType = DailyHabitsData['nivelEstres'];
type ConsumoAguaType = DailyHabitsData['consumoAgua'];
type ComidasPorDiaType = DailyHabitsData['comidasPorDia'];
type HabitosSnacksType = DailyHabitsData['habitosSnacks'];
type HorasPantallasType = DailyHabitsData['horasPantallas'];
type TipoTrabajoType = DailyHabitsData['tipoTrabajo'];

const DailyHabits: React.FC = () => {
  const { surveyData, updateSurveyData } = useSurvey();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateSurveyData({
      dailyHabits: {
        ...surveyData.dailyHabits,
        [name]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="horasSueno" className="block text-sm font-medium text-gray-700">
          ¿Cuántas horas duermes normalmente?
        </label>
        <select
          id="horasSueno"
          name="horasSueno"
          value={surveyData.dailyHabits.horasSueno}
          onChange={handleSelectChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Menos de 6 horas">Menos de 6 horas</option>
          <option value="6-7 horas">6-7 horas</option>
          <option value="7-8 horas">7-8 horas</option>
          <option value="Más de 8 horas">Más de 8 horas</option>
        </select>
      </div>

      <div>
        <label htmlFor="calidadSueno" className="block text-sm font-medium text-gray-700">
          ¿Cómo calificarías la calidad de tu sueño?
        </label>
        <select
          id="calidadSueno"
          name="calidadSueno"
          value={surveyData.dailyHabits.calidadSueno}
          onChange={handleSelectChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Excelente">Excelente</option>
          <option value="Buena">Buena</option>
          <option value="Regular">Regular</option>
          <option value="Mala">Mala</option>
        </select>
      </div>

      <div>
        <label htmlFor="nivelEstres" className="block text-sm font-medium text-gray-700">
          ¿Cuál es tu nivel de estrés actual?
        </label>
        <select
          id="nivelEstres"
          name="nivelEstres"
          value={surveyData.dailyHabits.nivelEstres}
          onChange={handleSelectChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Bajo">Bajo</option>
          <option value="Moderado">Moderado</option>
          <option value="Alto">Alto</option>
          <option value="Muy alto">Muy alto</option>
        </select>
      </div>

      <div>
        <label htmlFor="consumoAgua" className="block text-sm font-medium text-gray-700">
          ¿Cuánta agua consumes al día?
        </label>
        <select
          id="consumoAgua"
          name="consumoAgua"
          value={surveyData.dailyHabits.consumoAgua}
          onChange={handleSelectChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Menos de 1 litro">Menos de 1 litro</option>
          <option value="1-2 litros">1-2 litros</option>
          <option value="2-3 litros">2-3 litros</option>
          <option value="Más de 3 litros">Más de 3 litros</option>
        </select>
      </div>

      <div>
        <label htmlFor="comidasPorDia" className="block text-sm font-medium text-gray-700">
          ¿Cuántas comidas realizas al día?
        </label>
        <select
          id="comidasPorDia"
          name="comidasPorDia"
          value={surveyData.dailyHabits.comidasPorDia}
          onChange={handleSelectChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="2 o menos">2 o menos</option>
          <option value="3-4">3-4</option>
          <option value="5 o más">5 o más</option>
        </select>
      </div>

      <div>
        <label htmlFor="habitosSnacks" className="block text-sm font-medium text-gray-700">
          ¿Con qué frecuencia consumes snacks?
        </label>
        <select
          id="habitosSnacks"
          name="habitosSnacks"
          value={surveyData.dailyHabits.habitosSnacks}
          onChange={handleSelectChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="No como snacks">No como snacks</option>
          <option value="1-2 snacks al día">1-2 snacks al día</option>
          <option value="3 o más snacks al día">3 o más snacks al día</option>
        </select>
      </div>

      <div>
        <label htmlFor="horasPantallas" className="block text-sm font-medium text-gray-700">
          ¿Cuántas horas pasas frente a pantallas?
        </label>
        <select
          id="horasPantallas"
          name="horasPantallas"
          value={surveyData.dailyHabits.horasPantallas}
          onChange={handleSelectChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Menos de 4 horas">Menos de 4 horas</option>
          <option value="4-8 horas">4-8 horas</option>
          <option value="Más de 8 horas">Más de 8 horas</option>
        </select>
      </div>

      <div>
        <label htmlFor="tipoTrabajo" className="block text-sm font-medium text-gray-700">
          ¿Cuál es tu tipo de trabajo?
        </label>
        <select
          id="tipoTrabajo"
          name="tipoTrabajo"
          value={surveyData.dailyHabits.tipoTrabajo}
          onChange={handleSelectChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Sedentario">Sedentario</option>
          <option value="Activo">Activo</option>
          <option value="Mixto">Mixto</option>
          <option value="Trabajo físico intenso">Trabajo físico intenso</option>
        </select>
      </div>
    </div>
  );
};

export default DailyHabits;
