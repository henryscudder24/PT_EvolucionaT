from pydantic import BaseModel, EmailStr

class UsuarioBase(BaseModel):
    correo: EmailStr
    nombre: str

class UsuarioCreate(UsuarioBase):
    contraseña: str

class UsuarioOut(BaseModel):
    id: int
    nombre: str
    correo: EmailStr

    class Config:
        from_attributes = True

class UsuarioLogin(BaseModel):
    correo: EmailStr
    contraseña: str

class TokenData(BaseModel):
    email: str | None = None
