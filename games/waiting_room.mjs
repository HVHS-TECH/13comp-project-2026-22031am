/*******************************************************/
// waiting_room.mjs
/*******************************************************/

import {
    fb_initialise,
    FB_GAMEDB
}
from "../fb/fb_io.mjs";

import {
    ref,
    onValue
}
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

/*******************************************************/
// INITIALISE FIREBASE
/*******************************************************/
fb_initialise();

/*******************************************************/
// HTML ELEMENTS
/*******************************************************/

const lobbyNameText = document.getElementById("lobby-name");

const hostNameText = document.getElementById("host-name");
const guestNameText = document.getElementById("guest-name");
const statusText = document.getElementById("status-text");

/*******************************************************/
// GET LOBBY NAME FROM THE URL
/*******************************************************/

const params = new URLSearchParams(window.location.search);

const lobbyName = params.get("lobby");

console.log("Lobby name:", lobbyName);

/*******************************************************/
// SHOW LOBBY NAME
/*******************************************************/
lobbyNameText.innerHTML = "Lobby: " + lobbyName;

/*******************************************************/
// FIREBASE REFERENCE
/*******************************************************/
const lobbyRef = ref(FB_GAMEDB, 'GTN/Lobbies/' + lobbyName);

/*******************************************************/
// WATCH LOBBY
/*******************************************************/
onValue(lobbyRef, (snapshot) => {

    const lobby = snapshot.val();
    if (!lobby) return;

    console.log("Lobby updated: ", lobby);

/*******************************************************/
// DISPLAY HOST
/*******************************************************/
    hostNameText.innerHTML = "Host: " + lobby.userName;

/*******************************************************/
// DISPLAY GUEST
/*******************************************************/

if (lobby.guestName) {

    guestNameText.innerHTML = "Guest: " + lobby.guestName;

} else {
    guestNameText.innerHTML = "Guest: waiting...";
}

/*******************************************************/
    // START GAME IF ACCEPTED
/*******************************************************/

if(lobby.accepted === "yes") {
    
    statusText.innerHTML = "Opponent connected! </br>"+ "Redirecting to the guess the number game shortly...";
    setTimeout(() => {

        window.location.href = "GTN_game.html?lobby=" + lobbyName;
    }, 2000);

}
});








