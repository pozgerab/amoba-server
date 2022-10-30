const createBtn = document.getElementById("createBtn");
const joinBtn = document.getElementById("joinBtn");
const createDiv = document.getElementById("create");
const joinDiv = document.getElementById("join");
const idInp = document.getElementById("id");
const username = document.getElementById("name");

const rows = document.getElementById("rows");
const columns = document.getElementById("columns");
const players = document.getElementById("players");
const required = document.getElementById("required");
const dropdown = document.getElementById("dropdown");
const div = document.getElementById("settings");

let toggle = false;

dropdown.onclick = () => {
    if(toggle == true) {
        div.className = "";
        toggle = false;
    } else {
        div.className = "reveal";
        toggle = true;
    }
};

async function getData(url, headers) {
    let response = await fetch(url, headers);
    return await response.json();
}

let boardId;
let link;

createDiv.onmouseenter = () => {
    boardId = Math.round(Math.random()*100);
    link = `/boards/new?board=${boardId}&columns=${columns.value}&rows=${rows.value}&required=${required.value}&players=${players.value}`;
};
createDiv.onclick = async () => {
    await fetch(link, {method:'POST'});
    await fetch(`/boards/join?board=${boardId}&player=${username.value}`, {method:'POST'});
    window.location = `/boards/play?board=${boardId}&player=${username.value}`;
};

joinDiv.onmouseenter = () => {
    boardId = idInp.value.toString();
};

joinDiv.onclick = async () => {
    await fetch(`/boards/join?board=${boardId}&player=${username.value}`, {method:'POST'});
    window.location = `/boards/play?board=${boardId}&player=${username.value}`;
}