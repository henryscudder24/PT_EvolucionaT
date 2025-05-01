import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exerciseHistorySchema, type ExerciseHistoryData } from "@/validationSchemas";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useSurvey } from "@/context/SurveyContext";
import ContinueButton from "../ContinueButton";

type FrecuenciaType = ExerciseHistoryData['frecuencia'];
type DuracionType = ExerciseHistoryData['duracion'];
type IntensidadType = ExerciseHistoryData['intensidad'];
type TipoEjercicioType = ExerciseHistoryData['tipoEjercicio'];

const frecuencia: FrecuenciaType[] = [
  "Nunca",
  "1-2 veces por semana",
  "3-4 veces por semana",
  "5 o más veces por semana"
];

const duracion: DuracionType[] = [
  "Menos de 30 minutos",
  "30-60 minutos",
  "Más de 60 minutos"
];

const intensidad: IntensidadType[] = [
  "Baja",
  "Moderada",
  "Alta",
  "Muy alta"
];

const tipoEjercicio: TipoEjercicioType[] = [
  "Cardio",
  "Fuerza",
  "Flexibilidad",
  "Deportes",
  "Otro"
];

const ExerciseHistory = () => {
  const { updateSurveyData, nextStep } = useSurvey();
  const [showOtherExercise, setShowOtherExercise] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ExerciseHistoryData>({
    resolver: zodResolver(exerciseHistorySchema),
    defaultValues: {
      frecuencia: "1-2 veces por semana",
      duracion: "30-60 minutos",
      intensidad: "Moderada",
      tipoEjercicio: "Cardio",
      otroTipoEjercicio: "",
      lesionesPrevias: "",
      objetivos: "",
    },
  });

  const onSubmit = (data: ExerciseHistoryData) => {
    updateSurveyData("exerciseHistory", data);
    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>¿Con qué frecuencia haces ejercicio?</Label>
                <Controller
                  name="frecuencia"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-2 gap-2 mt-2"
                    >
                      {frecuencia.map((freq) => (
                        <div key={freq} className="flex items-center space-x-2">
                          <RadioGroupItem value={freq} id={freq} />
                          <Label htmlFor={freq}>{freq}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.frecuencia && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.frecuencia.message as string}
                  </p>
                )}
              </div>

              <div>
                <Label>¿Cuánto tiempo sueles dedicar a cada sesión?</Label>
                <Controller
                  name="duracion"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-2 gap-2 mt-2"
                    >
                      {duracion.map((dur) => (
                        <div key={dur} className="flex items-center space-x-2">
                          <RadioGroupItem value={dur} id={dur} />
                          <Label htmlFor={dur}>{dur}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.duracion && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.duracion.message as string}
                  </p>
                )}
              </div>

              <div>
                <Label>¿Cómo calificarías la intensidad de tu ejercicio?</Label>
                <Controller
                  name="intensidad"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-2 gap-2 mt-2"
                    >
                      {intensidad.map((int) => (
                        <div key={int} className="flex items-center space-x-2">
                          <RadioGroupItem value={int} id={int} />
                          <Label htmlFor={int}>{int}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.intensidad && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.intensidad.message as string}
                  </p>
                )}
              </div>

              <div>
                <Label>¿Qué tipo de ejercicio sueles practicar?</Label>
                <Controller
                  name="tipoEjercicio"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-2 gap-2 mt-2"
                    >
                      {tipoEjercicio.map((tipo) => (
                        <div key={tipo} className="flex items-center space-x-2">
                          <RadioGroupItem value={tipo} id={tipo} />
                          <Label htmlFor={tipo}>{tipo}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.tipoEjercicio && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.tipoEjercicio.message as string}
                  </p>
                )}
                {showOtherExercise && (
                  <div className="mt-2">
                    <Label>Especifica otro tipo de ejercicio:</Label>
                    <Textarea
                      {...register("otroTipoEjercicio")}
                      placeholder="Describe el tipo de ejercicio que practicas..."
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label>¿Has tenido alguna lesión previa relacionada con el ejercicio?</Label>
                <Textarea
                  {...register("lesionesPrevias")}
                  placeholder="Describe cualquier lesión o problema que hayas tenido..."
                  className="mt-1"
                />
                {errors.lesionesPrevias && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.lesionesPrevias.message as string}
                  </p>
                )}
              </div>

              <div>
                <Label>¿Cuáles son tus objetivos principales con el ejercicio?</Label>
                <Textarea
                  {...register("objetivos")}
                  placeholder="Describe tus objetivos, como mejorar la salud, perder peso, ganar fuerza..."
                  className="mt-1"
                />
                {errors.objetivos && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.objetivos.message as string}
                  </p>
                )}
              </div>
            </div>

            <ContinueButton
              message="¡Gracias por compartir tu historial de ejercicio! Esta información nos ayudará a crear un plan de entrenamiento personalizado."
              onContinue={handleSubmit(onSubmit)}
            />
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExerciseHistory; 