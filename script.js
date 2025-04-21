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