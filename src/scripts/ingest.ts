import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch';

async function ingestFile(filePath: string) {
  try {
    // Verify file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Create form data
    const formData = new FormData();
    formData.append('data', fs.createReadStream(filePath));

    // Make API call
    const response = await fetch('http://localhost:3001/api/chat/ingest', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`API call failed: ${JSON.stringify(result)}`);
    }

    console.log('File ingested successfully:', result);
  } catch (error) {
    console.error('Error ingesting file:', error);
    process.exit(1);
  }
}

// Get file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide a file path as an argument');
  process.exit(1);
}

// Run the ingestion
ingestFile(filePath);
