import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Bienvenido a EvolucionaT</h1>
        <p className="text-xl text-center mb-8">
          Tu plataforma para mejorar tu salud y bienestar
        </p>
        <div className="flex justify-center">
          <Link
            to="/survey"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Comenzar Encuesta
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 