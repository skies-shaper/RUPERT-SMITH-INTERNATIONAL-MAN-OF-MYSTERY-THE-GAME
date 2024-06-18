let DAMAGE = {
    FIRE:0,
    ENERGY:1,
    SLASH:2,
    STAB: 3
}
let leftHandFree = true
let rightHandFree = true
let playerX, playerY, cameraX, cameraY, score, imgData3, currentlevelWidth, currentlevelHeight
let logs = []
let inventory = [[1,0,0],[0,0,0],[0,0,0],[0,0,0]]
let clickType = 0
let isShiftPressed = false
let items = [
    {name:"empty",attack:{
        cooldown:0,
        damage: {
            min:0,
            max:0,
            mult:0
        },
        type: [],
        range: 0
    }},
    {name:"sword",attack:{
        cooldown:500,
        damage: {
            min:1,
            max:6,
            mult:1
        },
        type: [DAMAGE.SLASH],
        range: 2,
    },src: "items-shortsword"},
    {name:"dagger",attack:{
        cooldown:50,
        damage:{
            min:1,
            max:4,
            mult:1
        },
        type: [DAMAGE.STAB]
    }},
]
let hasClicked = []
let LEVELS = [
    {   
        lvlid:1,
        lvlname: "introduction",
        lvldescription:"Welcome to the world",
        lvlwidth:10,
        lvlheight: 10,
        lvlspawn: {x:3,y:3},
        lvldata:[
            [10,10,10,10,10,10,10,10,10,10],
            [10,2,2,2,2,2,2,2,2,10],
            [10,2,2,2,2,2,2,2,2,10],
            [10,2,2,2,2,2,2,2,2,10],
            [10,2,2,2,2,2,2,2,2,10],
            [10,2,2,2,2,2,2,2,2,10],
            [10,2,2,2,2,2,2,2,2,10],
            [10,2,2,2,2,2,2,2,2,10],
            [10,2,2,2,2,2,2,2,2,10],
            [10,10,10,10,10,10,10,10,10,10]
        ]
    }
]
let TILES = [
    {img:"null",collision:1},
    {img: "cobble-1", collision:0 },
    {img: "cobble-2", collision:0 },
    {img: "cobble-3", collision:0 },
    {img: "brick-1", collision:1 },
    {img: "brick-2", collision:1 },
    {img: "brick-3", collision:1 },
    {img: "stone", collision:1},
    {img: "stone-1", collision:1},
    {img: "stone-cracked", collision:1},
    {img: "stone-wall", collision:1},
    {img: "stone-wall-mossy", collision:1}
]

let inventoryOpen = false
let targetX = 0, targetY = 0
let DIRECTION_LEFT = 1
let DIRECTION
let DIRECTION_RIGHT = 0
let DIRECTION_UP = 2
let DIRECTION_DOWN = 3
let RUPERTFRAME = 0, RUPERTANIMATIONOFFSET = 0
let level, LEVEL
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
let isMainMenu = false

preInit()

function point(xpos,ypos)
{
    return({x:xpos,y:ypos})
}

function giveplayer(item){
    inventory.push(item)
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
document.getElementById("gamewindow").addEventListener("mousedown",(event)=>{
    mouseDown = true;
    clickType = event.button
    if((isShiftPressed||event.button == 2) && rightHandFree){
        attaaack(RIGHTHAND)
        if(RIGHTHAND==0){
            return
        }
        rightHandFree = false
        
        setTimeout(()=>{
            rightHandFree = true
        },items[RIGHTHAND].attack.cooldown)
        return
    }
    if(event.button ==0 && leftHandFree)
    {
        attaaack(LEFTHAND)
        if(LEFTHAND==0){
            return
        }
        leftHandFree = false
        setTimeout(()=>{
            leftHandFree = true
        },items[LEFTHAND].attack.cooldown)
    }

})
// document.getElementById("gamewindow").addEventListener("click",(event)=>{
//     clickX = event.offsetX;
//     clickY = event.offsetY
//     clickType = event.button

// })
document.getElementById("gamewindow").addEventListener("mouseup",(event)=>{
    mouseDown = false;
    clickType = event.button
    
})
window.addEventListener("keydown",(event)=>{
    if(event.key == "Shift"){
        isShiftPressed = true
    }
    //key events that can occur on the main menu below this
    if(isMainMenu)
    {
        return
    }
    //key events that can occur on the pause menu below this
    if(event.key == "Escape")
    {
        isPaused = !isPaused;
    }

    if(isPaused)
    {
        return
    }
    //Key events that modify the game below this
    userKeys[event.key] = true;
    if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","w","a","s","d"].indexOf(event.key)>-1)
    {
        MOVING = true;
    }
    if("ArrowLeft"==event.key||"a"==event.key)
    {
        DIRECTION = DIRECTION_LEFT
    }
    if("ArrowRight" == event.key||"d"==event.key)
    {
        DIRECTION = DIRECTION_RIGHT
    }
    if(event.key=="e"){
        inventoryOpen = !inventoryOpen
    }
})
window.addEventListener("keyup",(event)=>{
    if(event.key == "Shift"){
        isShiftPressed = false
    }
    if(isPaused)
    {
        return
    }
    userKeys[event.key] = false;
    if(!(userKeys["ArrowLeft"]||userKeys["ArrowRight"]||userKeys["ArrowDown"]||userKeys["ArrowUp"]||userKeys["w"]||userKeys["a"]||userKeys["s"]||userKeys["d"]))
    {
        MOVING = false;
    }
})

function generateMap(width, height)
{
    level = []
    for (let i = 0; i < height; i++) {
        level.push([])
        for(let j = 0; j<width; j++) {
            level[i].push(Math.floor((Math.random()*5)+1))
        }        
    }
}

function gameInit(){
    isMainMenu = true
    isPaused = true
    setInterval(gameloop,(1000/60))
    RIGHTHAND= 0
    LEFTHAND = 0
    hasClicked["inventory-button"] = false

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

        if(isMainMenu)
        {
            mainMenu()
            return
        }

        pauseMenu()
    }
    gamescreen.fillText(targetX+", "+targetY,50,70)

    //gamescreen.drawImage(document.getElementById("roadtile"),32,32,48,48)
    
}

