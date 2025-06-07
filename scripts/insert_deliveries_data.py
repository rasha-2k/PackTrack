import csv
from pathlib import Path
import mysql.connector
from datetime import datetime
from dotenv import load_dotenv
import os

def convert_date(date_str):
    """Convert to 'YYYY-MM-DD' (MySQL DATE format) from various formats."""
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try:
            return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None

load_dotenv()

config = {
    'host': 'localhost',
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME')
}

csv_file_path = Path(__file__).resolve().parent.parent / 'app' / 'data' / 'MOCK_Deliveries_DATA.csv'

# Update the columns to include 'delivered_at', 'expected_delivery_date', and 'received_at'
columns = ['id', 'user_id', 'tracking_number', 'courier_service', 'origin', 'destination', 
            'status', 'delivered_at', 'expected_delivery_date', 'received_at', 
            'category', 'created_at', 'updated_at']


try:
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)  # Reading CSV
        for row in reader:
            # Ensure user_id exists in the users table
            cursor.execute("SELECT COUNT(*) FROM users WHERE id = %s", (row['user_id'],))
            user_exists = cursor.fetchone()[0]

            if not user_exists:
                # Insert placeholder user if user_id does not exist
                cursor.execute(
                    "INSERT INTO users (id, name, email, password) VALUES (%s, %s, %s, %s)",
                    (row['user_id'], f"User{row['user_id']}", f"user{row['user_id']}@example.com", "password123")
                )

            row['delivered_at'] = convert_date(row['delivered_at'])
            row['expected_delivery_date'] = convert_date(row['expected_delivery_date'])
            row['received_at'] = convert_date(row['received_at'])
            row['created_at'] = convert_date(row['created_at'])
            row['updated_at'] = convert_date(row['updated_at'])

            values = [row[col] for col in columns] 

            sql = f"""
                INSERT INTO deliveries ({', '.join(columns)})
                VALUES ({', '.join(['%s'] * len(columns))})
            """
            cursor.execute(sql, values)

    conn.commit()
    print(f"CSV data inserted successfully into 'deliveries' table.")

except mysql.connector.Error as err:
    print(f"MySQL Error: {err}")

finally:
    if 'cursor' in locals():
        cursor.close()
    if 'conn' in locals():
        conn.close()
