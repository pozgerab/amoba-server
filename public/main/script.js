const createBtn = document.getElementById("create");
const joinBtn = document.getElementById("join");
const idInp = document.getElementById("id");
const username = document.getElementById("name");

async function getData(url, headers) {
    let response = await fetch(url, headers);
    return await response.json();
}

let boardId;
let link;

createBtn.onmouseenter = () => {
    boardId = Math.round(Math.random()*100);
    link = `/boards/new?board=${boardId}`;
    createBtn.href = `/boards/play?board=${boardId}&player=${username.value}`;
};
createBtn.onclick = async () => {
    await fetch(link, {method:'POST'});
    await fetch(`/boards/join?board=${boardId}&player=${username.value}`, {method:'POST'});
};

joinBtn.onmouseenter = () => {
    boardId = idInp.value.toString();
    joinBtn.href = `/boards/play?board=${boardId}&player=${username.value}`;
};

joinBtn.onclick = async () => {
    await fetch(`/boards/join?board=${boardId}&player=${username.value}`, {method:'POST'});
}