// Weather API Configuration
const API_KEY = '56c931f2347e26bdffcf671b5f284d4f'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Mock data for testing
const mockWeatherData = {
    current: {
        main: {
            temp: 25,
            feels_like: 27,
            humidity: 65,
            pressure: 1012
        },
        weather: [{
            main: 'Clear',
            description: 'clear sky',
            icon: '01d'
        }],
        wind: {
            speed: 3.5
        },
        visibility: 10000
    },
    forecast: {
        daily: [
            {
                dt: Date.now() / 1000,
                temp: { day: 25, night: 18 },
                weather: [{ icon: '01d', description: 'clear sky' }]
            },
            {
                dt: (Date.now() / 1000) + 86400,
                temp: { day: 26, night: 19 },
                weather: [{ icon: '02d', description: 'few clouds' }]
            },
            {
                dt: (Date.now() / 1000) + 172800,
                temp: { day: 24, night: 17 },
                weather: [{ icon: '03d', description: 'scattered clouds' }]
            }
        ],
        hourly: [
            {
                dt: Date.now() / 1000,
                temp: 25,
                weather: [{ icon: '01d', description: 'clear sky' }]
            },
            {
                dt: (Date.now() / 1000) + 3600,
                temp: 24,
                weather: [{ icon: '01d', description: 'clear sky' }]
            },
            {
                dt: (Date.now() / 1000) + 7200,
                temp: 23,
                weather: [{ icon: '01n', description: 'clear sky' }]
            }
        ]
    },
    airQuality: {
        list: [{
            main: {
                aqi: 2
            }
        }]
    }
};

// Check if API key is set
if (API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('Please replace the API_KEY with your own OpenWeather API key');
    document.getElementById('current-city').textContent = 'Please set up your API key';
    showNotification('Please set up your OpenWeather API key to use this application');
}

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu handler
    window.menubar = function() {
        const navUl = document.querySelector('nav ul');
        if (navUl.style.display === "block") {
            navUl.style.display = "none";
        } else {
            navUl.style.display = "block";
        }
    };

    // Initialize elements
    const searchInput = document.getElementById('location-search');
    const searchButton = document.getElementById('search-btn');
    const currentLocationButton = document.getElementById('current-location');
    const addToFavoritesButton = document.getElementById('add-to-favorites');
    const addLocationInput = document.getElementById('add-location');
    const addLocationButton = document.getElementById('add-btn');
    const saveSettingsButton = document.getElementById('save-settings');
    const favoriteLocationsContainer = document.getElementById('favorite-locations');
    const forecastContainer = document.getElementById('forecast-container');
    const hourlyContainer = document.getElementById('hourly-container');
    const unitToggle = document.getElementById('unit-toggle');
    const themeToggle = document.getElementById('dashboard-theme');
    
    // Weather display elements
    const currentCity = document.getElementById('current-city');
    const currentDate = document.getElementById('current-date');
    const weatherIcon = document.getElementById('weather-icon');
    const currentTemp = document.getElementById('current-temp');
    const weatherDescription = document.getElementById('weather-description');
    const feelsLike = document.getElementById('feels-like');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');
    const pressure = document.getElementById('pressure');
    const visibility = document.getElementById('visibility');
    const uvIndex = document.getElementById('uv-index');
    const aqiValue = document.getElementById('aqi-value');
    const aqiDescription = document.getElementById('aqi-description');
    const aqiMeter = document.getElementById('aqi-meter');
    
    // User settings and state
    let currentWeatherData = null;
    let favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
    let userSettings = JSON.parse(localStorage.getItem('weatherSettings')) || {
        unit: 'celsius',
        theme: 'light',
        displayOptions: {
            humidity: true,
            wind: true,
            pressure: true,
            visibility: true
        }
    };
 