#!/bin/bash

echo "Waiting for server to be ready at http://localhost:3001..."

# Function to check if server is up
check_server() {
    curl --silent --head http://localhost:3000 > /dev/null
    return $?
}

# Wait for server to be available
while ! check_server; do
    echo "Server not ready yet, waiting 2 seconds..."
    sleep 2
done

echo "Server is up! Executing ingest command..."

# # Execute the curl command
echo "Ingesting ezer.txt"
curl -s --location 'http://localhost:3000/api/chat/ingest' \
    --form 'data=@"/Users/danielshely/ezer.txt"'

echo "Ingesting ezer2.txt"
curl -s --location 'http://localhost:3000/api/chat/ingest' \
 --form 'data=@"/Users/danielshely/ezer2.txt"'

#  echo "Ingesting open_closed.txt"
# curl -s --location 'http://localhost:3000/api/chat/ingest' \
#  --form 'data=@"/Users/danielshely/open_closed.txt"

echo "Ingest command executed!" 