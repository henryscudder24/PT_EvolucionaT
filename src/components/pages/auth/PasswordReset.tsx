import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const resetPasswordSchema = z.object({
  password: z.string({
    required_error: "La contraseña es obligatoria",
  })
    .nonempty("La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),

  password2: z.string({
    required_error: "La confirmación de contraseña es obligatoria",
  }).nonempty("La confirmación de contraseña es obligatoria"),
}).refine((data) => data.password === data.password2, {
  message: "Las contraseñas no son iguales",
  path: ["password2"],
});

type FormData = z.infer<typeof resetPasswordSchema>;

const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const response = await fetch(`http://localhost:8000/usuarios/password-reset/${token}`);
        const data = await response.json();
       
        if (response.ok) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          alert("El token es inválido o ha expirado");
          navigate("/password-reset-request");
        }
      } catch (err) {
        console.error("Error al verificar el token:", err);
        setIsValidToken(false);
      } finally {
        setIsLoading(false); 
      }
    };

    if (token) {
      checkTokenValidity();
    }
  }, [token]);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("http://localhost:8000/usuarios/password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: data.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert("Error: " + error.detail);
        return;
      }

      alert("Contraseña actualizada correctamente!");
      navigate("/login");
    } catch (err) {
      console.error("Error inesperado:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Verificando token...</h1>
      </div>
    );
  }

  if (isValidToken === false) {
    return null; 
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Restablecer Contraseña</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Actualiza tu Contraseña</h2>
          <p className="text-gray-700 mb-6">
            Ingresa una nueva contraseña segura para tu cuenta.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                id="password"
                {...register('password')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>
            <div>
              <label htmlFor="password2" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
              <input
                type="password"
                id="password2"
                {...register('password2')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
              {errors.password2 && <p className="text-red-500 text-xs">{errors.password2.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;