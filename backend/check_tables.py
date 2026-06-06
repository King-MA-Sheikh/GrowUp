import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'growup_backend.settings')
django.setup()

from django.db import connection

def check_tables():
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        """)
        tables = cursor.fetchall()
        
        print("Tables in database:")
        for table in tables:
            print(f"  - {table[0]}")
        
        # Check specifically for users table
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'users'
            )
        """)
        users_exists = cursor.fetchone()[0]
        print(f"\nUsers table exists: {users_exists}")

if __name__ == '__main__':
    check_tables()