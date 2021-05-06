const API_KEY = '0ce7524a2107c97ceb90a85e7711636b'
const citySearch = document.getElementById('citySearch')
const citiesList = document.getElementById('citiesList')

const weatherList = []
if (!localStorage.cities) {
    localStorage.cities = JSON.stringify([])
}
const citiesLS = JSON.parse(localStorage.cities)
console.log(citiesLS);
getWeatherBySavedCities(citiesLS)

citySearch.addEventListener('submit', event => {
    event.preventDefault()
    const cityName = event.target.citySearch.value
    getDataByCityName(cityName)
    event.target.reset()
})

function getWeatherBySavedCities(citiesIdList) {
    citiesIdList.forEach(cityId => {
        getDataByCityId(cityId)
    });
}

function getDataByCityName(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=${API_KEY}
    `
    getData(url, data => {
        console.log(data);
        if (!citiesLS.includes(data.sys.id)) {
            citiesLS.push(data.id)
            localStorage.cities = JSON.stringify(citiesLS)
        }
    })
}
function getDataByCityId(cityId) {
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&id=${cityId}&appid=${API_KEY}
    `
    getData(url, data => {
        console.log(data);
        weatherList.push(data)
        addCity(citiesList, weatherList)
    })
}
async function getData(url, cb) {
    try {
        const response = await fetch(url)
        const data = await response.json()
        cb(data)
    } catch (error) {
        console.warn(error);
    }
}
function addCity(elem, cities) {
    let cityHtml = ''
        cities.forEach(city => {
        cityHtml += renderCity(city)
        });
        elem.innerHTML = cityHtml
      }
  function renderCity(data) {
    const html =
        `<div class="city-section">
        <div class="city-info">
            <div class="city-temp">
                <div class="left-temp">
                    <img src="//ssl.gstatic.com/onebox/weather/64/rain.png" alt="rain">
                    <div class="temp">${((data.main.temp)-32)}</div>
                </div>
                <div class="right-more-info">
                    <div>Вероятность осадков: 84%</div>
                    <div>Влажность: 85%</div>
                    <div>Ветер: ${data.speed}км / ч</div>
                </div>
            </div>
            <div class="city-type">
                <div class="name-city">${data.name}</div>
                <div class="day-time">четверг 5:00 PM</div>
                <div class="type-wheather">${data.main}</div>
            </div>
        </div>
        <div class="temp-hours">
            <div class="info-day">
                <div class="data">пн</div>
                <img src="//ssl.gstatic.com/onebox/weather/64/rain.png" alt="rain">
                <div class="temp-day">11 °C</div>
            </div>
            <div class="info-day">
                <div class="data">вт</div>
                <img src="//ssl.gstatic.com/onebox/weather/64/rain.png" alt="rain">
                <div class="temp-day">11 °C</div>
            </div>
            <div class="info-day">
                <div class="data">ср</div>
                <img src="//ssl.gstatic.com/onebox/weather/64/rain.png" alt="rain">
                <div class="temp-day">11 °C</div>
            </div>
            <div class="info-day">
                <div class="data">чт</div>
                <img src="//ssl.gstatic.com/onebox/weather/64/rain.png" alt="rain">
                <div class="temp-day">11 °C</div>
            </div>
            <div class="info-day">
                <div class="data">пт</div>
                <img src="//ssl.gstatic.com/onebox/weather/64/rain.png" alt="rain">
                <div class="temp-day">11 °C</div>
            </div>
            <div class="info-day">
                <div class="data">сб</div>
                <img src="//ssl.gstatic.com/onebox/weather/64/rain.png" alt="rain">
                <div class="temp-day">11 °C</div>
            </div>
            <div class="info-day">
                <div class="data">нд</div>
                <img src="//ssl.gstatic.com/onebox/weather/64/rain.png" alt="rain">
                <div class="temp-day">11 °C</div>
            </div>
        </div>
    </div>`
    return html
}
