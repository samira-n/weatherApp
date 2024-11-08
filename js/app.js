function getWeather() {
    const apiKey = '892845be314b3f2d3a8c8281b5e0bf97';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    // URL для текущей погоды и прогноза
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;


    // Запрос на текущую погоду
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            // Отображаем погоду, вызывая функцию displayWeather
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });


    // Запрос на почасовой прогноз    
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            // Отображаем почасовой прогноз
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    // Получаем элементы, где будем отображать данные о погоде
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Очищаем предыдущую информацию
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    // Проверка кода, чтобы определить, найден ли город
    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        // Извлекаем и форматируем данные о погоде
        const cityName = data.name;
        // Конвертация температуры в Цельсий
        const temperature = Math.round(data.main.temp - 273.15); 
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        // Генерируем HTML для отображения температуры и другой информации
        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        // Отображаем информацию в соответствующих элементах
        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        // Показать иконку погоды
        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Берем данные на ближайшие 24 часа (8 записей по 3 часа)
    const next24Hours = hourlyData.slice(0, 8); 

    // Проходим по каждому часу прогноза
    next24Hours.forEach(item => {
        // Преобразуем время Unix в дату
        const dateTime = new Date(item.dt * 1000); 
        // Получаем час из даты
        const hour = dateTime.getHours();
        // Конвертация температуры в Цельсий
        const temperature = Math.round(item.main.temp - 273.15); 
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        // Создаем HTML для каждого почасового прогноза
        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        // Добавляем каждый элемент в блок с почасовым прогнозом
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; 
}