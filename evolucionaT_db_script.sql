
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS evolucionaT;
USE evolucionaT;

-- Tabla Tipo_Usuario
CREATE TABLE Tipo_Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(50)
);

-- Tabla Usuario
CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(100) NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    id_tipo_usuario INT,
    FOREIGN KEY (id_tipo_usuario) REFERENCES Tipo_Usuario(id)
   
);

-- Tabla Perfil_Usuario
CREATE TABLE Perfil_Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    genero ENUM('masculino', 'femenino', 'otro', 'prefiero_no_decir'),
    edad INT,
    peso DECIMAL(5,2),
    altura DECIMAL(5,2),
    nivel_actividad ENUM('sedentario', 'moderado', 'activo', 'muy_activo', 'extremo'),
	objetivo_principal VARCHAR(50),
    tiempo_meta VARCHAR(20),
    nivel_compromiso TINYINT,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id)
    
);

CREATE TABLE Preferencias_Alimentarias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_perfil INT,
    tipo ENUM('dieta', 'alergia', 'favorito'),
    valor VARCHAR(100),
    FOREIGN KEY (id_perfil) REFERENCES Perfil_Usuario(id)
);
CREATE TABLE Alimentos_Evitados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_perfil INT,
    descripcion TEXT,
    FOREIGN KEY (id_perfil) REFERENCES Perfil_Usuario(id)
);
CREATE TABLE Condicion_Fisica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_perfil INT,
    frecuencia_ejercicio VARCHAR(50),
    tiempo_disponible VARCHAR(50),
    FOREIGN KEY (id_perfil) REFERENCES Perfil_Usuario(id)
);
CREATE TABLE Ejercicio_Preferido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_perfil INT,
    tipo VARCHAR(50),
    FOREIGN KEY (id_perfil) REFERENCES Perfil_Usuario(id)
);
CREATE TABLE Equipamiento_Disponible (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_perfil INT,
    equipo VARCHAR(50),
    FOREIGN KEY (id_perfil) REFERENCES Perfil_Usuario(id)
);
CREATE TABLE Historial_Medico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_perfil INT,
    condicion_cronica TEXT,
    medicamentos TEXT,
    lesiones TEXT,
    antecedentes_familiares TEXT,
    FOREIGN KEY (id_perfil) REFERENCES Perfil_Usuario(id)
);
CREATE TABLE Habitos_Diarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_perfil INT,
    horas_sueno VARCHAR(20),
    calidad_sueno VARCHAR(20),
    nivel_estres VARCHAR(20),
    agua_dia VARCHAR(20),
    comidas_dia VARCHAR(20),
    habitos_snack VARCHAR(30),
    horas_pantalla VARCHAR(20),
    tipo_trabajo VARCHAR(30),
    FOREIGN KEY (id_perfil) REFERENCES Perfil_Usuario(id)
);

-- Tabla Restriccion_Usuario
CREATE TABLE Restriccion_Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100)
);

CREATE TABLE Perfil_Restriccion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_perfil INT,
    id_restriccion INT,
    FOREIGN KEY (id_perfil) REFERENCES Perfil_Usuario(id),
    FOREIGN KEY (id_restriccion) REFERENCES Restriccion_Usuario(id)
);

CREATE TABLE Tipo_Objetivo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(100)
);

-- Tabla Meta_Usuario
CREATE TABLE Meta_Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_tipo_objetivo INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
    FOREIGN KEY (id_tipo_objetivo) REFERENCES Tipo_Objetivo(id)
);

-- Tabla Estado_Meta
CREATE TABLE Estado_Meta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(50)
);

-- Tabla Seguimiento_Meta
CREATE TABLE Seguimiento_Meta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_meta_usuario INT,
    fecha DATE,
    avance TEXT,
    FOREIGN KEY (id_meta_usuario) REFERENCES Meta_Usuario(id)
);

-- Tabla Progreso_Usuario
CREATE TABLE Progreso_Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    descripcion TEXT,
    fecha DATE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id)
);

-- Tabla Plan_Rutina_Usuario
CREATE TABLE Plan_Rutina_Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_estado_plan INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id)
);

-- Tabla Estado_Rutina
CREATE TABLE Estado_Rutina (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(50)
);

-- Tabla Seguimiento_Rutina
CREATE TABLE Seguimiento_Rutina (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_plan_rutina INT,
    fecha DATE,
    comentarios TEXT,
    FOREIGN KEY (id_plan_rutina) REFERENCES Plan_Rutina_Usuario(id)
);

-- Tabla Estado_Plan
CREATE TABLE Estado_Plan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(50)
);

-- Tabla Plan_Dieta_Usuario
CREATE TABLE Plan_Dieta_Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_estado_plan INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
    FOREIGN KEY (id_estado_plan) REFERENCES Estado_Plan(id)
);

-- Tabla Seguimiento_Dieta
CREATE TABLE Seguimiento_Dieta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_plan_dieta INT,
    fecha DATE,
    descripcion TEXT,
    FOREIGN KEY (id_plan_dieta) REFERENCES Plan_Dieta_Usuario(id)
);
