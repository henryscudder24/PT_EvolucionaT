from pydantic import BaseModel, EmailStr

class UsuarioBase(BaseModel):
    correo: EmailStr
    nombre: str

class UsuarioCreate(UsuarioBase):
    contraseña: str

class UsuarioOut(UsuarioBase):
    id: int

    class Config:
        from_attributes = True

class UsuarioLogin(BaseModel):
    correo: EmailStr
    contraseña: str

class TokenData(BaseModel):
    email: str | None = None
