from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='interfaz_2'),  # Página principal que renderiza 'interfaz_2.html'
    path('interfaz_3/', views.ayuda, name='interfaz_3'),  # Ruta que redirige a 'interfaz_3'
    path('interfaz_1/', views.actualizacion, name='interfaz_1'),  # Ruta que redirige a 'interfaz_1'
    path('interfaz_4/', views.actualizacion, name='interfaz_4'),  # Ruta que redirige a 'interfaz_1'
    path('handle_query/', views.handle_query, name='/handle_query/'),  # Ruta para clasificar la consulta
]
