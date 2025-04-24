let ipinformation = "https://ipinfo.io/json?token=28ee266844a8de"
const apikey = `https://api.openweathermap.org/data/2.5/weather?&appid=56c931f2347e26bdffcf671b5f284d4f&units=metric&q=`;

let feels = document.querySelector("#feelslike");
let maxtemp = document.querySelector("#maxtemp");
let mintemp = document.querySelector("#mintemp");
let humidity = document.querySelector("#humidity");
let pressure = document.querySelector("#pressure");
let sealev = document.querySelector("#sealev");
let speed = document.querySelector("#speed");
let gndlev = document.querySelector("#gndlev");
let Visibility = document.querySelector("#Visibility");
let Country = document.querySelector("#Country");
let weatherimage = document.querySelector("#weatherimage");
let temperature = document.querySelector("#temperature");

let name = document.querySelector("#name");
let state = document.querySelector("#state");
let country = document.querySelector("#country");
let lon = document.querySelector("#lon");
let lat = document.querySelector("#lat");
async function getIPInfo(){
    const response = await fetch(ipinformation);
    var info = await response.json();
    console.log(info);

    const response2 = await fetch(apikey + info.city);
	var data = await response2.json();
    console.log(data);

    feels.innerHTML = `${Math.round(data.main.feels_like)}°C`;
    maxtemp.innerHTML = `${Math.round(data.main.temp_max)}°C`;
    mintemp.innerHTML = `${Math.round(data.main.temp_min)}°C`;
    humidity.innerHTML = `${data.main.humidity}%`;
    pressure.innerHTML = `${data.main.pressure} hPa`;
    sealev.innerHTML = `${data.main.sea_level} hPa`;
    speed.innerHTML = `${data.wind.speed} m/s`;
    gndlev.innerHTML = `${data.main.grnd_level} hPa`;
    Visibility.innerHTML = `${data.visibility/1000} Km`;
    Country.innerHTML = data.sys.country;
    weatherimage.src = `images/${data.weather[0].main}.svg`;
    temperature.innerHTML = `${data.main.temp}°C`
    name.innerHTML = info.city;
    state.innerHTML = info.region;
    country.innerHTML = info.country;
    lat.innerHTML = info.loc.split(",")[0];
    lon.innerHTML = info.loc.split(",")[1];
}

window.onload = getIPInfo();


const cities = ["Delhi","Mumbai","Chennai","Chandigarh","Banglore","Hyderabad","Kolkata","Ahmedabad","Surat","Jaipur","Lucknow","Kanpur","Indore","Nagpur","Patna","Agra","Meerut","Varanasi","Haridwar","Madurai","Jamshedpur"];
const apiKey = "56c931f2347e26bdffcf671b5f284d4f";

const weatherContainer = document.getElementById("cities");

cities.forEach(city => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Create a card for each city
            const weatherCard = document.createElement("div");

            // Populate the card with city weather data
            weatherCard.innerHTML = `
                <p>${city}</p>
                <div class="info"><img src=images/${data.weather[0].main}.svg alt=""><p>${Math.round(data.main.temp)}°C</p></div>
            `;
            console.log(data.weather[0].main);

            // Append the card to the container
            weatherContainer.appendChild(weatherCard);
        })