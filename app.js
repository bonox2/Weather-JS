const API_KEY = '0ce7524a2107c97ceb90a85e7711636b'
const citySearch = document.getElementById('citySearch')
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

function addMessages(elem, messages) {
let messagesHtml = '' //переменная равна строке
    messages.forEach(message => {//функцыя для каждого елемента
    messagesHtml += renderMessage(message)
    });
    elem.innerHTML = messagesHtml//приравниваем
  }
function renderMessage(data) {//каркас секции
    const html =
        `<div class="letter-section ${data.seen ? 'seen' : 'not_seen'}" data-id="${data.id}">
            <div class="sender-info">
                <div class="senders-photo"><img width="50" height="50" loading="lazy" src="${data.avatar}" alt="${data.name}"></div>
                <div>
                    <div class="sender-name">${data.name}</div>
                    <div class="sender-number">${data.phone}</div>
                </div>
            </div>
            <div class="message-info"> ${data.text}</div>
            <div class="date-time">
                <div class="time">${timeFormat.format(data.date)}</div>
                <div class="time">${dateFormat.format(data.date)}</div>
            </div>
        </div>
    </div>`
    return html//возвращаем результат
}