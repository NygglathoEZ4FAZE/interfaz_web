from django.shortcuts import render
import psycopg2
import torch
import torch.nn.functional as F
from sklearn.feature_extraction.text import TfidfVectorizer
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse

# Vista para la página principal (Interfaz 2)
def index(request):
    return render(request,'interfaz_2.html')  # Renderiza 'interfaz_2.html'

# Vista para redirigir a 'interfaz_3'
def ayuda(request):
    return render(request,'interfaz_3.html')  # Redirige a la URL con nombre 'interfaz_3'

# Vista para redirigir a 'interfaz_1'
def actualizacion(request):
    return render(request, 'interfaz_1.html')  # Redirige a la URL con nombre 'interfaz_1'

# Vista para redirigir a 'interfaz_1'
def actualizacion(request):
    return render(request, 'interfaz_4.html')  # Redirige a la URL con nombre 'interfaz_1'



#Funciones para hacer las consultas

# Configura tus credenciales de conexión
db_host = "aws-0-sa-east-1.pooler.supabase.com"         # Por ejemplo, "localhost" o la IP del servidor
db_name = "postgres"    # Nombre de tu base de datos
db_user = "postgres.ybuimxfsacmfmlmkmbxc"      # Tu usuario de base de datos
db_password = "245054J@mes3091" # Tu contraseña de base de datos
db_port = "6543"

# Función para conectar a la base de datos
def connect_to_db():
    try:
        conn = psycopg2.connect(
            host=db_host,
            database=db_name,
            user=db_user,
            password=db_password
        )
        print("Conexión exitosa a la base de datos PostgreSQL.")
        return conn
    except Exception as e:
        print(f"Ocurrió un error al conectar a la base de datos: {e}")
        return None


# Función para realizar la consulta
def query_database(intent):
    try:
        with psycopg2.connect(
            host=db_host,
            port=db_port,
            database=db_name,
            user=db_user,
            password=db_password
        ) as conn:
            cursor = conn.cursor()
            print(intent)
            cursor.execute("SELECT instruction, response from soporte_n1 WHERE intent = %s", (intent,))
            results = cursor.fetchall()
            return results
    except Exception as e:
        print(f"Ocurrió un error al consultar la base de datos: {e}")
        return []

# Función para obtener los embeddings de las instrucciones
# Inicializa el vectorizador
vectorizer = TfidfVectorizer()

def get_embeddings(text_list):
    embeddings = vectorizer.transform(text_list)  # Vectorizar el texto (ajusta según tu modelo)
    return torch.tensor(embeddings.toarray(), dtype=torch.float32)

# Función para calcular similitud del coseno
def cosine_similarity(query_vector, result_vectors):
    similarities = F.cosine_similarity(query_vector, result_vectors, dim=-1)
    return similarities

# Función para encontrar la mejor respuesta
def find_best_response(query, instrucciones, respuestas):
    
    if not instrucciones:
        return "No se encontraron resultados para el intent."

    # Obtener embeddings de la consulta y de las instrucciones
    query_embedding = get_embeddings([query])  # Embedding de la consulta
    result_embeddings = get_embeddings(instrucciones)  # Embeddings de las instrucciones
    
    # Asegurarse de que las dimensiones coincidan
    query_embedding = query_embedding.squeeze()  # Asegurar que sea 1D
    result_embeddings = result_embeddings.squeeze(1)  # Asegurarse de que sea 2D

    # Calcular la similitud coseno
    similarities = cosine_similarity(query_embedding, result_embeddings)

    # Encontrar el índice de la instrucción más similar
    best_match_index = similarities.argmax().item()

    # Devolver la respuesta correspondiente a la instrucción más similar
    best_response = respuestas[best_match_index]
    
    return best_response

# Función principal para manejar la consulta
@csrf_exempt
def handle_query(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Cargar el cuerpo de la solicitud
            query = data.get('query')  # Obtiene la consulta
            intent = data.get('intent')  # Valor por defecto si no se envía intent
            
            if not query:  # Verifica si el query está vacío
                return JsonResponse({'error': 'Query is required'}, status=400)

            response = handle_query_logic(query, intent)  # Llama a la lógica de manejo

            return JsonResponse({'response': response})
        except json.JSONDecodeError:  # Captura errores de decodificación JSON
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)  # Retorna un error si algo sale mal
    return JsonResponse({'error': 'Invalid request'}, status=400)

def handle_query_logic(query, intent):
    results = query_database(intent)  # Realiza la consulta a la base de datos
    instrucciones = [fila[0] for fila in results]  # fila[0] es la columna 'instruction'
    respuestas = [fila[1] for fila in results]  # fila[1] es la columna 'response'
    
    if results:
        vectorizer.fit(instrucciones)
        report = find_best_response(query, instrucciones, respuestas)
        return {
            'best_response': report,
            'category': intent,  # o ajusta según tu lógica
            'intent': intent  # o ajusta según tu lógica
        }
    else:
        return "No se encontraron resultados para el intent."