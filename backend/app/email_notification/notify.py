from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from dotenv import load_dotenv
import os
import logging

load_dotenv()
SENDER_GMAIL = os.environ["SENDER_GMAIL"]
SENDER_GMAIL_PASSWORD = os.environ["SENDER_GMAIL_PASSWORD"]

conf = ConnectionConfig(
    MAIL_USERNAME = SENDER_GMAIL,
    MAIL_PASSWORD = SENDER_GMAIL_PASSWORD,
    MAIL_FROM = SENDER_GMAIL,
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_FROM_NAME="FastAPI forgot password example",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = False,
)

async def send_reset_password_mail(recipient_email, user, url, expire_in_minutes):
    template_body = f"""
    <html>
        <body>
            <h2>Hola {user},</h2>
            <p>Has solicitado restablecer tu contraseña.</p>
            <p>Haz clic en el siguiente enlace para restablecerla:</p>
            <a href="{url}">Restablecer contraseña</a>
            <p>Este enlace expirará en {expire_in_minutes} minutos.</p>
        </body>
    </html>
    """
    try:
        # Crear el mensaje con el cuerpo en formato HTML
        message = MessageSchema(
            subject="Restablecimiento de contraseña - FastAPI",
            recipients=[recipient_email],
            body=template_body,  
            subtype=MessageType.html 
        )
        fm = FastMail(conf)
        await fm.send_message(message)
    except Exception as e:
        logging.error(f"Algo salió mal al enviar el correo de restablecimiento de contraseña a {recipient_email} para {user}")
        logging.error(str(e))

