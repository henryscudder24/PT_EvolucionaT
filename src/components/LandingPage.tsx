import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/images/personal/fitness-hero.jpg")',
          backgroundSize: 'contain',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#000000',
          filter: 'brightness(0.7)'
        }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen text-white">
        {/* Hero Section */}
        <div className="container mx-auto px-6 flex flex-col items-center justify-center text-center" style={{ minHeight: '100vh' }}>
          <h2 className="text-5xl font-bold leading-tight mb-8">
            Hazlo posible,<br />
            evoluciona ahora
          </h2>
          <Link
            to="/survey"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-300 transform hover:scale-105"
          >
            Evoluciona ahora
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;