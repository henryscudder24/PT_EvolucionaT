import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Sobre Nosotros</h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg mb-4">
            EvolucionaT es una plataforma dedicada a ayudar a las personas a mejorar su salud y bienestar
            a través de planes personalizados de nutrición y ejercicio.
          </p>
          <p className="text-lg mb-4">
            Nuestra misión es proporcionar herramientas y recursos que ayuden a las personas a alcanzar
            sus objetivos de salud de manera sostenible y efectiva.
          </p>
          <p className="text-lg">
            Utilizamos un enfoque basado en datos y evidencia para crear planes personalizados que se
            adaptan a las necesidades y objetivos específicos de cada usuario.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About; 