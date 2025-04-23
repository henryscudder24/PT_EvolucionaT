import type React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { SurveyProvider } from './context/SurveyContext';
import SurveyProgress from './components/SurveyProgress';
import SurveyNavigation from './components/SurveyNavigation';
import PersonalInfo from './components/steps/PersonalInfo';
import FoodPreferences from './components/steps/FoodPreferences';
import GoalsObjectives from './components/steps/GoalsObjectives';
import FitnessLevel from './components/steps/FitnessLevel';
import MedicalHistory from './components/steps/MedicalHistory';
import DailyHabits from './components/steps/DailyHabits';
import Completion from './components/steps/Completion';
import LandingPage from './components/LandingPage';
import About from './components/pages/About';
import Services from './components/pages/Services';
import Contact from './components/pages/Contact';
import { useSurvey } from './context/SurveyContext';
import Register from './components/pages/auth/Register';
import Login from './components/pages/auth/Login';
import Me from './components/pages/me';

// Componente que maneja la lógica de mostrar el paso actual
const SurveySteps: React.FC = () => {
  const { currentStep, isLastStep, totalSteps } = useSurvey();

  // Verificar si hemos completado todos los pasos
  const isCompleted = currentStep > totalSteps;

  // Mostrar el paso actual
  const renderCurrentStep = () => {
    if (isCompleted) {
      return <Completion />;
    }

    switch (currentStep) {
      case 1:
        return <PersonalInfo />;
      case 2:
        return <FoodPreferences />;
      case 3:
        return <GoalsObjectives />;
      case 4:
        return <FitnessLevel />;
      case 5:
        return <MedicalHistory />;
      case 6:
        return <DailyHabits />;
      default:
        return <PersonalInfo />;
    }
  };

  return (
    <div>
      {!isCompleted && <SurveyProgress />}
      {renderCurrentStep()}
      {!isCompleted && <SurveyNavigation />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/me" element={<Me />} />
          <Route
            path="/survey"
            element={<>
              <header className="bg-primary text-white py-4">
                <div className="container mx-auto px-4">
                  <h1 className="text-2xl font-bold">EvolucionaT</h1>
                  <p className="text-sm">Sistema de Recomendaciones Personalizadas</p>
                </div>
              </header>
              <main className="container mx-auto survey-container py-8">
                <SurveyProvider>
                  <SurveySteps />
                </SurveyProvider>
              </main>
            </>}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
