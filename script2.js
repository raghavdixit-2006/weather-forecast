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