function BUTTon(x,y,text,){ //lol butts

}

function mainMenu()
{
    gamescreen.drawImage(document.getElementById("titlescreen"),0,0,500,300)
    if(mouseX>20 && mouseX<149 && mouseY>210 && mouseY<264)
    {
        gamescreen.filter = "brightness(1.5)"
        if(mouseDown)
        {
            isMainMenu = false
            isPaused = false
            LEVEL = 0
            level = LEVELS[LEVEL].lvldata
            currentlevelHeight = LEVELS[LEVEL].lvlheight
            currentlevelWidth = LEVELS[LEVEL].lvlwidth
        }
    }
    gamescreen.drawImage(document.getElementById("mainmenu-begin"),20,210,129,54)
    gamescreen.filter = "none"

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
    
    

    if(userKeys["ArrowLeft"]||userKeys["a"])
    {
        cameraX += PLAYERSPEED
        if(userKeys["ArrowDown"]||userKeys["ArrowUp"]||userKeys["w"]||userKeys["s"]){
            cameraX = oldX
            cameraX +=PLAYERSPEED/Math.sqrt(2)
        }
        if(TILES[level[-1*(Math.floor((cameraY+12)/48)-2)][-1*(Math.floor((cameraX+15)/48)-4)]]["collision"] == 1 || TILES[level[-1*(Math.floor((cameraY-30)/48)-2)][-1*(Math.floor((cameraX+15)/48)-4)]]["collision"] == 1){
            cameraX = oldX
        }
    }
    if(userKeys["ArrowRight"]||userKeys["d"])
    {
        cameraX -= PLAYERSPEED
        if(userKeys["ArrowDown"]||userKeys["ArrowUp"]||userKeys["w"]||userKeys["s"]){
            cameraX = oldX
            cameraX -=PLAYERSPEED/Math.sqrt(2)
        }
        if(TILES[level[-1*(Math.floor((cameraY+12)/48)-2)][-1*(Math.floor((cameraX-24)/48)-4)]]["collision"] == 1 || TILES[level[-1*(Math.floor((cameraY-30)/48)-2)][-1*(Math.floor((cameraX-24)/48)-4)]]["collision"] == 1){
            cameraX = oldX
        }

    }
    
    if(userKeys["ArrowDown"]||userKeys["s"])
    {
        cameraY -= PLAYERSPEED
        if(userKeys["ArrowLeft"]||userKeys["ArrowRight"]||userKeys["a"]||userKeys["d"]){
            cameraY = oldY
            cameraY -=PLAYERSPEED/Math.sqrt(2)
        }
        if(TILES[level[-1*(Math.floor((cameraY-30)/48)-2)][-1*(Math.floor((cameraX+15)/48)-4)]]["collision"] == 1 || TILES[level[-1*(Math.floor((cameraY-30)/48)-2)][-1*(Math.floor((cameraX-24)/48)-4)]]["collision"] == 1){
            cameraY = oldY
        }
    }
    if(userKeys["ArrowUp"]||userKeys["w"])
    {
        cameraY += PLAYERSPEED
        if(userKeys["ArrowLeft"]||userKeys["ArrowRight"]||userKeys["a"]||userKeys["d"]){
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
    gamescreen.imageSmoothingEnabled = false
    gamescreen.fillStyle = "white" 
    //text
    if(DEBUG_showMouse) {
        gamescreen.fillText(mouseX,50,50)
        gamescreen.fillText(mouseY,50,70)
    }
    let targetXs, targetYs
    //background
    for(let i = 0; i<currentlevelHeight; i++)
    {
        for(let j=0; j<currentlevelWidth; j++)
        {
            if(level[i][j] > 0){
                let tx = Math.round(cameraX+(j*48))
                let ty = Math.round(cameraY+(i*48))
                gamescreen.drawImage(document.getElementById(TILES[level[i][j]]["img"]),tx,ty,48,48)
                if(tx <= mouseX && (tx+48)>mouseX && ty<=mouseY && (ty+48)>mouseY){
                    targetX = j
                    targetY = i
                    targetXs = tx
                    targetYs = ty
                }
            }            
        }
    }
    
    gamescreen.strokeStyle = "yellow"
    gamescreen.lineWidth = 3
    gamescreen.strokeRect(targetXs,targetYs,48,48)
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

    if(LEFTHAND>0){
        gamescreen.drawImage(document.getElementById(items[LEFTHAND].src),220,120,48,48)
    }
    gamescreen.restore()
    
    //log
    
    if(DEBUG_showHitboxes){
        gamescreen.strokeStyle = "red"
        gamescreen.strokeRect(223,131,42,42)
    }
    gamescreen.fillText(playerX+", "+playerY,50,50)
    for(let i = 0; i<Math.min(8,log.length);i++)
    {
        gamescreen.fillText(log[log.length-i],10,i*10)
    }
    //GUI
    gamescreen.drawImage(document.getElementById("inventory-"+items[LEFTHAND].name),400,250,36,36)
    gamescreen.drawImage(document.getElementById("inventory-"+items[RIGHTHAND].name),442,250,36,36)
    if(inventoryOpen){
        gamescreen.drawImage(document.getElementById("pocket-open"),346,250,36,36)
    }
    else{
        gamescreen.drawImage(document.getElementById("pocket-closed"),346,250,36,36)
    }
    //inventory and other popups
    gamescreen.fillStyle = "#bd9f6f"
    gamescreen.strokeStyle = "#4d3422"
    gamescreen.linewidth = 3
    let hovereditem = ""
    if(inventoryOpen){
        gamescreen.fillRect(349,72,130,171)
        gamescreen.strokeRect(348,71,130,171)
        for(let i = 0; i<4; i++)
        {
            for(let j =0; j<3; j++){
                let ishovered = false

                if(mouseX>(353+(42*j))&&mouseX<(353+(42*j)+36)&& mouseY>(75+(42*i))&&mouseY<(75+(42*i)+36)){
                    gamescreen.filter = "brightness(1.5)"
                    hovereditem = items[inventory[i][j]]
                    if(mouseDown && !hasClicked["inventory-button"]){
                        hasClicked["inventory-button"] = true
                        if(clickType==0){
                            let temp = LEFTHAND
                            LEFTHAND = inventory[i][j]
                            inventory[i][j] = temp 
                        }
                        if(clickType==2){
                            let temp = RIGHTHAND
                            RIGHTHAND = inventory[i][j]
                            inventory[i][j] = temp
                        }
                    }
                    if(!mouseDown)
                    {
                        hasClicked["inventory-button"] = false
                    }
                }
                gamescreen.drawImage(document.getElementById("inventory-"+items[inventory[i][j]].name),353+(42*j),75+(42*i),36,36)
                gamescreen.filter = "none"
                gamescreen.fillStyle = "black"
            }
        }
        gamescreen.fillText(hovereditem.name==undefined? "": hovereditem.name,mouseX,mouseY-5)
        gamescreen.fillStyle = "black"

    }
}
function log(txt)
{
    logs.push(txt)
}
function entity()
{
    return {
        imgsrc:"ERROR",
        width:0,
        height:0,
        attacks:[],
        mvmntAI:{},
        name:"",
        vulnerabilities:[],
        immunities:[],
        resistances:[]
    }
}

function attack(damage,cooldown,damagetypes){
    return {
        damage:{
            randBoundLow:0,
            randBoundHigh:6,
            randBoundMult:1,
            randBoundModf:0
        },
        cooldown:1000,
        //cooldown is in ms
        damagetypes: []
    }
}
window.onload = function(){
    gameInit()
}

function pauseMenu()
{
    gamescreen.filter = "none"
    if(mouseX>178 && mouseX<322 && mouseY > 132 && mouseY < 170){
        gamescreen.filter = "brightness(1.5)"
        if(mouseDown)
        {
            isPaused = false
        }
    }
    gamescreen.drawImage(document.getElementById("menuContinue"),178,132,144,36)
    gamescreen.filter = "none"

    if(mouseX>185 && mouseX<315 && mouseY > 182 && mouseY < 220){
        gamescreen.filter = "brightness(1.5)"
    }
    gamescreen.drawImage(document.getElementById("menuOptions"),178,182,144,36)
    gamescreen.filter = "none"
}

function clearlog()
{
    logs =[]
}

function attaaack(whichonehuh){
    console.log(items[whichonehuh])
}