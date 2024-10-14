# Usa una imagen base de Python 3.10.12
FROM python:3.10.12

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo de requerimientos
COPY requerimientos.txt .

# Instala las dependencias
RUN pip3 install -r requerimientos.txt

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto en el que la aplicación va a correr
EXPOSE 8080

# Establece la variable de entorno para Django
ENV DJANGO_SETTINGS_MODULE=proyecto_clasficador.settings

# Ejecuta las migraciones y luego inicia el servidor con Gunicorn
CMD python manage.py migrate && gunicorn --bind 0.0.0.0:$PORT proyecto_clasficador.wsgi:application
