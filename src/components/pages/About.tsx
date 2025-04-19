import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Sobre Nosotros</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Nuestra Misión</h2>
          <p className="text-gray-700 mb-6">
            En EvolucionaT, nos dedicamos a transformar vidas a través de un enfoque holístico del bienestar.
            Nuestra misión es proporcionar soluciones personalizadas que combinen nutrición, ejercicio y
            hábitos saludables para ayudarte a alcanzar tus objetivos de salud y fitness.
          </p>
          <h2 className="text-2xl font-semibold mb-4">Nuestra Visión</h2>
          <p className="text-gray-700">
            Aspiramos a ser líderes en la transformación del bienestar personal, creando una comunidad
            donde cada individuo pueda alcanzar su máximo potencial físico y mental.
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">¿Por qué elegirnos?</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Programas personalizados basados en tus necesidades específicas</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Equipo de profesionales altamente calificados</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Seguimiento continuo de tu progreso</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Comunidad de apoyo activa</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;