// weatherDashboard.js

const apiKey = 'f2c2661603d8f96757a81b3cfdd73892'; // Replace with your actual API key from OpenWeatherMap
const weatherDataDiv = document.getElementById('weather-data');
const forecastDataDiv = document.getElementById('forecast-data');
const searchBtn = document.getElementById('search-btn');

searchBtn.addEventListener('click', fetchWeatherData);

function fetchWeatherData() {
    const city = document.getElementById('city-input').value;
    if (city) {
        showSpinner();
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                hideSpinner();
                displayWeatherData(data);
            })
            .catch(error => {
                hideSpinner();
                showError(error);
            });
    }
}

function displayWeatherData(data) {
    if (data.cod === 200) {
        const { name, main, weather, wind } = data;
        const weatherHtml = `
            <h2>Current Weather in ${name}</h2>
            <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" class="weather-icon" alt="${weather[0].description}">
            <p>Temperature: ${main.temp}°C</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Weather: ${weather[0].description}</p>
            <p>Wind Speed: ${wind.speed} m/s</p>
        `;
        weatherDataDiv.innerHTML = weatherHtml;
        fetchWeatherForecast(data.coord.lat, data.coord.lon);
    } else {
        showError(data.message);
    }
}

function fetchWeatherForecast(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayWeatherForecast(data))
        .catch(error => showError(error));
}

function displayWeatherForecast(data) {
    let forecastHtml = '<h2>5-Day Forecast</h2>';
    for (let i = 0; i < data.list.length; i += 8) {
        const { dt_txt, main, weather } = data.list[i];
        forecastHtml += `
            <div>
                <h3>${dt_txt.split(' ')[0]}</h3>
                <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" class="weather-icon" alt="${weather[0].description}">
                <p>Temperature: ${main.temp}°C</p>
                <p>Weather: ${weather[0].description}</p>
            </div>
        `;
    }
    forecastDataDiv.innerHTML = forecastHtml;
}

function showError(error) {
    weatherDataDiv.innerHTML = `<p class="error">${error}</p>`;
    forecastDataDiv.innerHTML = '';
}

function showSpinner() {
    weatherDataDiv.innerHTML = '<div class="spinner"></div>';
    forecastDataDiv.innerHTML = '';
}

function hideSpinner() {
    weatherDataDiv.innerHTML = '';
}

