import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

//validation rules
const registerSchema = z.object({
  name: z.string({
    required_error:"El nombre es obligatorio",
  })
  .nonempty("El nombre es obligatorio")
  .min(3, "El nombre debe tener al menos 3 caracteres"),

  email: z.string({
    required_error:"El email es obligatorio",
  })
  .nonempty("El email es obligatorio")
  .email( "El email ingresado no es válido"),

  password: z.string({
    required_error:"La contraseña es obligatoria",
  })
  .nonempty("La contraseña es obligatoria")
  .min(8,"La contraseña debe tener al menos 8 caracteres"),

  password2: z.string({
    required_error:"La confirmación de contraseña es obligatoria",
  }).nonempty("La confirmación de contraseña es obligatoria"),
})
.refine((data) => data.password === data.password2, {
    message:"las contraseñas no son iguales",
    path:["password2"],
});

type FormData = z.infer<typeof registerSchema>

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  }); 

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("http://localhost:8000/usuarios/registro", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: data.name,
          correo: data.email,
          contraseña: data.password,
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error('Error en el registro:', error);
        alert('Error al registrarse: ' + (error.detail || 'Intenta con otro correo'));
        return;
      }
  
      alert('✅ Registro exitoso');
      
    } catch (err) {
      console.error('Error inesperado:', err);
      alert('Error de red o servidor');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Registrarse</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Crea una Cuenta</h2>
          <p className="text-gray-700 mb-6">
            Accede a todos los servicios y beneficios que EvolucionaT tiene preparados para impulsar tu bienestar.
          </p>
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold mb-2">Es el momento de comenzar tu transformación!</h2>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                id="name"
                autoComplete="name"
                {...register('name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
               {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
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
              Registrarse
            </button>
            <p className="text-sm text-center text-gray-500 mt-4">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary hover:text-primary-dark">
                Inicia sesión aquí
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
};

export default Register;