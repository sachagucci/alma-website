require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.MISTRAL_API_KEY;
console.log('Raw key:', JSON.stringify(apiKey));
console.log('Key length:', apiKey?.length);
console.log('Starts with quote:', apiKey?.startsWith('"'));
console.log('Ends with quote:', apiKey?.endsWith('"'));

// Test the key
(async () => {
    const response = await fetch('https://api.mistral.ai/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    console.log('API Status:', response.status);
    const data = await response.json();
    console.log('Response:', response.status === 200 ? 'SUCCESS - API key is valid!' : JSON.stringify(data));
})();
