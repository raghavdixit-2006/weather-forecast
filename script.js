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
