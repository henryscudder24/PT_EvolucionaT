import React from 'react';

const Services = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Nuestros Servicios</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Entrenamiento Personalizado</h2>
          <p className="text-gray-700 mb-4">
            Programas de ejercicio diseñados específicamente para tus objetivos y nivel de condición física.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>• Evaluación física completa</li>
            <li>• Plan de ejercicios personalizado</li>
            <li>• Seguimiento de progreso</li>
            <li>• Ajustes periódicos del programa</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Asesoría Nutricional</h2>
          <p className="text-gray-700 mb-4">
            Planes de alimentación adaptados a tus necesidades, preferencias y objetivos de salud.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>• Evaluación nutricional</li>
            <li>• Plan alimenticio personalizado</li>
            <li>• Recetas saludables</li>
            <li>• Consejos de suplementación</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Coaching de Bienestar</h2>
          <p className="text-gray-700 mb-4">
            Apoyo integral para desarrollar hábitos saludables y mantener un estilo de vida equilibrado.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>• Gestión del estrés</li>
            <li>• Mejora del sueño</li>
            <li>• Desarrollo de hábitos</li>
            <li>• Apoyo motivacional</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Services;