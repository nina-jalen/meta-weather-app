//
//
//
//
// Current date & time

function formatDate(date) {
	let hour = date.getHours()
	if (hour < 10) {
		hour = `0${hour}`
	}

	let minute = date.getMinutes()
	if (minute < 10) {
		minute = `0${minute}`
	}

	let dayIndex = date.getDay()
	let days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	]
	let day = days[dayIndex]

	return `${day} ${hour}:${minute}`
}

let currentTime = new Date()
let dateElement = document.querySelector("#current-date")
dateElement.innerHTML = formatDate(currentTime)

//
//
//
//
// Forecast days

function formatDay(timestamp) {
	let date = new Date(timestamp * 1000)
	day = date.getDay()
	days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

	return days[day]
}

//
//
//
//
// Get forecast

function getForecast(coordinates) {
	let apiKey = "062a6cf7a5122c2b6ddc6f1bcfcc2e0f"
	let apiUrl = `
	https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`

	axios.get(apiUrl).then(displayForecast)
}

//
//
//
//
// Search engine & Current weather

function showTemperature(response) {
	document.querySelector(
		"#current-city"
	).innerHTML = `${response.data.name}`
		document.querySelector("#current-country").innerHTML = `${response.data.sys.country}`

	document.querySelector("#current-temperature").innerHTML = `${Math.round(
		response.data.main.temp
	)}°`
	document.querySelector("#weather-description").innerHTML =
		response.data.weather[0].description
	document
		.querySelector("#weather-icon")
		.setAttribute(
			"src",
			`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
		)
	document
		.querySelector("#weather-icon")
		.setAttribute("alt", response.data.weather[0].description)

	let windValue = response.data.wind.speed * 3.6
	document.querySelector("#wind-value").innerHTML = `${Math.round(
		windValue
	)} km/h`
	document.querySelector(
		"#humidity-value"
	).innerHTML = `${response.data.main.humidity}%`
	let visibility = response.data.visibility / 1000
	document.querySelector("#visibility-value").innerHTML = `${visibility} km`
	document.querySelector(
		"#pressure-value"
	).innerHTML = `${response.data.main.pressure} hPa`

	celsiusTemperature = response.data.main.temp

	getForecast(response.data.coord)
}

function searchCity(city) {
	apiKey = "062a6cf7a5122c2b6ddc6f1bcfcc2e0f"
	let units = "metric"
	let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=`
	apiUrl = `${apiEndpoint}${city}&appid=${apiKey}&units=${units}`
	axios.get(apiUrl).then(showTemperature)
}

function handleSubmit(event) {
	event.preventDefault()
	let city = document.querySelector("#search-text-input").value
	searchCity(city)
}

let form = document.querySelector("#search-form")
form.addEventListener("click", handleSubmit)

searchCity("Innsbruck")

//
//
//
//
// Current Location button

function findCurrentLocation(position) {
	let lat = position.coords.latitude
	let lon = position.coords.longitude
	apiKey = "062a6cf7a5122c2b6ddc6f1bcfcc2e0f"
	units = "metric"
	apiEndpoint = `https://api.openweathermap.org/data/2.5/weather`
	apiUrl = `${apiEndpoint}?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`
	axios.get(apiUrl).then(showTemperature)
}

function findGeoLocation(event) {
	event.preventDefault()
	navigator.geolocation.getCurrentPosition(findCurrentLocation)
}

let locationButton = document.querySelector("#current-location")
locationButton.addEventListener("click", findGeoLocation)

//
//
//
//
// Fahrenheit to Celsius conversion

function displayFahreheitTemperature(event) {
	event.preventDefault()
	let temperatureElement = document.querySelector("#current-temperature")
	let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32
	temperatureElement.innerHTML = `${Math.round(fahrenheitTemperature)}°`
	celsius.classList.remove("active")
	fahrenheit.classList.add("active")
}

function displayCelsiusTemperature(event) {
	event.preventDefault()
	celsius.classList.add("active")
	fahrenheit.classList.remove("active")
	let temperatureElement = document.querySelector("#current-temperature")
	temperatureElement.innerHTML = `${Math.round(celsiusTemperature)}°`
}

let fahrenheit = document.querySelector("#fahrenheit-link")
fahrenheit.addEventListener("click", displayFahreheitTemperature)

let celsiusTemperature = null

let celsius = document.querySelector("#celsius-link")
celsius.addEventListener("click", displayCelsiusTemperature)

//
//
//
//
// Display forecast

function displayForecast(response) {
	let forecast = response.data.daily

	let forecastElement = document.querySelector("#forecast")

	let forecastHTML = `<div class="row row-cols-1 row-weather-forecast">`

	forecast.forEach(function (forecastDay, index) {
		if (index < 7) {
			forecastHTML =
				forecastHTML +
				`
		<div class="col-md">
			<div class="card">
				<div class="card-body">
					<h5 class="card-day">${formatDay(forecastDay.dt)}</h5>
					<p class="card-temperature">${Math.round(forecastDay.temp.max)}°</p>
					<img
						src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
						alt=""
						class="weather-icon-2"
					/>
					<p class="card-temperature">${Math.round(forecastDay.temp.min)}°</p>
				</div>
			</div>
		</div>
	`
		}
	})
	forecastHTML = forecastHTML + `</div>`
	forecastElement.innerHTML = forecastHTML
}

displayForecast()
