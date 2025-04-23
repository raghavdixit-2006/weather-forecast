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
    
    // Initialize the app
    function initApp() {
        try {
        // Load user settings
        loadUserSettings();
        
        // Render favorite locations
        renderFavorites();
        
        // Set event listeners
        searchButton.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
        currentLocationButton.addEventListener('click', getCurrentLocationWeather);
        addToFavoritesButton.addEventListener('click', addCurrentToFavorites);
        addLocationButton.addEventListener('click', addLocationToFavorites);
        saveSettingsButton.addEventListener('click', saveUserSettings);
            
            // Theme toggle event listener
            themeToggle.addEventListener('change', (e) => {
                const newTheme = e.target.value;
                applyTheme(newTheme);
                // Save theme preference immediately
                userSettings.theme = newTheme;
                localStorage.setItem('weatherSettings', JSON.stringify(userSettings));
                showNotification('Theme updated successfully');
            });
        
        // Apply theme from settings
        applyTheme(userSettings.theme);
        
        // Try to get the user's location on page load
        getCurrentLocationWeather();
        } catch (error) {
            console.error('Error initializing app:', error);
            showNotification('Error initializing the application. Please refresh the page.');
        }
    }
    
    // Load user settings from localStorage
    function loadUserSettings() {
        // Apply saved settings to UI controls
        unitToggle.value = userSettings.unit;
        themeToggle.value = userSettings.theme;
        
        document.getElementById('show-humidity').checked = userSettings.displayOptions.humidity;
        document.getElementById('show-wind').checked = userSettings.displayOptions.wind;
        document.getElementById('show-pressure').checked = userSettings.displayOptions.pressure;
        document.getElementById('show-visibility').checked = userSettings.displayOptions.visibility;
        
        // Set username if available
        const username = localStorage.getItem('weatherUsername');
        if (username) {
            document.getElementById('username').textContent = username;
        }
    }
    
    // Save user settings to localStorage
    function saveUserSettings() {
        userSettings.unit = unitToggle.value;
        userSettings.theme = themeToggle.value;
        userSettings.displayOptions = {
            humidity: document.getElementById('show-humidity').checked,
            wind: document.getElementById('show-wind').checked,
            pressure: document.getElementById('show-pressure').checked,
            visibility: document.getElementById('show-visibility').checked
        };
        
        localStorage.setItem('weatherSettings', JSON.stringify(userSettings));
        
        // Apply settings immediately
        applyTheme(userSettings.theme);
        
        // Refresh current weather display with new settings
        if (currentWeatherData) {
            updateWeatherDisplay(currentWeatherData);
        }
        
        // Show success message
        showNotification('Settings saved successfully');
    }
    
    // Apply theme settings
    function applyTheme(theme) {
        const root = document.documentElement;
        const body = document.body;
        
        // Remove all theme classes first
        body.classList.remove('light-theme', 'dark-theme', 'auto-theme');
        
        if (theme === 'dark') {
            root.style.setProperty('--bg-color', '#1a1a1a');
            root.style.setProperty('--text-color', '#f0f0f0');
            root.style.setProperty('--card-bg', '#2a2a2a');
            root.style.setProperty('--border-color', '#404040');
            root.style.setProperty('--hover-color', '#333333');
            body.classList.add('dark-theme');
        } else if (theme === 'light') {
            root.style.setProperty('--bg-color', '#f5f7fa');
            root.style.setProperty('--text-color', '#333333');
            root.style.setProperty('--card-bg', '#ffffff');
            root.style.setProperty('--border-color', '#e0e0e0');
            root.style.setProperty('--hover-color', '#f0f0f0');
            body.classList.add('light-theme');
        } else if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
            body.classList.add('auto-theme');
            
            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (theme === 'auto') {
                    applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    // Handle search form submission
    function handleSearch() {
        const location = searchInput.value.trim();
        if (location) {
            getWeatherByLocation(location);
            searchInput.value = '';
        }
    }
    
    // Get weather by city name
    function getWeatherByLocation(location) {
        // First get coordinates for the location
        fetch(`${GEO_URL}/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Location not found');
                }
                return response.json();
            })
            .then(geoData => {
                if (geoData && geoData.length > 0) {
                    const { lat, lon, name, country, state } = geoData[0];
                    // Now get weather data using coordinates
                    return fetchWeatherData(lat, lon, name, country, state);
                } else {
                    throw new Error('Location not found');
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                showNotification('Failed to fetch weather data. Please try again later.');
            });
    }
    
