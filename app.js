const API_KEY = '0ce7524a2107c97ceb90a85e7711636b'
const lang = window.navigator.language.slice(0, 2)
const citySearch = document.getElementById('citySearch')
const citiesList = document.getElementById('citiesList')
const timeZoneOffsetSeconds = new Date().getTimezoneOffset() * -1 * 60
const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit'
})
const weatherList = []
if (!localStorage.cities) {
    localStorage.cities = JSON.stringify([])
}
const citiesLS = JSON.parse(localStorage.cities)

getWeatherBySavedCities(citiesLS)

citySearch.addEventListener('submit', event => {
    event.preventDefault()
    const cityName = event.target.citySearch.value
    getDataByCityName(cityName)
    event.target.reset()
})

function getWeatherBySavedCities(citiesIdList) {
    citiesIdList.forEach(city => {
        getDataByCityId(city.id)
    });
}

function getDataByCityName(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lang=${lang}&q=${cityName}&appid=${API_KEY}
    `
    getData(url, data => {
        console.log(data);
        const exist = citiesLS.find(city => city.id === data.id)
        if (!exist) {
            citiesLS.push({ id: data.id, timestamp: Date.now() })
            localStorage.cities = JSON.stringify(citiesLS)
            getDataByCityId(data.id)
        }
    })
}
function getDataByCityId(cityId) {
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lang=${lang}&id=${cityId}&appid=${API_KEY}
    `
    const url2 = `https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=${lang}&id=${cityId}&appid=${API_KEY}
    `
    getData(url, data => {
        console.log(data);
        const timestamp = citiesLS.find(city => city.id === cityId).timestamp
        getData(url2, forecast => {
            weatherList.push({ timestamp, data: { ...data, forecast: forecast.list } })
            addCities(citiesList, weatherList)
        })

    })
}
async function getData(url, cb) {
    try {
        const response = await fetch(url)
        if (response.ok) {
            const data = await response.json()
            cb(data)
        }
    } catch (error) {
        console.warn(error);
    }
}
function addCities(elem, cities) {
    console.log(cities);
    cities.sort((a, b) => (a.timestamp - b.timestamp) * -1)
    let cityHtml = ''
    cities.forEach(city => {
        cityHtml += renderCity(city.data)
    });
    elem.innerHTML = cityHtml
}
function renderCity(data) {
    const html =
        `<div class="city-section">
        <div class="city-info">
                <div class="left-temp">
                  <div class="tempr">
                    <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="rain">
                    <div>${Math.round(data.main.temp)} °C</div>
                    </div>
                    <div class="name-city">${data.name}</div>
                <div class="day-time">Sunrise: ${timeFormatter.format((data.sys.sunrise - timeZoneOffsetSeconds + data.timezone) * 1000)}<br> Sunset: ${timeFormatter.format((data.sys.sunset - timeZoneOffsetSeconds + data.timezone) * 1000)}</div>
                    <div class="type-wheather">${data.weather[0].description}</div>
                    <div>Чувствуется как: ${Math.round(data.main.feels_like)} °C</div>
                    <div>Влажность: ${data.main.humidity} %</div>
                    <div>Ветер: ${Math.round(data.wind.speed * 3.6)} км/ч <span class="wind-dir" style="transform: rotate(${data.wind.deg}deg)">&#129045;</span></div>
                </div>
                <div class="right-more-info">
                    <div class="temp-wrap">
                    <div class="temp" style="height: ${Math.round(data.forecast[0].main.temp)}%" > <div class="degre">${Math.round(data.forecast[0].main.temp)} °C</div></div>
                    <div class="temp" style="height: ${Math.round(data.forecast[1].main.temp)}%" > <div class="degre">${Math.round(data.forecast[1].main.temp)} °C</div></div>
                    <div class="temp" style="height: ${Math.round(data.forecast[2].main.temp)}%" > <div class="degre">${Math.round(data.forecast[2].main.temp)} °C</div></div>
                    <div class="temp" style="height: ${Math.round(data.forecast[3].main.temp)}%" > <div class="degre">${Math.round(data.forecast[3].main.temp)} °C</div></div>
                    <div class="temp" style="height: ${Math.round(data.forecast[4].main.temp)}%" > <div class="degre">${Math.round(data.forecast[4].main.temp)} °C</div></div>
                    </div>
                    <div class="temp-hours">
                    ${renderCityForecast(data.forecast, data.timezone)}
                </div>
            </div>
        </div>
    </div>`
    return html
}

function renderCityForecast(forecast, timezone) {
    let forecastHtml = ''
    for (let i = 0; i < 5; i++) {
        const part = forecast[i];
        forecastHtml += `<div class="info-day">
        <div class="data">${timeFormatter.format((part.dt - timeZoneOffsetSeconds + timezone) * 1000)}</div>
        <img src="http://openweathermap.org/img/w/${part.weather[0].icon}.png" alt="rain">
    </div>`
    }
    return forecastHtml
}