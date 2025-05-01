import React from "react";
import { useSurvey } from "@/context/SurveyContext";
import { motion, AnimatePresence } from "framer-motion";
import SurveyProgress from "./SurveyProgress";
import PersonalInfo from "./steps/PersonalInfo";
import MedicalHistory from "./steps/MedicalHistory";
import DailyHabits from "./steps/DailyHabits";
import ExerciseHistory from "./steps/ExerciseHistory";
import NutritionHabits from "./steps/NutritionHabits";

const SurveyContainer = () => {
  const { currentStep } = useSurvey();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfo />;
      case 1:
        return <MedicalHistory />;
      case 2:
        return <DailyHabits />;
      case 3:
        return <ExerciseHistory />;
      case 4:
        return <NutritionHabits />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <SurveyProgress />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SurveyContainer; 