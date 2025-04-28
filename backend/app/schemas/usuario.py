from pydantic import BaseModel, EmailStr

class UsuarioBase(BaseModel):
    nombre: str
    correo: EmailStr

class UsuarioCreate(UsuarioBase):
    contraseña: str

class UsuarioLogin(BaseModel):
    correo: str
    contraseña: str

class UsuarioOut(UsuarioBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True 

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UsuarioOut

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordReset(BaseModel):
    token: str
    new_password: str
    
    
  
   
