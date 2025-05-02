import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Register";
import UserProfile from "./components/pages/UserProfile";
import UserProgress from "./components/pages/UserProgress";
import Survey from "./components/Survey";
import { AuthProvider } from "./context/AuthContext";
import SurveyProgress from "./components/SurveyProgress";
import PersonalInfo from "./components/steps/PersonalInfo";
import FoodPreferences from "./components/steps/FoodPreferences";
import GoalsObjectives from "./components/steps/GoalsObjectives";
import FitnessLevel from "./components/steps/FitnessLevel";
import MedicalHistory from "./components/steps/MedicalHistory";
import DailyHabits from "./components/steps/DailyHabits";
import Completion from "./components/steps/Completion";
import { SurveyProvider } from "./context/SurveyContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import About from './components/pages/About';
import Services from './components/pages/Services';
import Contact from './components/pages/Contact';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SurveyProvider>
          <Toaster position="top-center" />
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <UserProgress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/survey"
              element={
                <ProtectedRoute>
                  <Survey />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </SurveyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
