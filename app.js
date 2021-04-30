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



function renderTableData(elem, data) {
    elem.innerHTML = ''
    let covidDataHtml = '' //переменная равна строке
    data.forEach(country => {
      covidDataHtml += createTableRow(country)
    });
    elem.innerHTML = covidDataHtml//приравниваем
  }
  
  function createSummary(dataArray) {
    const summaryCounts = {
      confirmed: 0,
      deaths: 0,
      recovered: 0,
      existing: 0,
      delta_confirmed: 0,
      delta_deaths: 0,
      delta_recovered: 0,
      delta_existing: 0,
    }
    const summaryCountsKeys = Object.keys(summaryCounts)
  
    dataArray.forEach(dataObj => {
      summaryCountsKeys.forEach(key => {
        summaryCounts[key] += dataObj[key]
      })
    })
    return `
    <div class="confirmed">
      <h3 class="text-color">Confirmed:</h3>
      <div>
        ${numberFormatter.format(summaryCounts.confirmed)}
      </div>
      <div>
        ${summaryCounts.delta_confirmed !== 0 ? `<span>${summaryCounts.delta_confirmed < 0 ? "&#9660;" : "&#9650;"}</span>` : ''}
        ${summaryCounts.delta_confirmed === 0 ? "-" : numberFormatter.format(summaryCounts.delta_confirmed)}
      </div>
    </div>
    <div class="deaths">
      <h3 class="text-color">Deaths:</h3>
      <div>
        ${numberFormatter.format(summaryCounts.deaths)}
      </div>
      <div>
        ${summaryCounts.delta_deaths !== 0 ? `<span>${summaryCounts.delta_deaths < 0 ? "&#9660;" : "&#9650;"}</span>` : ''}
        ${summaryCounts.delta_deaths === 0 ? "-" : numberFormatter.format(summaryCounts.delta_deaths)}
      </div>
    </div>
    <div class="recovered">
      <h3 class="text-color">Recovered:</h3>
      <div>
        ${numberFormatter.format(summaryCounts.recovered)}
      </div>
      <div>
        ${summaryCounts.delta_recovered !== 0 ? `<span>${summaryCounts.delta_recovered < 0 ? "&#9660;" : "&#9650;"}</span>` : ''}
        ${summaryCounts.delta_recovered === 0 ? "-" : numberFormatter.format(summaryCounts.delta_recovered)}
      </div>
    </div>
    <div class="existing">
      <h3 class="text-color">Existing:</h3>
      <div>
        ${numberFormatter.format(summaryCounts.existing)}
      </div>
      <div>
        ${summaryCounts.delta_existing !== 0 ? `<span>${summaryCounts.delta_existing < 0 ? "&#9660;" : "&#9650;"}</span>` : ''}
        ${summaryCounts.delta_existing === 0 ? "-" : numberFormatter.format(summaryCounts.delta_existing)}
      </div>
    </div>
    `
  }
  function createTableRow(data) {
    const html =
      `<tr>
          <td>${data.label[lang]}</td>
          <td class="confirmed">
            <div>${numberFormatter.format(data.confirmed)}</div>
            <div>
                ${data.delta_confirmed !== 0 ? `<span>${data.delta_confirmed < 0 ? "&#9660;" : "&#9650;"}</span>` : ''}
              ${data.delta_confirmed === 0 ? "-" : numberFormatter.format(data.delta_confirmed)}
            </div>
          </td>
          <td class="deaths">
            <div>${numberFormatter.format(data.deaths)}</div>
            <div>
                ${data.delta_deaths !== 0 ? `<span>${data.delta_deaths < 0 ? "&#9660;" : "&#9650;"}</span>` : ''}
              ${data.delta_deaths === 0 ? "-" : numberFormatter.format(data.delta_deaths)}
            </div>
          </td>
          <td class="recovered">
            <div>${numberFormatter.format(data.recovered)}</div>
            <div>
                ${data.delta_recovered !== 0 ? `<span>${data.delta_recovered < 0 ? "&#9660;" : "&#9650;"}</span>` : ''}
              ${data.delta_recovered === 0 ? "-" : numberFormatter.format(data.delta_recovered)}
            </div>
          </td>
          <td class="existing">
            <div>${numberFormatter.format(data.existing)}</div>
            <div>
                ${data.delta_existing !== 0 ? `<span>${data.delta_existing < 0 ? "&#9660;" : "&#9650;"}</span>` : ''}
              ${data.delta_existing === 0 ? "-" : numberFormatter.format(data.delta_existing)}
            </div>
          </td>
        </tr>
            `
    return html
  }
  