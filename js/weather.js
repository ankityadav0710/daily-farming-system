/**
 * Daily Farming Management System - Weather Module
 * Handles OpenWeather API integration with a robust fallback to local mock data.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. Configuration & DOM Elements
       ========================================================================== */
    // Replace this with your actual OpenWeatherMap API key for live data
    const API_KEY = "cbc81278eb69976933f72fe6cf6fdd67"; 

    // Inputs & Status
    const cityInput = document.getElementById("cityInput");
    const searchBtn = document.getElementById("searchBtn");
    const apiStatus = document.getElementById("apiStatus");

    // Dashboard UI Elements
    const cityNameEl = document.getElementById("cityName");
    const currentDateEl = document.getElementById("currentDate");
    const tempEl = document.getElementById("temperature");
    const iconEl = document.getElementById("weatherIcon");
    const descEl = document.getElementById("description");
    const humidityEl = document.getElementById("humidity");
    const windEl = document.getElementById("windSpeed");
    const feelsLikeEl = document.getElementById("feelsLike");
    const rainEl = document.getElementById("rainfall");

    /* ==========================================================================
       2. Helper Functions
       ========================================================================== */
    // Set formatted current date
    function setCurrentDate() {
        if (!currentDateEl) return;
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateEl.textContent = new Date().toLocaleDateString('en-IN', options);
    }

    // Local Seasonal Backup Data Generator (Mock Data Engine)
    // Generates realistic numbers based on the city name to simulate live data
    const getMockData = (city) => {
        const charCodeSum = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        // Base math off the string characters to make different cities yield different results
        const baseTemp = 20 + (charCodeSum % 15); 
        const humidity = 40 + (charCodeSum % 40);
        const wind = 5 + (charCodeSum % 15);
        const rain = (charCodeSum % 3 === 0) ? (charCodeSum % 10) : 0; // Simulate occasional rain
        
        let weatherDesc = "Clear Sky";
        let iconCode = "01d"; // clear sun icon
        
        if (rain > 0) {
            weatherDesc = "Moderate Rain";
            iconCode = "10d"; // rain icon
        } else if (humidity > 70) {
            weatherDesc = "Cloudy";
            iconCode = "04d"; // broken clouds icon
        } else if (baseTemp > 30) {
            weatherDesc = "Sunny & Hot";
            iconCode = "01d";
        }

        return {
            name: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
            main: {
                temp: baseTemp,
                feels_like: baseTemp + 2,
                humidity: humidity
            },
            weather: [{
                description: weatherDesc,
                icon: iconCode
            }],
            wind: {
                speed: wind / 3.6 // m/s to match API logic below
            },
            rain: {
                "1h": rain
            }
        };
    };

    /* ==========================================================================
       3. UI Update Engine
       ========================================================================== */
    function updateUI(data, isLive) {
        if (!cityNameEl) return; // Prevent errors if running on a different page

        cityNameEl.textContent = data.name;
        tempEl.textContent = Math.round(data.main.temp);
        descEl.textContent = data.weather[0].description;
        humidityEl.textContent = `${data.main.humidity}%`;
        
        // Convert m/s to km/h for wind speed
        const windKmH = Math.round(data.wind.speed * 3.6);
        windEl.textContent = `${windKmH} km/h`;
        
        feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°C`;

        // Handle Rain (API payload sometimes omits rain object entirely if it's 0)
        let rainVolume = 0;
        if (data.rain && data.rain["1h"]) {
            rainVolume = data.rain["1h"];
        }
        rainEl.textContent = `${rainVolume} mm`;

        // Set OpenWeather Icon
        const iconCode = data.weather[0].icon;
        iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        // Update API Status Badge
        if (isLive) {
            apiStatus.textContent = "🟢 Live Weather Data via OpenWeather API";
            apiStatus.className = "api-status status-live";
        } else {
            apiStatus.textContent = "🟡 Using Local Seasonal Backup Module (API Key Missing/Failed)";
            apiStatus.className = "api-status status-mock";
        }
    }

    /* ==========================================================================
       4. Main Fetch Payload Logic
       ========================================================================== */
    async function fetchWeather(city) {
        try {
            // Throw immediate error if the key is the default placeholder or empty
            if (API_KEY === "YOUR_API_KEY_HERE" || API_KEY.trim() === "") {
                throw new Error("API Key not configured.");
            }

            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - City not found or limit reached.`);
            }

            const data = await response.json();
            updateUI(data, true); // true = Live Data

        } catch (error) {
            console.warn(`Weather API Payload Failed: ${error.message}. Switching to local backup module.`);
            
            // Generate fallback data
            const backupData = getMockData(city);
            updateUI(backupData, false); // false = Mock Data
        }
    }

    /* ==========================================================================
       5. Event Listeners & Initialization
       ========================================================================== */
    if (searchBtn && cityInput) {
        // Search button click
        searchBtn.addEventListener("click", () => {
            const city = cityInput.value.trim();
            if (city) {
                fetchWeather(city);
            }
        });

        // Enter key press in input field
        cityInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const city = cityInput.value.trim();
                if (city) {
                    fetchWeather(city);
                }
            }
        });
    }

    // Initialize the dashboard on page load if the elements exist
    if (document.getElementById("weatherDashboard")) {
        setCurrentDate();
        fetchWeather("Pune"); // Set a default farming-heavy district on load
    }
});