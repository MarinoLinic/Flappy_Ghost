// DOM references
let ptica = document.querySelector("#fghost");
let nebo = document.querySelector("#nebo");
let tlo = document.querySelector("#tlo");
let pStart = document.querySelector("#start");
let pOver = document.querySelector("#lost");
let playcounter = document.querySelector("#playcounter");

// dodaj tranziciju na skok

// variables
const visinaNeba = nebo.offsetHeight; // sky height
const visinaPtice = ptica.offsetHeight; // bird height
let started = false; // checks whether the game is being played
let currHeightPtice = 0; // current position of bird top-down
let gravitacija = 0; // gravitation
const fallStep = 0.5; // linear falling speed
const defaultPticaHeight = 80; // the default height in px where the bird spawns
const jumpHeight = 60; // number of pixels that the bird jumps over
const slideLeftDecrement = -2; // linear speed of animation
let pipes = []; // array of pipes
const distancePipeSpawn = 250; // the distance between the spawning of pipes
let distanceCount = 0; // counter for pipes
const defaultPipeHeight = 165;
let randomPipeHeight = 0;
let playCounter = 0;
    
//pocetno definiranje varijabli
let maxSek = 60;
let maxSto = 100;
let pocMin = 0;
let pocSek = 0;
let pocSto = 0;

//referenciranje svega iz .html file-a i manipuliranje html-om
let min = document.querySelector("#minute");
let sek = document.querySelector("#sekunde");
let sto = document.querySelector("#stotinke");
let startButton = document.querySelector("#start");
let stopButton = document.querySelector("#stop");
let resetButton = document.querySelector("#reset");

let intervalOnGoing = false;

const STOPERICA = () => {
    setInterval(() => {
        if(intervalOnGoing)
        {
            if(maxSto -1 <= pocSto)
            {   
                if(maxSek -1 <= pocSek)
                {
                    pocMin++;
                    pocSek = 0;
                    pocSto = 0;
                    sek.innerText = "0" + pocSek;
                    min.innerText = pocMin;
                    pocMin <= 9 ? min.innerText = "0" + pocMin : min.innerText = pocMin;
                }
                else
                {
                    pocSto = 0;
                    pocSek++;
                    sto.innerText = pocSto;
                    sek.innerText = pocSek;
                    pocSek <= 9 ? sek.innerText = "0" + pocSek : sek.innerText = pocSek;
                }
            }
            else
            {
                pocSto++;
                sto.innerText = pocSto;
                pocSto <= 9 ? sto.innerText = "0" + pocSto : sto.innerText = pocSto;
            }
        }
        
    }, 10)
}

const RESET = () => {
    pocSto = 0;
    pocSek = 0;
    pocMin = 0;
    sto.innerText = "00";
    sek.innerText = "00";
    min.innerText = "00"; 
    playCounter = 0;
    playcounter.innerText = "0";
}

STOPERICA();

const PROGRAM = () => {
    const PADANJE = setInterval(() => {
        gravitacija += 0.2;
        
        currHeightPtice = parseInt(ptica.style.top);
        currHeightPtice += fallStep + gravitacija;
        ptica.style.top = currHeightPtice + "px";
        
        if (intervalOnGoing){
            tlo.style.backgroundPosition = parseInt(tlo.style.backgroundPosition) + slideLeftDecrement + "px"; // micanje tla
            nebo.style.backgroundPosition = parseInt(nebo.style.backgroundPosition) + slideLeftDecrement+ 1 + "px"; // parallax
            
            if(distanceCount >= distancePipeSpawn){
                distanceCount = 0;
                CREATEPIPE();
            }
            else distanceCount += 2;
            pipes.forEach((pipe) => {
                domPtica = ptica.getBoundingClientRect();
                domPipe = pipe.getBoundingClientRect();
                
                // collision detection
                if 
                (
                ((domPipe.left < domPtica.right && domPipe.left > domPtica.left)
                ||
                (domPipe.right > domPtica.left && domPipe.right < domPtica.right)) 
                && 
                ((domPipe.top < domPtica.bottom && domPipe.bottom > domPtica.bottom)
                ||
                (domPipe.bottom > domPtica.top && domPipe.top < domPtica.top))
                )
                {
                    pOver.style.visibility = "visible";
                    intervalOnGoing = false;    
                }
                
                // counter
                if (
                    (Math.floor(domPipe.right) == Math.floor(domPtica.left)-1) 
                    && domPipe.bottom > (visinaNeba - visinaPtice)){
                    playCounter++;
                    playcounter.innerText = playCounter;
                }
                
                let yourMom = parseInt(pipe.style.right);
                pipe.style.right = yourMom - slideLeftDecrement + "px";
                if(yourMom > document.documentElement["clientWidth"]){ // checking when the pipe exits the window
                    pipe.remove();
                    // pipes.shift(); // FIX             
                }
            })
        }
        if(currHeightPtice > (visinaNeba - visinaPtice)){
            clearInterval(PADANJE); //gasenje intervala
            currHeightPtice = 0;
            gravitacija = 0;
            started = false;
            pOver.style.visibility = "visible";
            intervalOnGoing = false;
        }
    }, 15);
}

const JUMP = () => {
    if(currHeightPtice >= visinaPtice){
        gravitacija = 0;
        currHeightPtice -= jumpHeight;
        ptica.style.top = currHeightPtice + "px";
    }
}

const CREATEPIPE = () => {
    let pimpekUp = document.createElement("div");
    pimpekUp.classList.add("pipeUp");
    pimpekUp.classList.add("pipe");
    pimpekUp.style.right = "-60px";
    randomPipeHeight = Math.floor(Math.random() * 115) 
    // randomizerom odredi height i povezi ga s donjim
    let pimpekDown = document.createElement("div");
    pimpekDown.classList.add("pipeDown");
    pimpekDown.classList.add("pipe");
    pimpekDown.style.right = "-60px";
    
    // generating random pipe height
    if (Math.floor(Math.random() * 2) + 1 == 1){
        pimpekDown.style.height = defaultPipeHeight + randomPipeHeight + "px";
        pimpekUp.style.height = defaultPipeHeight - randomPipeHeight + "px";
    }
    else{
        pimpekDown.style.height = defaultPipeHeight - randomPipeHeight + "px";
        pimpekUp.style.height = defaultPipeHeight + randomPipeHeight + "px";
    }
    
    nebo.appendChild(pimpekUp);
    nebo.appendChild(pimpekDown);
    pipes.push(pimpekUp);
    pipes.push(pimpekDown);
}

// STARTING THE GAME and jumping
window.addEventListener("keypress", (e) => { // e je event
    if(e.keyCode == 32){ // spacebar
        if(!started){
            pipes = [];
            for (let pipe of document.querySelectorAll(".pipe")){
                pipe.remove();
            }
            pStart.style.visibility = "hidden";
            pOver.style.visibility = "hidden";
            started = true;
            ptica.style.top = defaultPticaHeight + "px";
            PROGRAM();
            intervalOnGoing = true;
            RESET();
        }
        else{
            if (intervalOnGoing) JUMP();
        }
    }
})