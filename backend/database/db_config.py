import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(
        dbname="bank_chatbot",  # Replace with your database name
        user="postgres",       # Replace with your PostgreSQL username
        password="**********", # Replace with your PostgreSQL password
        host="localhost",       # Use "localhost" for local development
        port="5432"             # Default PostgreSQL port
    )

def initialize_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    with open("database/db_setup.sql", "r") as file:
        cursor.execute(file.read())
    conn.commit()
    cursor.close()
    conn.close()
    print("Database initialized successfully.")