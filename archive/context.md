```javascript
const { Wit } = require('node-wit');

const client = new Wit({
    accessToken: 'YOUR_WIT_AI_ACCESS_TOKEN',
});

// Contoh fungsi untuk menangani pesan
const handleMessage = async (message) => {
    try {
        // Kirim pesan ke Wit.ai
        const response = await client.message(message, {});

        // Ambil intent dan entities dari respons
        const intent = response.intents[0]?.name || 'unknown';
        const entities = response.entities;

        // Buat konteks awal
        let context = {};

        // Proses intent
        if (intent === 'get_weather') {
            const location = entities['wit$location:location']?.[0]?.value;
            if (location) {
                context.location = location;
                context.nextStep = 'fetch_weather';
            } else {
                context.missingInfo = 'location';
                context.nextStep = 'ask_location';
            }
        }

        // Simulasikan pengambilan data cuaca
        if (context.nextStep === 'fetch_weather') {
            const weatherData = await fetchWeather(context.location); // Fungsi simulasi
            context.weatherData = weatherData;
            context.nextStep = 'provide_weather';
        }

        // Berikan respons berdasarkan konteks
        if (context.nextStep === 'provide_weather') {
            console.log(`Cuaca di ${context.location}: ${context.weatherData.condition}, Suhu: ${context.weatherData.temperature}°C`);
        } else if (context.nextStep === 'ask_location') {
            console.log('Di kota mana Anda ingin mengetahui cuacanya?');
        }

        console.log('Konteks saat ini:', context);
    } catch (err) {
        console.error('Error:', err);
    }
};

// Fungsi simulasi untuk mengambil data cuaca
const fetchWeather = async (location) => {
    // Simulasikan API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                temperature: 25,
                condition: 'Sunny',
            });
        }, 1000);
    });
};

// Jalankan fungsi dengan pesan contoh
handleMessage('Apa cuaca di Jakarta?');

