import csv
from pathlib import Path
import mysql.connector
from datetime import datetime
from dotenv import load_dotenv
import os

def convert_date(date_str):
    try:
        return datetime.strptime(date_str, "%d/%m/%Y").strftime("%Y-%m-%d %H:%M:%S")
    except ValueError:
        return None  # handle missing or bad values gracefully

load_dotenv()  


config = {
    'host': 'localhost',
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME')
}

csv_file_path = Path(__file__).resolve().parent.parent / 'backend' / 'database' / 'MOCK_Deliveries_DATA.csv'

columns = ['id', 'user_id', 'tracking_number', 'courier_service', 'origin', 'destination', 'status','created_at','updated_at']

try:
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile) 
        for row in reader:
            row['created_at'] = convert_date(row['created_at'])
            row['updated_at'] = convert_date(row['updated_at'])
            values = [row[col] for col in columns] 
            sql = f"""
                INSERT INTO deliveries ({', '.join(columns)})
                VALUES ({', '.join(['%s'] * len(columns))})
            """
            cursor.execute(sql, values)

    conn.commit()
    print(f" CSV data inserted successfully into 'deliveries' table.")

except mysql.connector.Error as err:
    print(f" MySQL Error: {err}")

finally:
    if 'cursor' in locals():
        cursor.close()
    if 'conn' in locals():
        conn.close()