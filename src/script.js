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
// Search engine & Current weather

function showTemperature(response) {
	document.querySelector(
		"#current-city"
	).innerHTML = `${response.data.name}, ${response.data.sys.country}`
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

	document.querySelector("#wind-value").innerHTML = `${Math.round(
		response.data.wind.speed
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
}

function searchCity(city) {
	let apiKey = "062a6cf7a5122c2b6ddc6f1bcfcc2e0f"
	let units = "metric"
	let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=`
	let apiUrl = `${apiEndpoint}${city}&appid=${apiKey}&units=${units}`
	axios.get(apiUrl).then(showTemperature)
}

function handleSubmit(event) {
	event.preventDefault()
	let city = document.querySelector("#search-text-input").value
	searchCity(city)
}

let form = document.querySelector("#search-form")
form.addEventListener("click", handleSubmit)

// Default weather
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
