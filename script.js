const searchBtn = document.getElementById('searchBtn');
const searchBox = document.getElementById('searchBox');
const weatherInfo = document.getElementById('weatherInfo');

searchBtn.addEventListener('click', getWeather);
searchBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {
    const city = searchBox.value.trim();
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        weatherInfo.innerHTML = '<p>Loading...</p>';
        
        // Get coordinates from city name
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            weatherInfo.innerHTML = '<p>City not found. Please try again.</p>';
            return;
        }
        
        const { latitude, longitude, name, country } = geoData.results[0];
        
        // Get weather data
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`);
        const weatherData = await weatherResponse.json();
        
        displayWeather(weatherData, name, country);
    } catch (error) {
        weatherInfo.innerHTML = '<p>Error fetching weather data. Please try again.</p>';
        console.error(error);
    }
}

function displayWeather(data, city, country) {
    const temp = data.current.temperature_2m;
    const humidity = data.current.relative_humidity_2m;
    const windSpeed = data.current.wind_speed_10m;
    const weatherCode = data.current.weather_code;
    const weatherDesc = getWeatherDescription(weatherCode);
    
    weatherInfo.innerHTML = `
        <h2>${city}, ${country}</h2>
        <h3>${temp}°C</h3>
        <p>${weatherDesc}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} km/h</p>
    `;
}

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Foggy',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] || 'Unknown';
}