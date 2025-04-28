import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../../context/AuthContext';

const loginSchema = z.object({
  email: z.string({
    required_error: "El email es obligatorio",
  })
    .nonempty("El email es obligatorio")
    .email("El email ingresado no es válido"),

  password: z.string({
    required_error: "La contraseña es obligatoria",
  }).nonempty("La contraseña es obligatoria"),
});

type FormData = z.infer<typeof loginSchema>

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("http://localhost:8000/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: data.email,
          contraseña: data.password,
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error("Error en el login:", error);
        alert("Error: " + error.detail);
        return;
      }
  
      const result = await response.json();
      const { token, user } = result;
      
      // Store token and user data
      login(token, user);
      
      // Redirect to user profile
      navigate('/profile');
  
    } catch (err) {
      console.error("Error inesperado:", err);
      alert("Ocurrió un error inesperado. Por favor intenta nuevamente.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Iniciar Sesión</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Ingresa a tu Cuenta</h2>
          <p className="text-gray-700 mb-6">
            Accede a todas las herramientas y servicios exclusivos que tenemos para ti.
          </p>
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold mb-2"></h2>
            </div>
          </div>
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
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
            >
              Iniciar Sesión
            </button>
            <p className="text-sm text-center text-gray-500 mt-4">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-primary hover:text-primary-dark">
                Regístrate aquí
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;