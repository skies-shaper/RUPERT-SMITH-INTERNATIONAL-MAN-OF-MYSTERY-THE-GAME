let playerX, playerY, cameraX, cameraY, score, imgData3, currentlevelWidth, currentlevelHeight
let LEVELS = []
let TILES = [
    {img:"null",collision:1},
    {img: "cobble-1", collision:0 },
    {img: "cobble-2", collision:0 },
    {img: "cobble-3", collision:0 },
    {img: "brick-1", collision:1 },
    {img: "brick-2", collision:1 },
    {img: "brick-3", collision:1 }

]
let DIRECTION_LEFT = 1
let DIRECTION
let DIRECTION_RIGHT = 0
let DIRECTION_UP = 2
let DIRECTION_DOWN = 3
let RUPERTFRAME = 0, RUPERTANIMATIONOFFSET = 0
let level
let isPaused = false;
const gamescreen = document.getElementById("gamewindow").getContext("2d")
let mouseX = -1
let mouseY = -1
let mouseDown = false
currentlevelHeight = 50
currentlevelWidth = 50
let userKeys = []
let PLAYERSPEED = 3
let spawn
//debug variables
let DEBUG_showMouse = false
let DEBUG_showHitboxes = false
let MOVING = false
preInit()

function point(xpos,ypos)
{
    return({x:xpos,y:ypos})
}

function preInit()
{
    spawn = point(27,-18)
    cameraX = spawn.x
    cameraY = spawn.y
    generateMap(50,50)
}
document.getElementById("gamewindow").addEventListener("mousemove",(event)=>{
    mouseX = event.offsetX
    mouseY = event.offsetY
})
document.getElementById("gamewindow").addEventListener("mousedown",()=>{
    mouseDown = true;
})
document.getElementById("gamewindow").addEventListener("mouseup",()=>{
    mouseDown = false;
})
window.addEventListener("keydown",(event)=>{
    userKeys[event.key] = true;
    if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].indexOf(event.key)>-1)
    {
        MOVING = true;
    }
    if("ArrowLeft"==event.key)
    {
        DIRECTION = DIRECTION_LEFT
    }
    if("ArrowRight" == event.key)
    {
        DIRECTION = DIRECTION_RIGHT
    }
    if(event.key == "Escape")
    {
        isPaused = true;
    }
})
window.addEventListener("keyup",(event)=>{
    userKeys[event.key] = false;
    if(!(userKeys["ArrowLeft"]||userKeys["ArrowRight"]||userKeys["ArrowDown"]||userKeys["ArrowUp"]))
    {
        MOVING = false;
    }
    if(event.key == "e")
    {
        generateMap(50,50)
        cameraX = spawn.x
        cameraY = spawn.y
    }
    if(event.key == "r")
    {
        cameraX = spawn.x
        cameraY = spawn.y
    }
})

function generateMap(width, height)
{
    level = []
    for (let i = 0; i < height; i++) {
        level.push([])
        for(let j = 0; j<width; j++) {
            level[i].push(Math.floor(Math.random()*5))
        }        
    }
}

function gameInit(){
  
    setInterval(gameloop,(1000/60))
}

function gameStart()
{

}

function gameloop(){
    //general graphics stuff. This makes each frame render properly and makes pixel art look ncie
    gamescreen.fillStyle = "black"
    gamescreen.fillRect(0,0,500,300)    
    gamescreen.imageSmoothingEnabled = false
    
    if(!isPaused)
    {
        gameLogic()
    }
    renderScreen()
    if(isPaused)
    {
        pauseMenu()
    }
    
    //gamescreen.drawImage(document.getElementById("roadtile"),32,32,48,48)
    
}

