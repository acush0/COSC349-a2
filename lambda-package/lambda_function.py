import pymysql
import json
from datetime import datetime

db_host = 'YOUR_RDS_ENDPOINT'
db_user = 'admin'
db_password = 'YOUR_PASSWORD'
db_name = 'example'

# Connect to the RDS instance
def connect_rds():
    try:
        connection = pymysql.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )
        return connection
    except pymysql.MySQLError as e:
        print(f"ERROR: Could not connect to MySQL instance: {e}")
        return None

def delete_expired_tasks(connection):
    try:
        with connection.cursor() as cursor:
            # Query to delete assignments for tasks that will be deleted
            delete_assignments_query = """
            DELETE FROM assigned
            WHERE taskID IN (
                SELECT taskID FROM task WHERE completed = 1 AND requestedDate < %s
            )
            """
            current_date = datetime.now().strftime('%Y-%m-%d')
            cursor.execute(delete_assignments_query, (current_date,))
            connection.commit()
            print(f"Deleted {cursor.rowcount} assignments for expired tasks.")

            #delete the expired tasks
            delete_tasks_query = """
            DELETE FROM task
            WHERE completed = 1 AND requestedDate < %s
            """
            cursor.execute(delete_tasks_query, (current_date,))
            connection.commit()
            print(f"Deleted {cursor.rowcount} expired tasks.")
            return cursor.rowcount
    except Exception as e:
        print(f"ERROR: Failed to delete expired tasks: {e}")
        return 0

def lambda_handler(event, context):
    # Connect to the RDS instance
    connection = connect_rds()
    
    if connection:
        deleted_rows = delete_expired_tasks(connection)
        connection.close()
        return {
            'statusCode': 200,
            'body': json.dumps(f"Deleted {deleted_rows} expired tasks.")
        }
    else:
        return {
            'statusCode': 500,
            'body': json.dumps("Failed to connect to the database.")
        }
