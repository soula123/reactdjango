
# Create your views here.
import json
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db import connection
import MySQLdb as mysql

# Create your views here.
from django.http import HttpResponse
import mysql.connector
@csrf_exempt
# Endpoint to test database connection
@csrf_exempt
def test_connection(request):
    if request.method == 'POST':
        # Récupérer les informations de connexion à partir des données de requête
        request_data = request.body
        data = json.loads(request_data)

        # Établir une connexion à la base de données
        conn = mysql.connector.connect(
            host=data['host'],
            user=data['user'],
            password=data['password'],
            database=data['database']
        )

        # Si la connexion a réussi, récupérer les noms de toutes les bases de données
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("SHOW DATABASES")
            databases = cursor.fetchall()
            
            cursor.close()
            conn.close()
            # Retourner une réponse réussie avec les noms de toutes les bases de données en tant que données JSON
            response_data = {'status': 'success', 'message': 'Connected to the database!', 'databases':data['database']}
            return JsonResponse(response_data)
        else:
            # Retourner un message d'erreur si la connexion à la base de données a échoué
            response_data = {'status': 'error', 'message': 'Error connecting to the database.'}
            return JsonResponse(response_data)
    else:
        # Retourner une réponse d'erreur si la méthode de requête n'est pas POST
        response_data = {'status': 'error', 'message': 'Invalid request method.'}
        return JsonResponse(response_data)

@csrf_exempt
def show_tables(request):
    if request.method == 'POST':
        # Récupérer les informations de connexion à partir des données de requête
        request_data = request.body
        data = json.loads(request_data)
        # Récupérer le nom de la base de données à partir des données de requête

        # Établir une connexion à la base de données
        conn = mysql.connector.connect(
            host=data['host'],
            user=data['user'],
            password=data['password'],
            database=data['selectedDb'],
        )

        if conn is not None:
            # exécuter la requête pour récupérer les noms de toutes les tables de la base de données
            cursor = conn.cursor()
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()

            # fermer la connexion
            cursor.close()
            conn.close()

            # retourner les noms de toutes les tables de la base de données en tant que réponse JSON
            response_data = {'tables': tables}
            return JsonResponse(response_data)
        else:
            # retourner un message d'erreur si la connexion à la base de données échoue
            response_data = {'error': 'Impossible de se connecter à la base de données.'}
            return JsonResponse(response_data)
    else:
        # retourner une réponse d'erreur si la méthode de requête n'est pas POST
        response_data = {'error': 'Invalid request method.'}
        return JsonResponse(response_data)

      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
        
