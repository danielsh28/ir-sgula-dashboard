#!/bin/bash

echo "Waiting for server to be ready at http://localhost:3001..."

# Function to check if server is up
check_server() {
    curl --silent --head http://localhost:3001 > /dev/null
    return $?
}

# Wait for server to be available
while ! check_server; do
    echo "Server not ready yet, waiting 5 seconds..."
    sleep 5
done

echo "Server is up! Executing ingest command..."

# Execute the curl command
echo "Ingesting ezer.txt"
curl --location 'http://localhost:3001/api/chat/ingest' \
    --form 'data=@"/Users/danielshely/ezer.txt"'

echo "Ingesting ezer2.txt"
curl --location 'http://localhost:3001/api/chat/ingest' \
 --form 'data=@"/Users/danielshely/ezer2.txt"'

echo "Ingest command executed!" 