"""
Run this ONCE on your Render Postgres to add missing Payment columns.

Usage: python manage.py shell < add_payment_columns.py

Or paste this into your Render shell / django shell.
"""
from django.db import connection

with connection.cursor() as cursor:
    # Check and add payment_group
    cursor.execute("""
        ALTER TABLE accounting_payment 
        ADD COLUMN IF NOT EXISTS payment_group VARCHAR(100) NOT NULL DEFAULT '';
    """)
    print("payment_group: OK")

    # Check and add part_number
    cursor.execute("""
        ALTER TABLE accounting_payment 
        ADD COLUMN IF NOT EXISTS part_number INTEGER NOT NULL DEFAULT 1;
    """)
    print("part_number: OK")

    # Check and add total_parts
    cursor.execute("""
        ALTER TABLE accounting_payment 
        ADD COLUMN IF NOT EXISTS total_parts INTEGER NOT NULL DEFAULT 1;
    """)
    print("total_parts: OK")

print("\nAll columns added. The accountant dashboard should now work.")
print("You can also run: python manage.py migrate --fake-initial")
print("to bring migrations back in sync.")