function gameLogic()
{
    //player movement stuff! (let's avoid knockback weapons, k? actually probably will be fine but alsoooo :/)
    let secondaryBound = true
    let playerWidth = 14, playerHeight = 14
    playerX = -1*(Math.floor((cameraX)/48)-4)
    playerY = -1*(Math.floor((cameraY)/48)-2)
    let oldX = cameraX 
    let oldY = cameraY
    
    

    if(userKeys["ArrowLeft"])
    {
        cameraX += PLAYERSPEED
        if(userKeys["ArrowDown"]||userKeys["ArrowUp"]){
            cameraX = oldX
            cameraX +=PLAYERSPEED/Math.sqrt(2)
        }
        if(TILES[level[-1*(Math.floor((cameraY+12)/48)-2)][-1*(Math.floor((cameraX+15)/48)-4)]]["collision"] == 1 || TILES[level[-1*(Math.floor((cameraY-30)/48)-2)][-1*(Math.floor((cameraX+15)/48)-4)]]["collision"] == 1){
            cameraX = oldX
        }
    }
    if(userKeys["ArrowRight"])
    {
        cameraX -= PLAYERSPEED
        if(userKeys["ArrowDown"]||userKeys["ArrowUp"]){
            cameraX = oldX
            cameraX -=PLAYERSPEED/Math.sqrt(2)
        }
        if(TILES[level[-1*(Math.floor((cameraY+12)/48)-2)][-1*(Math.floor((cameraX-24)/48)-4)]]["collision"] == 1 || TILES[level[-1*(Math.floor((cameraY-30)/48)-2)][-1*(Math.floor((cameraX-24)/48)-4)]]["collision"] == 1){
            cameraX = oldX
        }

    }
    
    if(userKeys["ArrowDown"])
    {
        cameraY -= PLAYERSPEED
        if(userKeys["ArrowLeft"]||userKeys["ArrowRight"]){
            cameraY = oldY
            cameraY -=PLAYERSPEED/Math.sqrt(2)
        }
        if(TILES[level[-1*(Math.floor((cameraY-30)/48)-2)][-1*(Math.floor((cameraX+15)/48)-4)]]["collision"] == 1 || TILES[level[-1*(Math.floor((cameraY-30)/48)-2)][-1*(Math.floor((cameraX-24)/48)-4)]]["collision"] == 1){
            cameraY = oldY
        }
    }
    if(userKeys["ArrowUp"])
    {
        cameraY += PLAYERSPEED
        if(userKeys["ArrowLeft"]||userKeys["ArrowRight"]){
            cameraY = oldY
            cameraY +=PLAYERSPEED/Math.sqrt(2)
        }
        if(TILES[level[-1*(Math.floor((cameraY+12)/48)-2)][-1*(Math.floor((cameraX+15)/48)-4)]]["collision"] == 1 || TILES[level[-1*(Math.floor((cameraY+12)/48)-2)][-1*(Math.floor((cameraX-24)/48)-4)]]["collision"] == 1){
            cameraY = oldY
        }
    }
    if(cameraY>130){
        cameraY = 130
    }
    if(cameraX>222)
    {
        cameraX = 222
    }
    if(cameraX<(222-(currentlevelWidth*48)))
    {
        cameraX = 222-(currentlevelWidth*48)
    }
    if(cameraY<(130-(currentlevelHeight*48)))
    {
        cameraY=(130-(currentlevelHeight*48))
    }
}

function renderScreen()
{   
    gamescreen.fillStyle = "white" 
    //text
    if(DEBUG_showMouse) {
    gamescreen.fillText(mouseX,50,50)
    gamescreen.fillText(mouseY,50,70)
    }
    
    //background
    for(let i = 0; i<currentlevelHeight; i++)
    {
        for(let j=0; j<currentlevelWidth; j++)
        {
            if(level[i][j] > 0){
                gamescreen.drawImage(document.getElementById(TILES[level[i][j]]["img"]),Math.round(cameraX+(j*48)),Math.round(cameraY+(i*48)),48,48)
            }            
        }
    }
    //entities handling :P
    RUPERTANIMATIONOFFSET++
    if(RUPERTANIMATIONOFFSET%3==0)
    {
        RUPERTFRAME++
    }
    RUPERTFRAME%=10
    
    if(MOVING)
        if(DIRECTION == DIRECTION_LEFT)
        {
            gamescreen.translate(220,109)
            gamescreen.scale(-1,1)

            gamescreen.drawImage(document.getElementById("RUPERT_"+RUPERTFRAME),0,0,-48,72)
            gamescreen.setTransform(1,0,0,1,0,0);
        }
        else
        {
            gamescreen.drawImage(document.getElementById("RUPERT_"+RUPERTFRAME),220,109,48,72)
        }                           
    else
    {
        gamescreen.drawImage(document.getElementById("RUPERT_0"),220,109,48,72)
    }
    
    gamescreen.restore()

    if(DEBUG_showHitboxes){
        gamescreen.strokeStyle = "red"
        gamescreen.strokeRect(223,131,42,42)
    }
    gamescreen.fillText(playerX+", "+playerY,50,50)

    
}

function entity(width, height)
{
    return {width, height}
}
window.onload = function(){
    gameInit()
}

function pauseMenu()
{
    if(mouseX>178 && mouseX<322 && mouseY > 132 && mouseY < 170){
        gamescreen.drawImage(document.getElementById("menuContinueHover"),178,132,144,36)
        if(mouseDown)
        {
            isPaused = false
        }
    }
    else{
        gamescreen.drawImage(document.getElementById("menuContinue"),178,132,144,36)
    }

    if(mouseX>185 && mouseX<315 && mouseY > 182 && mouseY < 220){
        gamescreen.drawImage(document.getElementById("menuOptionsHover"),185,182,130,36)    }
    else{
        gamescreen.drawImage(document.getElementById("menuOptions"),185,182,130,36)    }
    
   
}