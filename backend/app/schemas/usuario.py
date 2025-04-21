from pydantic import BaseModel, EmailStr

class UsuarioBase(BaseModel):
    nombre: str
    correo: EmailStr

class UsuarioCreate(UsuarioBase):
    contraseña: str

class UsuarioLogin(BaseModel):
    correo: str
    contrasena: str

class UsuarioOut(UsuarioBase):
    id: int

    class Config:
        orm_mode = True
