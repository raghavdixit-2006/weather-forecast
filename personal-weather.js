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
    
    // Get current location using geolocation API
    function getCurrentLocationWeather() {
        if (navigator.geolocation) {
            currentCity.textContent = 'Detecting location...';
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // Get weather data using coordinates
                    fetch(`${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=${userSettings.unit === 'celsius' ? 'metric' : 'imperial'}&appid=${API_KEY}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Weather data not available');
                            }
                            return response.json();
                        })
                        .then(data => {
                            // Get forecast data
                            return fetch(`${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&units=${userSettings.unit === 'celsius' ? 'metric' : 'imperial'}&appid=${API_KEY}`)
                                .then(response => response.json())
                                .then(forecastData => {
                                    // Get air quality data
                                    return fetch(`${BASE_URL}/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
                                        .then(response => response.json())
                                        .then(aqiData => {
                                            // Combine all data
                                            const combinedData = {
                                                current: data,
                                                forecast: forecastData,
                                                airQuality: aqiData,
                                                location: {
                                                    name: data.name,
                                                    country: data.sys.country,
                                                    state: data.sys.state || ''
                                                }
                                            };
                                            updateWeatherDisplay(combinedData);
                                        });
                                });
                        })
                        .catch(error => {
                            console.error('Error fetching weather data:', error);
                            showNotification('Failed to fetch weather data. Please try again later.');
                        });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    showNotification('Location access denied. Using default location (London).');
                    // Use London as default location
                    getWeatherByLocation('London');
                }
            );
        } else {
            showNotification('Geolocation is not supported by your browser. Using default location (London).');
            getWeatherByLocation('London');
        }
    }
    
    // Function to use mock data
    function useMockData() {
        const mockLocation = {
            name: 'Test City',
            country: 'Test Country',
            state: 'Test State'
        };
        
        const combinedData = {
            current: mockWeatherData.current,
            forecast: mockWeatherData.forecast,
            airQuality: mockWeatherData.airQuality,
            location: mockLocation
        };
        
        currentWeatherData = combinedData;
        updateWeatherDisplay(combinedData);
    }
    
    // Modified fetchWeatherData function
    function fetchWeatherData(lat, lon, cityName, country, state) {
        // If API key is not set, use mock data
        if (API_KEY === 'YOUR_API_KEY_HERE') {
            console.log('Using mock data since API key is not set');
            useMockData();
            return;
        }
        
        // Show loading state
        currentCity.textContent = 'Loading...';
        
        // Weather data endpoint with units based on user preference
        const units = userSettings.unit === 'celsius' ? 'metric' : 'imperial';
        
        Promise.all([
            // Current weather
            fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`),
            // 5-day forecast (3-hour intervals)
            fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`),
            // Air quality
            fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        ])
        .then(async ([currentRes, forecastRes, aqiRes]) => {
            if (!currentRes.ok || !forecastRes.ok || !aqiRes.ok) {
                throw new Error('Failed to fetch weather data');
            }
            
            const currentData = await currentRes.json();
            const forecastData = await forecastRes.json();
            const aqiData = await aqiRes.json();
            
            console.log('Raw forecast data:', forecastData);
            
            // Process forecast data
            const dailyForecasts = [];
            const hourlyForecasts = [];
            
            // Get the first 5 days (one entry per day at noon)
            const today = new Date();
            today.setHours(12, 0, 0, 0);
            
            // Group forecast data by day
            const forecastsByDay = {};
            forecastData.list.forEach(item => {
                const date = new Date(item.dt * 1000);
                const dayKey = date.toLocaleDateString();
                
                if (!forecastsByDay[dayKey]) {
                    forecastsByDay[dayKey] = [];
                }
                forecastsByDay[dayKey].push(item);
            });
            
            // Get one forecast per day (at noon if available, otherwise closest to noon)
            Object.keys(forecastsByDay).slice(0, 5).forEach(dayKey => {
                const dayForecasts = forecastsByDay[dayKey];
                const noonForecast = dayForecasts.find(item => {
                    const hour = new Date(item.dt * 1000).getHours();
                    return hour >= 12 && hour <= 14;
                }) || dayForecasts[Math.floor(dayForecasts.length / 2)];
                
                if (noonForecast) {
                    dailyForecasts.push({
                        dt: noonForecast.dt,
                        temp: { day: noonForecast.main.temp },
                        weather: noonForecast.weather
                    });
                }
            });
            
            // Get the next 24 hours
            const now = new Date();
            const next24Hours = forecastData.list
                .filter(item => {
                    const itemDate = new Date(item.dt * 1000);
                    return itemDate > now && itemDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000);
                })
                .slice(0, 24);
            
            next24Hours.forEach(hour => {
                hourlyForecasts.push({
                    dt: hour.dt,
                    temp: hour.main.temp,
                    weather: hour.weather
                });
            });
            
            console.log('Processed daily forecasts:', dailyForecasts);
            console.log('Processed hourly forecasts:', hourlyForecasts);
            
            // Combine all data
            const combinedData = {
                current: currentData,
                forecast: {
                    daily: dailyForecasts,
                    hourly: hourlyForecasts
                },
                airQuality: aqiData,
                location: {
                    name: cityName,
                    country: country,
                    state: state
                }
            };
            
            // Store current data in the app state
            currentWeatherData = combinedData;
            
            // Update the UI
            updateWeatherDisplay(combinedData);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            showNotification('Failed to fetch weather data. Please try again later.');
            currentCity.textContent = 'Error loading weather';
        });
    }
    
    // Update the weather display with fetched data
    function updateWeatherDisplay(data) {
        if (!data || !data.current || !data.forecast) {
            console.error('Invalid weather data:', data);
            return;
        }

        const { current, forecast, location } = data;
        
        // Update location
        currentCity.textContent = location.name;
        if (location.state) {
            currentCity.textContent += `, ${location.state}`;
        }
        if (location.country) {
            currentCity.textContent += `, ${location.country}`;
        }
        
        // Update current date
        const now = new Date();
        currentDate.textContent = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Update current weather
        const temp = userSettings.unit === 'celsius' 
            ? Math.round(current.main.temp) 
            : Math.round((current.main.temp * 9/5) + 32);
        const feelsLikeTemp = userSettings.unit === 'celsius'
            ? Math.round(current.main.feels_like)
            : Math.round((current.main.feels_like * 9/5) + 32);
        
        currentTemp.textContent = `${temp}°${userSettings.unit === 'celsius' ? 'C' : 'F'}`;
        weatherDescription.textContent = current.weather[0].description;
        feelsLike.textContent = `${feelsLikeTemp}°${userSettings.unit === 'celsius' ? 'C' : 'F'}`;
        
        // Update weather icon
        const weatherIconCode = current.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;
        weatherIcon.alt = current.weather[0].description;
        
        // Update additional weather details
        humidity.textContent = `${current.main.humidity}%`;
        
        // Convert wind speed based on unit preference
        const windSpeedValue = userSettings.unit === 'celsius' 
            ? (current.wind.speed * 3.6).toFixed(1)  // Convert m/s to km/h
            : (current.wind.speed * 2.237).toFixed(1); // Convert m/s to mph
        const speedUnit = userSettings.unit === 'celsius' ? 'km/h' : 'mph';
        windSpeed.textContent = `${windSpeedValue} ${speedUnit}`;
        
        pressure.textContent = `${current.main.pressure} hPa`;
        
        // Convert visibility to km or miles
        const visibilityValue = userSettings.unit === 'celsius'
            ? (current.visibility / 1000).toFixed(1)  // Convert meters to km
            : (current.visibility / 1609.34).toFixed(1); // Convert meters to miles
        const visUnit = userSettings.unit === 'celsius' ? 'km' : 'mi';
        visibility.textContent = `${visibilityValue} ${visUnit}`;
        
        // Update UV Index if available
        if (current.uvi !== undefined) {
            const uvIndex = Math.round(current.uvi);
            document.getElementById('uv-index').textContent = uvIndex;
            
            // Add UV Index description based on the value
            let uvDescription = '';
            if (uvIndex <= 2) {
                uvDescription = 'Low';
            } else if (uvIndex <= 5) {
                uvDescription = 'Moderate';
            } else if (uvIndex <= 7) {
                uvDescription = 'High';
            } else if (uvIndex <= 10) {
                uvDescription = 'Very High';
            } else {
                uvDescription = 'Extreme';
            }
            document.getElementById('uv-index').title = uvDescription;
        } else {
            document.getElementById('uv-index').textContent = '--';
            document.getElementById('uv-index').title = 'UV Index not available';
        }
        
        // Update 5-day forecast
        const forecastContainer = document.getElementById('forecast-container');
        forecastContainer.innerHTML = '';
        
        console.log('Updating forecast display with:', forecast.daily);
        
        if (forecast.daily && forecast.daily.length > 0) {
            forecast.daily.forEach(day => {
                const forecastItem = document.createElement('div');
                forecastItem.className = 'forecast-item';
                
                const date = new Date(day.dt * 1000);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                
                const temp = userSettings.unit === 'celsius'
                    ? Math.round(day.temp.day)
                    : Math.round((day.temp.day * 9/5) + 32);
                
                forecastItem.innerHTML = `
                    <p class="day">${dayName}</p>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}">
                    <p class="temp">${temp}°${userSettings.unit === 'celsius' ? 'C' : 'F'}</p>
                    <p class="description">${day.weather[0].description}</p>
                `;
                
                forecastContainer.appendChild(forecastItem);
            });
        } else {
            console.error('No daily forecast data available');
            forecastContainer.innerHTML = '<p>No forecast data available</p>';
        }
        
