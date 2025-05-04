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
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-12 rounded-full text-xl transition-colors duration-300 transform hover:scale-105 mb-12"
          >
            Evoluciona ahora
          </Link>

          {/* Video Section */}
          <div className="w-full max-w-3xl mx-auto">
            <div className="relative pb-[56.25%] h-0">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/TakRuEPV4mA?autoplay=0&mute=1&controls=1&showinfo=0&rel=0"
                title="Motivación Fitness"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;