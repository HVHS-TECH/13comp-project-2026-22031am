/*******************************************************/
// lobby.mjs
// Guess The Number game
// A simple lobby where you wait till you get redirected
// to guess the number game! waiting area (for another player etc)
// written by Aditi Modi term 1 2026
/*******************************************************/

import {
    fb_initialise,
    fb_writeLobby,
    fb_readLobbies
}
from "../fb/fb_io.mjs";


/*******************************************************/
// variables()
/*******************************************************/

//HTML ELEMENTS
const lobbyInput = document.getElementById("lobby-name-input");
const createLobbyBtn = document.getElementById("create-lobby-btn");
const lobbyList = document.getElementById("lobby-list");


/*******************************************************/
// INITIALISE FIREBASE
/*******************************************************/
fb_initialise();


/*******************************************************/
// DISPLAY LOBBIES
/*******************************************************/
function displayLobbies(firebaseData) {
    
    console.log("displayLobbies called with data:", firebaseData);  //DIAG
    
    //clear old lobbies
    lobbyList.innerHTML = "";

    //if no lobbies exist 
    if (!firebaseData) {

        lobbyList.innerHTML = 
        '<p style= "color: #b9ffea; font-family: Orbitron; text-align: center;">no active lobbies yet...</p>';

        return;

    }

/*******************************************************/
// LOOP THROUGH FIREBASE LOBBIES
/*******************************************************/

    Object.keys(firebaseData).forEach((uid) => {

    const lobby = 
    firebaseData[uid];

    const lobbyItem = document.createElement("div");
    lobbyItem.classList.add("player-item");

    lobbyItem.innerHTML =  `
    <span>${lobby.lobbyName}</span>

    <button class="join-btn"> 
    JOIN
    </button>

    `;

/*******************************************************/
// JOIN BUTTON
/*******************************************************/

    const joinBtn = lobbyItem.querySelector(".join-btn");
    joinBtn.addEventListener("click", () => {

        alert(`Joining lobby: ${lobby.lobbyName}`);

    });

    lobbyList.appendChild(lobbyItem);
    });
}

/*******************************************************/
// CREATE LOBBY
/*******************************************************/

createLobbyBtn.addEventListener("click", () => {

    const lobbyName = lobbyInput.value.trim();

    console.log("CREATE LOBBY clicked. Lobby name:", lobbyName);  //DIAG

    //stop empty names
    if (lobbyName === "") {

        alert("Please enter a lobby name!");
        return;

}

/*******************************************************/
// CREATE LOBBY OBJECT
/*******************************************************/

const lobbyRecord = {

    uid:
    sessionStorage.getItem("uid"),

    userName:
    sessionStorage.getItem("displayName"),

    lobbyName:
    lobbyName,

    accepted:
    "no"
};

console.log("Lobby record being written:", lobbyRecord);  //DIAG

/*******************************************************/
// WRITE TO FIREBASE
/*******************************************************/

fb_writeLobby(lobbyRecord);

/*******************************************************/
// LOCAL DISPLAY
/*******************************************************/

//clear input
lobbyInput.value = "";
});


/*******************************************************/
// READ LOBBIES FROM FIREBASE
/*******************************************************/
fb_readLobbies((firebaseData) => {

    displayLobbies(firebaseData || {});
});


/*******************************************************/
// START PAGE
/*******************************************************/

