from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData, Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

# Define naming convention for constraints
convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)
Base = declarative_base(metadata=metadata)

class User(Base):
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, name="correo")
    hashed_password = Column(String(255), name="contraseña")
    nombre = Column(String(255), name="nombre")
    
    # Relationship with survey responses
    survey_responses = relationship("SurveyResponse", back_populates="user")

class SurveyResponse(Base):
    __tablename__ = "survey_responses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("usuario.id"))
    question_id = Column(Integer)
    response = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship with user
    user = relationship("User", back_populates="survey_responses") 