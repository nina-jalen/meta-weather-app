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
// Search engine

function showTemperature(response) {
	document.querySelector("#current-city").innerHTML = response.data.name
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
