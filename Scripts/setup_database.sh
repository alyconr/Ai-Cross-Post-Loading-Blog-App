#!/bin/bash

# Database configuration
DB_USER="root"
DB_NAME="ai_blog_posts"
SQL_FILE="create_database.sql"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "MySQL is not installed. Please install MySQL first."
    exit 1
fi

# Check if SQL file exists
if [ ! -f "$SQL_FILE" ]; then
    echo "SQL file $SQL_FILE not found!"
    exit 1
fi



# Run the SQL script
echo "Creating database and tables..."
mysql -u "$DB_USER" -p << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME;
USE $DB_NAME;
source $SQL_FILE;
SHOW TABLES;
EOF

# Check if the script executed successfully
if [ $? -eq 0 ]; then
    echo "Database setup completed successfully!"
else
    echo "Error setting up database!"
    exit 1
fi