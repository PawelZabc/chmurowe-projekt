#!/bin/bash

out_file="all_files_contents.txt"

# Clear output file if it exists
> "$out_file"

# List of specific files
files=(
  "backend/app.js"
  "backend/database.js"
  "docker-compose.yml"
  "backend/Dockerfile"
  "frontend/Dockerfile"
  "init-db/init.sql"
)

# Function to append filename and content to out_file
append_file() {
  echo -e "\n=== $1 ===" >> "$out_file"
  cat "$1" >> "$out_file"
}

# Append listed files
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    append_file "$file"
  else
    echo "Warning: $file does not exist"
  fi
done

# Append all files under k8s recursively
find k8s -type f | while read -r filepath; do
  append_file "$filepath"
done

find frontend -type f | while read -r filepath; do
  append_file "$filepath"
done

echo "Contents saved to $out_file"
