require('dotenv').config({ path: '.env.local' });

async function testOCR() {
    const apiKey = process.env.MISTRAL_API_KEY;
    console.log('API Key present:', !!apiKey);
    console.log('API Key first 10 chars:', apiKey?.substring(0, 10));
    console.log('API Key length:', apiKey?.length);
    
    // Check if key has quotes
    if (apiKey?.startsWith('"') || apiKey?.endsWith('"')) {
        console.log('WARNING: API key has quotes - this will cause issues!');
    }
    
    // Test simple API call to list models
    try {
        const response = await fetch('https://api.mistral.ai/v1/models', {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        console.log('Models API Status:', response.status);
        const data = await response.json();
        console.log('Models response:', JSON.stringify(data).substring(0, 200));
    } catch (err) {
        console.error('Error:', err);
    }
}

testOCR();
