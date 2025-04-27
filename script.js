let slider = document.querySelector(".slide-contain");
let count = 0;
let prev = document.querySelector(".left");
let next = document.querySelector(".right");

//              slider

setInterval(() =>{
    slider.style.left = -count*100 + "vw";
    count++;
    if(count > 2){
        count = 0;
    }
},6000);

function previous(){
    count--;
    if(count == -1){
        count = 2;
        slider.style.left = -200 + "vw";
    }else{
    slider.style.left = count*100 + "vw";}
}
function nextt(){
    count++;
    if(count > 2){
        count = 0;
    }
    slider.style.left = -count*100 + "vw";
}

const apikey = `https://api.openweathermap.org/data/2.5/weather?&appid=56c931f2347e26bdffcf671b5f284d4f&units=metric&q=`;

let searchbox = document.querySelector("#cityname");
let searchbtn = document.querySelector("#searchbtn");

let temp = document.querySelector("#temp");
let weatherimg = document.querySelector("#weatherimg");
let city = document.querySelector("#city");
let cloud= document.querySelector("#clouds");
let dataweather = document.querySelector(".dataweather");
let humidity = document.querySelector("#humidity");
let uv = document.querySelector("#uv");
let visibility = document.querySelector("#Visibility");
let pressure = document.querySelector("#pressure");
let speed = document.querySelector("#speed");

async function WeatherData(cityname){
    const response = await fetch(apikey + cityname);
	var data = await response.json();

    temp.innerHTML = `${Math.round(data.main.temp)}°C`;
    weatherimg.src = `images/${data.weather[0].main}.svg`;
    console.log(data.weather[0].icon);
    city.innerHTML = data.name;
    temp.style.fontSize = "5vmax";
    temp.style.color = "white";
    temp.style.fontWeight = "bold";
    cloud.innerHTML = data.weather[0].description;
    humidity.innerHTML = `${data.main.humidity}%`;
    speed.innerHTML = `${data.wind.speed}kmph`;
    pressure.innerHTML = `${data.main.pressure}hPa`;
    visibility.innerHTML = `${data.visibility/1000}km`;
    uv.innerHTML = `${Math.round(data.main.feels_like)}°C`;
}

searchbtn.addEventListener("click", () => {
	WeatherData(searchbox.value);
});

let temp1 = document.querySelector("#temp1");
let humidity1 = document.querySelector("#humidity1");
let speed1 = document.querySelector("#speed1");
let pressure1 = document.querySelector("#pressure1");
let temp2 = document.querySelector("#temp2");
let humidity2 = document.querySelector("#humidity2");
let speed2 = document.querySelector("#speed2");
let pressure2 = document.querySelector("#pressure2");
let temp3 = document.querySelector("#temp3");
let humidity3 = document.querySelector("#humidity3");
let speed3 = document.querySelector("#speed3");
let pressure3 = document.querySelector("#pressure3");


async function weather1(cityname){
    const response = await fetch(apikey + cityname);
	var data = await response.json();

    temp1.innerHTML = `${Math.round(data.main.temp)}°C`;
    humidity1.innerHTML = `${data.main.humidity}%`;
    speed1.innerHTML = `${data.wind.speed}kmph`;
    pressure1.innerHTML = `${data.main.pressure}hPa`;
}

async function weather2(cityname){
    const response = await fetch(apikey + cityname);
	var data = await response.json();

    temp2.innerHTML = `${Math.round(data.main.temp)}°C`;
    humidity2.innerHTML = `${data.main.humidity}%`;
    speed2.innerHTML = `${data.wind.speed}kmph`;
    pressure2.innerHTML = `${data.main.pressure}hPa`;
}

async function weather3(cityname){
    const response = await fetch(apikey + cityname);
	var data = await response.json();

    temp3.innerHTML = `${Math.round(data.main.temp)}°C`;
    humidity3.innerHTML = `${data.main.humidity}%`;
    speed3.innerHTML = `${data.wind.speed}kmph`;
    pressure3.innerHTML = `${data.main.pressure}hPa`;
}

window.onload = weather1("tokyo");
window.onload = weather2("mumbai");
window.onload = weather3("california");