import csv
from pathlib import Path
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()  


config = {
    'host': 'localhost',
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME')
}

csv_file_path = Path(__file__).resolve().parent.parent / 'backend' / 'database' / 'MOCK_Users_DATA.csv'

columns = ['id','name','email','password','role']

try:
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile) 
        for row in reader:
            values = [row[col] for col in columns] 
            sql = f"""
                INSERT INTO users ({', '.join(columns)})
                VALUES ({', '.join(['%s'] * len(columns))})
            """
            cursor.execute(sql, values)

    conn.commit()
    print(f" CSV data inserted successfully into 'users' table.")

except mysql.connector.Error as err:
    print(f" MySQL Error: {err}")

finally:
    if 'cursor' in locals():
        cursor.close()
    if 'conn' in locals():
        conn.close()