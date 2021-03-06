const API_KEY = '0ce7524a2107c97ceb90a85e7711636b'
const lang = window.navigator.language.slice(0, 2)
const citySearch = document.getElementById('citySearch')
const citiesList = document.getElementById('citiesList')
const weatherTypesVideos = {
    "Thunderstorm": 'Thunderstorm.mp4',
    "Drizzle": 'Drizzle.mp4',
    "Rain": "Rain.mp4",
    "Snow": "Snow.mp4",
    "Clear": "Clear.mp4",
    "Clouds": "Clouds.mp4",
    "Fog": "Fog.mp4"
}
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
    const foreCastTemps = data.forecast.map(cast => cast.main.temp)
    const minTemp = Math.min(...foreCastTemps)
    const maxTemp = Math.max(...foreCastTemps)
    console.log(minTemp, maxTemp);
    const html =
        `<div class="city-section">
        <video autoplay loop mute src="${location.href}/videos/${weatherTypesVideos[data.weather[0].main]}"></video>
        <div class="city-info">
                <div class="left-temp">
                    <div class="name-city">${data.name}</div>
                    <div class="tempr">
                    <img class="icon-weather" src="./img/${data.weather[0].main}.svg" alt="rain">
                    <div>${Math.round(data.main.temp)} ??C</div>
                    </div>
                <div class="more-info">Sunrise: ${timeFormatter.format((data.sys.sunrise - timeZoneOffsetSeconds + data.timezone) * 1000)}
                  Sunset: ${timeFormatter.format((data.sys.sunset - timeZoneOffsetSeconds + data.timezone) * 1000)}
                    <div class="type-wheather">?????? ????????????: ${data.weather[0].description}</div>
                    <div>?????????????????????? ??????: ${Math.round(data.main.feels_like)} ??C</div>
                    <div>??????????????????: ${data.main.humidity} %</div>
                    <div>??????????: ${Math.round(data.wind.speed * 3.6)} ????/?? <span class="wind-dir" style="transform: rotate(${data.wind.deg}deg)">&#129045;</span></div>
                </div>
                </div>
                <div class="right-more-info">
                <div class="temp-hours">
                    ${renderCityForecast(data.forecast, data.timezone)}
                </div>
                    <div class="temp-wrap">
                    ${renderCityForecastTemps(data.forecast, minTemp, maxTemp)}
                    </div>
                    
            </div>
        </div>
    </div>`
    return html
}

setInterval(getWeatherBySavedCities, 1800000)


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
function renderCityForecastTemps(forecast, minTemp, maxTemp) {
    let forecastTempsHtml = ''
    for (let i = 0; i < 5; i++) {
        const part = forecast[i];
        forecastTempsHtml += `<div class="temp" style="border-color: hsl(${getTempColor(part.main.temp)}, 60%, 50%);background-color: hsl(${getTempColor(part.main.temp)}, 100%, 80%); height: ${Math.round(getPercentFromRange(part.main.temp, minTemp - 25, maxTemp + 10))}%" > <div class="degre">${Math.round(part.main.temp)} ??C</div></div>`
    }
    return forecastTempsHtml
}




function getPercentFromRange(x, r0, r1) {
    x = Math.round(x)
    return (x - r0) * 100 / (r1 - r0)
}


function getTempColor(temp, r0 = -50, r1 = 50) {
    temp = Math.round(temp)
    const minTempHue = 270
    if (r0 < -50) {
        r0 = -50
    }
    if (r1 > 50) {
        r1 = 50
    }
    if (temp < r0) {
        temp = r0
    }
    if (temp > r1) {
        temp = r1
    }
    const tempPercent = Math.round(getPercentFromRange(temp, r0, r1))
    const hue = ((-1 * minTempHue / 100) * tempPercent) + minTempHue
    return hue
}