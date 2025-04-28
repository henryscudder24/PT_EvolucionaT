import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const resetSchema = z.object({
  email: z.string({
    required_error: "El email es obligatorio",
  })
    .nonempty("El email es obligatorio")
    .email("El email ingresado no es válido"),
});

type FormData = z.infer<typeof resetSchema>

const Reset = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("http://localhost:8000/usuarios/password-reset-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error en el backend:", error);
        alert("Error: " + error.detail);
        return;
      }

      const user = await response.json();
      alert(`Te hemos enviado un enlace a ${user.correo} para reestablecer la contraseña!`);


    } catch (err) {
      console.error("Error inesperado:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Restablecer Contraseña</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-gray-700 mb-6">
            Ingresa tu correo electrónico para recibir el enlace y restablecer tu contraseña.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                autoComplete='email'
                {...register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
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

export default Reset;