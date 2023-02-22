
# Create your views here.
import json
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db import connection

# Create your views here.
from django.http import HttpResponse
import mysql.connector
@csrf_exempt
# Endpoint to test database connection
def test_connection(request):
        
         # get the request data as JSON
    request_data = request.body
    data = json.loads(request_data)
        # Connect to the database
         # establish a connection to the database
    conn = mysql.connector.connect(
        host=data['host'],
        user=data['user'],
        password=data['password'],
        database=data['database'],
    )
    cursor = conn.cursor()
    cursor.execute("SHOW DATABASES;")
    databases = cursor.fetchall()
    databases = [database[0] for database in databases]
    data['databases'] = databases
    
        # Return success message with query result
    if conn.is_connected():
        return HttpResponse("Connected to the database!")
    else:
        return HttpResponse("Error connecting to the database.")

@csrf_exempt
def show_tables(request):
    if request.method == 'GET':
        host = request.GET.get('host')
        user = request.GET.get('user')
        password = request.GET.get('password')
        database = request.GET.get('database')

        # Establish a new database connection
        conn = connection.connect(
            host=host,
            user=user,
            password=password,
            database=database,
        )
        cursor = conn.cursor()

        # Execute the query to get the tables
        cursor.execute("SHOW TABLES")

        # Fetch the table names
        tables = cursor.fetchall()

        # Close the database connection
        cursor.close()
        conn.close()

        # Convert the list of tuples to a dictionary
        table_dict = {}
        for table in tables:
            table_name = table[0]
            table_dict[table_name] = []

        # Create a dictionary of the fields for each table
        for table_name in table_dict:
            cursor = conn.cursor()
            cursor.execute("DESCRIBE {}".format(table_name))
            fields = cursor.fetchall()
            cursor.close()

            for field in fields:
                table_dict[table_name].append(field[0])

        # Return the table dictionary as a JSON response
        return JsonResponse(table_dict)

    # Return an error response if the request method is not GET
    return JsonResponse({'error': 'Invalid request method'})