import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nutritionHabitsSchema, type NutritionHabitsData } from "@/validationSchemas";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useSurvey } from "@/context/SurveyContext";
import ContinueButton from "../ContinueButton";

type ComidasPorDiaType = NutritionHabitsData['comidasPorDia'];
type HabitosSnacksType = NutritionHabitsData['habitosSnacks'];
type PreferenciasAlimentariasType = NutritionHabitsData['preferenciasAlimentarias'];
type RestriccionesType = NutritionHabitsData['restricciones'];

const comidasPorDia: ComidasPorDiaType[] = [
  "2 o menos",
  "3-4",
  "5 o más"
];

const habitosSnacks: HabitosSnacksType[] = [
  "No como snacks",
  "1-2 snacks al día",
  "3 o más snacks al día"
];

const preferenciasAlimentarias: PreferenciasAlimentariasType[] = [
  "Omnívoro",
  "Vegetariano",
  "Vegano",
  "Sin gluten",
  "Sin lactosa",
  "Otro"
];

const restricciones: RestriccionesType[] = [
  "Ninguna",
  "Alergias",
  "Intolerancias",
  "Enfermedades",
  "Otro"
];

const NutritionHabits = () => {
  const { updateSurveyData, nextStep } = useSurvey();
  const [showOtherPreference, setShowOtherPreference] = React.useState(false);
  const [showOtherRestriction, setShowOtherRestriction] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NutritionHabitsData>({
    resolver: zodResolver(nutritionHabitsSchema),
    defaultValues: {
      comidasPorDia: "3-4",
      habitosSnacks: "1-2 snacks al día",
      preferenciasAlimentarias: "Omnívoro",
      otraPreferencia: "",
      restricciones: "Ninguna",
      otraRestriccion: "",
      objetivosNutricionales: "",
    },
  });

  const onSubmit = (data: NutritionHabitsData) => {
    updateSurveyData("nutritionHabits", data);
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
                <Label>¿Cuántas comidas haces al día?</Label>
                <Controller
                  name="comidasPorDia"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-2 gap-2 mt-2"
                    >
                      {comidasPorDia.map((comidas) => (
                        <div key={comidas} className="flex items-center space-x-2">
                          <RadioGroupItem value={comidas} id={comidas} />
                          <Label htmlFor={comidas}>{comidas}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.comidasPorDia && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.comidasPorDia.message as string}
                  </p>
                )}
              </div>

              <div>
                <Label>¿Con qué frecuencia comes snacks?</Label>
                <Controller
                  name="habitosSnacks"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-2 gap-2 mt-2"
                    >
                      {habitosSnacks.map((habito) => (
                        <div key={habito} className="flex items-center space-x-2">
                          <RadioGroupItem value={habito} id={habito} />
                          <Label htmlFor={habito}>{habito}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.habitosSnacks && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.habitosSnacks.message as string}
                  </p>
                )}
              </div>

              <div>
                <Label>¿Cuáles son tus preferencias alimentarias?</Label>
                <Controller
                  name="preferenciasAlimentarias"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-2 gap-2 mt-2"
                    >
                      {preferenciasAlimentarias.map((preferencia) => (
                        <div key={preferencia} className="flex items-center space-x-2">
                          <RadioGroupItem value={preferencia} id={preferencia} />
                          <Label htmlFor={preferencia}>{preferencia}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.preferenciasAlimentarias && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.preferenciasAlimentarias.message as string}
                  </p>
                )}
                {showOtherPreference && (
                  <div className="mt-2">
                    <Label>Especifica otra preferencia alimentaria:</Label>
                    <Textarea
                      {...register("otraPreferencia")}
                      placeholder="Describe tus preferencias alimentarias..."
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label>¿Tienes alguna restricción alimentaria?</Label>
                <Controller
                  name="restricciones"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-2 gap-2 mt-2"
                    >
                      {restricciones.map((restriccion) => (
                        <div key={restriccion} className="flex items-center space-x-2">
                          <RadioGroupItem value={restriccion} id={restriccion} />
                          <Label htmlFor={restriccion}>{restriccion}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.restricciones && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.restricciones.message as string}
                  </p>
                )}
                {showOtherRestriction && (
                  <div className="mt-2">
                    <Label>Especifica otra restricción:</Label>
                    <Textarea
                      {...register("otraRestriccion")}
                      placeholder="Describe tus restricciones alimentarias..."
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label>¿Cuáles son tus objetivos nutricionales?</Label>
                <Textarea
                  {...register("objetivosNutricionales")}
                  placeholder="Describe tus objetivos, como perder peso, ganar masa muscular, mejorar la salud..."
                  className="mt-1"
                />
                {errors.objetivosNutricionales && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.objetivosNutricionales.message as string}
                  </p>
                )}
              </div>
            </div>

            <ContinueButton
              message="¡Gracias por compartir tus hábitos nutricionales! Esta información nos ayudará a crear un plan de alimentación personalizado."
              onContinue={handleSubmit(onSubmit)}
            />
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NutritionHabits; 