#!/bin/bash

set -e

DB_FILE="dev.db"
MIGRATIONS_DIR="./migrations"
MIGRATION_TABLE="schema_migrations"

# Ensure database file exists
if [ ! -f "$DB_FILE" ]; then
  echo "Creating SQLite DB at $DB_FILE"
  sqlite3 "$DB_FILE" "VACUUM;"
fi

# Create migration tracking table if it doesn't exist
sqlite3 "$DB_FILE" <<EOF
CREATE TABLE IF NOT EXISTS $MIGRATION_TABLE (
  id TEXT PRIMARY KEY,
  applied_at TEXT DEFAULT CURRENT_TIMESTAMP
);
EOF

# Apply migrations in sorted order
for migration in $(ls "$MIGRATIONS_DIR"/*.sql | sort); do
  filename=$(basename "$migration")
  
  # Check if migration already applied
  already_applied=$(sqlite3 "$DB_FILE" "SELECT COUNT(1) FROM $MIGRATION_TABLE WHERE id = '$filename';")

  if [ "$already_applied" -eq 0 ]; then
    echo "Applying migration: $filename"
    if sqlite3 "$DB_FILE" < "$migration"; then
      sqlite3 "$DB_FILE" "INSERT INTO $MIGRATION_TABLE (id) VALUES ('$filename');"
      echo "✅ Applied $filename"
    else
      echo "❌ Failed to apply $filename"
      exit 1
    fi
  else
    echo "⏭️  Skipping already applied migration: $filename"
  fi
done

echo "🎉 All migrations applied successfully."
