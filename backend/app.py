from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Database connection
def get_db_connection():
    return psycopg2.connect(
        dbname="bank_chatbot",
        user="postgres",
        password="*****",
        host="localhost",
        port="5432"
    )

@app.route('/authenticate', methods=['POST'])
def authenticate_user():
    data = request.json
    account_number = data.get('account_number')
    passkey = data.get('passkey')
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute(
        "SELECT * FROM users WHERE account_number = %s AND passkey = %s",
        (account_number, passkey)
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if user:
        return jsonify({"status": "success", "message": "Authentication successful!"})
    else:
        return jsonify({"status": "error", "message": "Invalid credentials!"}), 401

@app.route('/balance', methods=['POST'])
def get_balance():
    data = request.json
    account_number = data.get('account_number')
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("SELECT balance FROM users WHERE account_number = %s", (account_number,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if user:
        return jsonify({"status": "success", "balance": user['balance']})
    else:
        return jsonify({"status": "error", "message": "Account not found!"}), 404

@app.route('/transactions', methods=['POST'])
def get_transactions():
    data = request.json
    account_number = data.get('account_number')
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute(
        "SELECT transaction_date, transfer_method, amount FROM transactions WHERE account_number = %s ORDER BY transaction_date DESC LIMIT 5",
        (account_number,)
    )
    transactions = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify({"status": "success", "transactions": transactions})

if __name__ == '__main__':
    app.run(debug=True)