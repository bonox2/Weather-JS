const API_KEY = '0ce7524a2107c97ceb90a85e7711636b'
const citySearch = document.getElementById('citySearch')
const citiesList = document.getElementById('citiesList')
const timeZoneOffsetSeconds = new Date().getTimezoneOffset() * -1 * 60
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
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=${API_KEY}
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
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&id=${cityId}&appid=${API_KEY}
    `
    const url2 = `https://api.openweathermap.org/data/2.5/forecast?units=metric&id=${cityId}&appid=${API_KEY}
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
            <div class="city-temp">
                <div class="left-temp">
                    <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="rain">
                    <div class="temp">${Math.round(data.main.temp)} °C</div>
                    <div class="temp-day"> <div class="temp-max">${Math.round(data.main.temp_max)} °C</div>
                <div class="temp-min">${Math.floor(data.main.temp_min)} °C</div></div>
                </div>
                <div class="right-more-info">
                    <div>Чувствуется как: ${Math.round(data.main.feels_like)} °C</div>
                    <div>Влажность: ${data.main.humidity} %</div>
                    <div>Ветер: ${Math.round(data.wind.speed * 3.6)} км/ч</div>
                </div>
            </div>
            <div class="city-type">
                <div class="name-city">${data.name}</div>
                <div class="day-time">Sunrise: ${new Date((data.sys.sunrise - timeZoneOffsetSeconds + data.timezone) * 1000).toLocaleTimeString()}<br> Sunset: ${new Date((data.sys.sunset - timeZoneOffsetSeconds + data.timezone) * 1000).toLocaleTimeString()}</div>
                <div class="type-wheather">${data.weather[0].description}</div>
            </div>
        </div>
        <div class="temp-hours">
            <div class="info-day">
                <div class="data">${new Date((data.forecast[0].dt - timeZoneOffsetSeconds + data.timezone) * 1000).toLocaleTimeString()}</div>
                <img src="http://openweathermap.org/img/w/${data.forecast[0].weather[0].icon}.png" alt="rain">
                <div class="temp-day"> <div class="temp-max">${Math.round(data.forecast[0].main.temp_max)} °C</div>
                <div class="temp-min">${Math.floor(data.forecast[0].main.temp_min)} °C</div></div>
            </div>
            <div class="info-day">
                <div class="data">${new Date((data.forecast[1].dt - timeZoneOffsetSeconds + data.timezone) * 1000).toLocaleTimeString()}</div>
                <img src="http://openweathermap.org/img/w/${data.forecast[1].weather[0].icon}.png" alt="rain">
                <div class="temp-day"> <div class="temp-max">${Math.round(data.forecast[1].main.temp_max)} °C</div>
                <div class="temp-min">${Math.floor(data.forecast[1].main.temp_min)} °C</div></div>
            </div>
            <div class="info-day">
                <div class="data">${new Date((data.forecast[2].dt - timeZoneOffsetSeconds + data.timezone) * 1000).toLocaleTimeString()}</div>
                <img src="http://openweathermap.org/img/w/${data.forecast[2].weather[0].icon}.png" alt="rain">
                <div class="temp-day"> <div class="temp-max">${Math.round(data.forecast[2].main.temp_max)} °C</div>
                <div class="temp-min">${Math.floor(data.forecast[2].main.temp_min)} °C</div></div>
            </div>
            <div class="info-day">
                <div class="data">${new Date((data.forecast[3].dt - timeZoneOffsetSeconds + data.timezone) * 1000).toLocaleTimeString()}</div>
                <img src="http://openweathermap.org/img/w/${data.forecast[3].weather[0].icon}.png" alt="rain">
                <div class="temp-day"> <div class="temp-max">${Math.round(data.forecast[3].main.temp_max)} °C</div>
                <div class="temp-min">${Math.floor(data.forecast[3].main.temp_min)} °C</div></div>
            </div>
            <div class="info-day">
                <div class="data">${new Date((data.forecast[4].dt - timeZoneOffsetSeconds + data.timezone) * 1000).toLocaleTimeString()}</div>
                <img src="http://openweathermap.org/img/w/${data.forecast[4].weather[0].icon}.png" alt="rain">
                <div class="temp-day"> <div class="temp-max">${Math.round(data.forecast[4].main.temp_max)} °C</div>
                <div class="temp-min">${Math.floor(data.forecast[4].main.temp_min)} °C</div></div>
            </div>
            <div class="info-day">
                <div class="data">${new Date((data.forecast[5].dt - timeZoneOffsetSeconds + data.timezone) * 1000).toLocaleTimeString()}</div>
                <img src="http://openweathermap.org/img/w/${data.forecast[5].weather[0].icon}.png" alt="rain">
                <div class="temp-day"> <div class="temp-max">${Math.round(data.forecast[5].main.temp_max)} °C</div>
                <div class="temp-min">${Math.floor(data.forecast[5].main.temp_min)} °C</div></div>
            </div>
            <div class="info-day">
                <div class="data">${new Date((data.forecast[6].dt - timeZoneOffsetSeconds + data.timezone) * 1000).toLocaleTimeString()}</div>
                <img src="http://openweathermap.org/img/w/${data.forecast[6].weather[0].icon}.png" alt="rain">
                <div class="temp-day"> <div class="temp-max">${Math.round(data.forecast[6].main.temp_max)} °C</div>
                <div class="temp-min">${Math.floor(data.forecast[6].main.temp_min)} °C</div></div>
            </div>
            <div class="info-day">
                <div class="data">${new Date((data.forecast[7].dt - timeZoneOffsetSeconds + data.timezone) * 1000).toLocaleTimeString()}</div>
                <img src="http://openweathermap.org/img/w/${data.forecast[7].weather[0].icon}.png" alt="rain">
                <div class="temp-day"> <div class="temp-max">${Math.round(data.forecast[7].main.temp_max)} °C</div>
                <div class="temp-min">${Math.floor(data.forecast[7].main.temp_min)} °C</div></div>
            </div>
        </div>
    </div>`
    return html
}
