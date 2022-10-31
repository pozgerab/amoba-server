const createBtn = document.getElementById("createBtn");
const joinBtn = document.getElementById("joinBtn");
const createDiv = document.getElementById("create");
const joinDiv = document.getElementById("join");
const idInp = document.getElementById("id");
const username = document.getElementById("name");
const usernameDiv = document.getElementById("nameDiv");

const rows = document.getElementById("rows");
const columns = document.getElementById("columns");
const players = document.getElementById("players");
const required = document.getElementById("required");
const dropdown = document.getElementById("dropdown");
const createSettings = document.getElementById("settings-create");
const joinSettings = document.getElementById("settings-join");

let createToggle = false;
let joinToggle = false;

async function getData(url, headers) {
    let response = await fetch(url, headers);
    return await response.json();
}

function checkValidInput(create) {
    let arr;
    if (create) {
        arr = [rows, columns, players, required, username];
        if ((arr.map(tag => {return tag.value})).includes("")) {
            return [false, (arr.filter(tag => {return tag.value == ""}))];
        }
        return [true, []];
    } else if (!create) {
        arr = [idInp, username]
        if ((arr.map(tag => {return tag.value})).includes("")) {
            return [false, (arr.filter(tag => {return tag.value == ""}))];
        }
        return [true, []];
    }
    return [false, []];
}

function indicateInvalidInputs(isCreateMode) {
    let [isValid, arr] = checkValidInput(isCreateMode);
    if (isValid) {
        return true;
    }
    arr.forEach(element => {
        let original = element;
        let originalplaceholder = element.attributes.placeholder.value;
        element.attributes.placeholder.value = "You need something here!";
        element.style.backgroundColor = "darkred";
        setTimeout(() => {
            element.style = original.style;
            element.attributes.placeholder.value = originalplaceholder;
        }, 5000);
    })
    return false;
}

/*document.body.onclick = () => {
    let [isValid, arr] = checkValidInput(true);
    //console.log(isValid);
    //console.log(arr);
    console.log(arr[0].attributes);
}*/
 
let boardId;
let link;

createDiv.onmouseenter = () => {
    boardId = Math.round(Math.random()*100);
    link = `/boards/new?board=${boardId}&columns=${columns.value}&rows=${rows.value}&required=${required.value}&players=${players.value}`;
};
createDiv.onclick = async () => {
    joinToggle = false;
    if (createToggle == false) {
        joinSettings.style.height = "0px";
        joinSettings.style.visibility = "hidden";
        createSettings.style.height = "auto";
        createSettings.style.visibility = "visible";
        usernameDiv.style.height = "auto";
        usernameDiv.style.visibility = "visible";
        createToggle = true;
        return;
    }
    if (!indicateInvalidInputs(true)) {return}
    await fetch(link, {method:'POST'});
    await fetch(`/boards/join?board=${boardId}&player=${username.value}`, {method:'POST'});
    window.location = `/boards/play?board=${boardId}&player=${username.value}`;
};

joinDiv.onmouseenter = () => {
    boardId = idInp.value.toString();
};

joinDiv.onclick = async () => {
    createToggle = false;
    if (joinToggle == false) {
        createSettings.style.height = "0px";
        createSettings.style.visibility = "hidden";
        joinSettings.style.height = "auto";
        joinSettings.style.visibility = "visible";
        usernameDiv.style.height = "auto";
        usernameDiv.style.visibility = "visible";
        joinToggle = true;
        return;
    }
    if (!indicateInvalidInputs(false)) {return}
    await fetch(`/boards/join?board=${boardId}&player=${username.value}`, {method:'POST'});
    window.location = `/boards/play?board=${boardId}&player=${username.value}`;
}