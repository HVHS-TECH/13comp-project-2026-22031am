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
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

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

const hostPhoto = document.getElementById("host-photo");
const guestPhoto = document.getElementById("guest-photo");

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
if (lobbyNameText) {
    lobbyNameText.innerHTML = "Lobby: " + lobbyName;
}

/*******************************************************/
// FIREBASE REFERENCE
/*******************************************************/
const lobbyRef = ref(FB_GAMEDB, 'GTN/Lobbies/' + lobbyName);

/*******************************************************/
// WATCH LOBBY
/*******************************************************/
onValue(lobbyRef, (snapshot) => { // listen for real-time changes to the lobby

    const lobby = snapshot.val();
    if (!lobby) return;

    console.log("Lobby updated: ", lobby);

/*******************************************************/
// DISPLAY HOST
/*******************************************************/
    hostNameText.innerHTML = lobby.userName;

    if(lobby.userPhoto) {
        hostPhoto.src = lobby.userPhoto; //grabs the google profile pic of the user and displays the host and guest on the waiting room page
    }

/*******************************************************/
// DISPLAY GUEST
/*******************************************************/

    if(lobby.guestName){

        guestNameText.innerHTML = lobby.guestName;

    } else {
        guestNameText.innerHTML = 
        "Waiting for opponent to join...";
    }

     if(lobby.guestPhoto){

        guestPhoto.src = lobby.guestPhoto;
    }

/*******************************************************/
    // START GAME IF ACCEPTED
/*******************************************************/

    if(lobby.guestName && lobby.accepted === "playing") {

        statusText.innerHTML = "Opponent has joined! <br> Starting game...";

        setTimeout(() => {
            console.log("REDIRECTING NOW");

            window.location.href =  `GTN_game.html?room=${lobbyName}`;

        }, 1500);
    }
});











