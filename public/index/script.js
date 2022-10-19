const container = document.getElementById("container");
const idBox = document.getElementById("roomID");
const nameBox = document.getElementById("yourname");
const currentPlayerBox = document.getElementById("current");
const playersBox = document.getElementById("players");
/*let board = {
    id: 0,
    board: [
        [0,0,2],
        [0,0,0],
        [0,0,0]
    ],
    settings: {
        columns: 3,
        rows: 3,
        needed: 3,
        stepTime: 30,
        maxPlayers: 2
    },
    currentPlayerId: 1,
    playerAmount: 2,
    players: players,
    moves: []}
    */

//let you = board.players.find(tag => {return tag.name == yourname});
let board = JSON.parse(document.currentScript.getAttribute('game'));
let yourname = document.currentScript.getAttribute('yourname');
console.log(board);
idBox.innerHTML = board.id;
nameBox.innerHTML = yourname;
let currentPlayer = board.players.find(tag => {return tag.gamerId == board.currentPlayerId});
currentPlayerBox.innerHTML = currentPlayer.name;
board.players.forEach(element => {
    let opt = document.createElement("option");
    opt.text = element.name;
    opt.disabled = true;
    playersBox.appendChild(opt);
});

async function getData(url, headers) {
    let response = await fetch(url, headers);
    return await response.json();
}

function getTileByID(tileID) {
    return document.getElementById(tileID);
}

function getTileValue(tile) {
    return tile.firstChild.innerHTML;
}

function getTileValueByID(tileID) {
    return document.getElementById(tileID).firstChild.innerHTML;
}

function getTileID(tile) {
    return tile.id;
}

async function turn(clickedTile) {
    //let player = board.players.find((element) => {return element.gamerId == board.currentPlayerId});
    let tilePos = getTileID(clickedTile);
    let res = await fetch(`/boards/move?board=${board.id}&player=${yourname}&column=${tilePos.split(";")[0]}&row=${tilePos.split(";")[1]}`, {method:'POST'});
    if (res.status == 418) {
        return false;
    }
    //location.reload();
    return true;
}

async function reloadBoard() {
    
    board = await getData(`/boards/get?board=${board.id}`, {method:'GET', headers: {"Content-Type": "application/json"}});
    for (let i = 0; i < board.settings.columns; i++) {
        for (let j = 0; j < board.settings.rows; j++) {
            const element = document.createElement("button");
            element.className = "tile";
            element.id = `${i};${j}`;
            element.addEventListener("click", (e) => {turn(element);})
            const name = document.createElement("p");
            if (board.board[i][j] == 0) {
                name.innerHTML = "";
            } else {
                name.innerHTML = board.players.find((e) => {if (e.gamerId == board.board[i][j]) {return true;};}).icon;
            }
            element.appendChild(name);
            container.appendChild(element);
            
        }
        const br = document.createElement("div");
        br.className = "break";
        container.appendChild(br);
        
    }
}

async function getRes() {
    let res = await getData(`/boards/get?board=${board.id}`, {method:'GET', headers: {"Content-Type": "application/json"}});
    return res;
}

reloadBoard();
let updatedBoard;
async function checkBoard() {
    if (board.currentPlayerId != yourname) {
        while (true) {
            updatedBoard = await getRes();
            if (board.currentPlayerId != updatedBoard.currentPlayerId) {
                location.reload();
                return;
            }
        }
    }
}
checkBoard();

console.log(getRes());
