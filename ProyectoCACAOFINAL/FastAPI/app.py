import os
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import numpy as np
from PIL import Image
import jwt
import tensorflow as tf
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]  # Aceptar conexiones desde cualquier origen (cuidado en producción)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load the model only once during application startup
model = tf.keras.models.load_model("./ProyectoCACAOFINAL/FastAPI/(92%)MobileNetv2_Vocales_Classifier.h5")

# Secret key used for signing the token (keep this secret!)
SECRET_KEY = "ProyectoCacao"

# Function to verify JWT and get the current user
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
# Endpoint para cargar y procesar la imagen
@app.post("/upload/")
def process_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    print("asdasd")
    # Verificar si es una imagen válida
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Archivo no es una imagen")
     
    # Directorio donde se guardará la imagen temporalmente
    directorio_temporal = "temp_images"

    # Crear el directorio temporal si no existe
    if not os.path.exists(directorio_temporal):
        os.makedirs(directorio_temporal)

    # Guardar la imagen temporalmente con un nombre único
    nombre_archivo = os.path.join(directorio_temporal, file.filename)
    with open(nombre_archivo, "wb") as f:
        f.write(file.file.read())

    # Cargar la imagen y normalizar (convertir a escala de grises)
    image = Image.open(nombre_archivo).convert("RGB")
    image = image.resize((224, 224))

    # Convert the image to a NumPy array
    image = np.array(image)
    image = image / 255.0
    image = image.reshape(1, 224, 224, 3)

    # Predict the label
    prediction = model.predict(image)
    prediction = prediction.tolist()

    # Obtener el valor más alto en la lista anidada
    valor_mas_alto = max(prediction[0])

# Obtener el índice del valor más alto
    indice_mas_alto = prediction[0].index(valor_mas_alto)

    print("El índice del número más alto es:", indice_mas_alto)
    # Eliminar el archivo temporal
    os.remove(nombre_archivo)
    return indice_mas_alto

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
