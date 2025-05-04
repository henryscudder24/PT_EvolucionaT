from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.base import User
from app.auth import get_current_user
import os
from googleapiclient.discovery import build
from dotenv import load_dotenv
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cargar variables de entorno
load_dotenv()

router = APIRouter()
security = HTTPBearer()

# Configurar la API de YouTube
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

@router.get("/youtube-search")
async def search_youtube_videos(
    query: str,
    type: str,
    credentials: HTTPAuthorizationCredentials = Security(security),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Modificar la búsqueda según el tipo
        if type == 'recipe':
            search_query = f"{query} receta saludable"
        else:  # exercise
            search_query = f"{query} ejercicio tutorial"

        # Realizar la búsqueda
        search_response = youtube.search().list(
            q=search_query,
            part='snippet',
            maxResults=12,
            type='video',
            relevanceLanguage='es',
            regionCode='ES'
        ).execute()

        # Procesar los resultados
        videos = []
        for item in search_response.get('items', []):
            video = {
                'id': item['id']['videoId'],
                'title': item['snippet']['title'],
                'thumbnail': item['snippet']['thumbnails']['high']['url'],
                'channelTitle': item['snippet']['channelTitle']
            }
            videos.append(video)

        return videos

    except Exception as e:
        logger.error(f"Error al buscar videos de YouTube: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al buscar videos: {str(e)}"
        ) 