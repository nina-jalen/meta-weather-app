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

	let nrDate = date.getDate()

	let months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	]

	let month = months[date.getMonth()]

	let year = date.getFullYear()

	return `${day} ${nrDate} ${month}&nbsp;&nbsp;${hour}:${minute}`
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
	document.querySelector("#current-city").innerHTML = `${response.data.city}`
	document.querySelector(
		"#current-country"
	).innerHTML = `${response.data.country}`

	document.querySelector("#current-temperature").innerHTML = `${Math.round(
		response.data.temperature.current
	)}°`
	document.querySelector("#weather-description").innerHTML =
		response.data.condition.description
	document
		.querySelector("#current-icon")
		.setAttribute(
			"src",
			`images/icons/${response.data.condition.icon}.svg`
		)
	document
		.querySelector("#current-icon")
		.setAttribute("alt", response.data.condition.description)

	let windValue = `${Math.round(
		response.data.wind.speed * 0.001 * 3600
	)} km/h`
	document.querySelector("#wind-value").innerHTML = windValue

	celsiusTemperature = response.data.temperature.current

	getForecast(response.data.city)
}

function searchCity(city) {
	apiKey = "7e0645b54e0a0f4c0fa7443bo6fb8tf9"
	let units = "metric"
	let apiEndpoint = `https://api.shecodes.io/weather/v1/current?query=`
	apiUrl = `${apiEndpoint}${city}&key=${apiKey}&units=${units}`
	axios.get(apiUrl).then(showTemperature)
}

function handleSubmit(event) {
	event.preventDefault()
	let city = document.querySelector("#search-text-input");
	celsiusLink.classList.add("active")
	fahrenheitLink.classList.remove("active")
	searchCity(city.value)
}

let form = document.querySelector("#search-form")
form.addEventListener("click", handleSubmit)



//
//
//
//
// Current location button

function findCurrentLocation(position) {
	let lat = position.coordinates.latitude
	let lon = position.coordinates.longitude
	apiKey = "7e0645b54e0a0f4c0fa7443bo6fb8tf9"
	units = "metric"
	apiEndpoint = `https://api.shecodes.io/weather/v1/current`
	apiUrl = `${apiEndpoint}?lon=${lon}&lat=${lat}&key=${apiKey}&units=${units}`;
	
	axios.get(apiUrl).then(showTemperature)
	axios.get(apiUrlCurrent).then(showCurrentTemperature)
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
// Current temperature

function displayFahreheitTemperature(event) {
	event.preventDefault()
	celsiusLink.classList.remove("active")
	fahrenheitLink.classList.add("active")
	let temperatureElement = document.querySelector("#current-temperature")
	let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32
	temperatureElement.innerHTML = `${Math.round(fahrenheitTemperature)}°`
	convertForecastTemperature("imperial")
}

function displayCelsiusTemperature(event) {
	event.preventDefault()
	celsiusLink.classList.add("active")
	fahrenheitLink.classList.remove("active")
	let temperatureElement = document.querySelector("#current-temperature")
	temperatureElement.innerHTML = `${Math.round(celsiusTemperature)}°`
	convertForecastTemperature("metric")
}

let fahrenheitLink = document.querySelector("#fahrenheit-link")
fahrenheitLink.addEventListener("click", displayFahreheitTemperature)

let celsiusTemperature = null

let celsiusLink = document.querySelector("#celsius-link")
celsiusLink.addEventListener("click", displayCelsiusTemperature)

// Fahrenheit to Celsius conversion
// Forecast temperature
function convertForecastTemperature(unitType) {
	forecast.forEach(function (forecastDay, index) {
		if (index > 0 && index < 8) {
			let tempMin = `${Math.round(forecastDay.temperature.minimum)}°`
			let tempMax = `${Math.round(forecastDay.temperature.maximum)}°`
			let min = document.querySelector("#forecast-min" + index)
			let max = document.querySelector("#forecast-max" + index)
			if (unitType === "metric") {
				min.innerHTML = tempMin
				max.innerHTML = tempMax
			} else {
				min.innerHTML = `${Math.round(
					(forecastDay.temperature.minimum * 9) / 5 + 32
				)}°`
				max.innerHTML = `${Math.round(
					(forecastDay.temperature.minimum * 9) / 5 + 32
				)}°`
			}
		}
	})
}

// Unit conversion
function showCurrentTemperature(response) {
	if (fahrenheitLink.className === "active") {
		temperatureElement.innerHTML = Math.round(
			(celsiusTemperature * 9) / 5 + 32
		)
	} else {
		temperatureElement.innerHTML = Math.round(celsiusTemperature)
	}
}

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

function getForecast(city) {
	let apiKey = "7e0645b54e0a0f4c0fa7443bo6fb8tf9"
	let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
	axios.get(apiUrl).then(displayForecast)
}

//
//
//
//
// Display forecast

function displayForecast(response) {
	forecast = response.data.daily
	console.log("Response from API:", response)

	let forecastElement = document.querySelector("#forecast")

	let forecastHTML = `<div class="row row-cols-1 row-weather-forecast">`

	forecast.forEach(function (forecastDay, index) {
		if (index > 0 && index < 8) {
			forecastHTML =
				forecastHTML +
				`
				<div class="col-md">
				<div class="card">
				<div class="card-body">
				<h5 class="card-day">${formatDay(forecastDay.time)}</h5>
					<p class="card-temperature" id="forecast-max${index}">${Math.round(
					forecastDay.temperature.maximum
				)}°</p>
				<img
				src="images/icons/${forecastDay.condition.icon}.svg"
				alt="${forecastDay.condition.description}"
						class="forecast-icon"
						/>
					<p class="card-temperature" id="forecast-min${index}">${Math.round(
					forecastDay.temperature.minimum
				)}°</p>
					</div>
			</div>
			</div>
	`
		}
	})
	forecastHTML = forecastHTML + `</div>`
	forecastElement.innerHTML = forecastHTML
	if (fahrenheitLink.className === "active") {
		convertForecastTemperature("imperial")
	}
}

let forecast = null
let units = "metric"

searchCity("Innsbruck");
