/*******************************************************/
// lobby.mjs
// Guess The Number game
// A simple lobby where you wait till you get redirected
// to guess the number game! waiting area
// written by Aditi Modi term 1 2026
/*******************************************************/

import { db, auth } from "./firebase.mjs";

import {
    ref,
    push,
    set,
    onValue
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


/*******************************************************/
// VARIABLES
/*******************************************************/

// HTML ELEMENTS
const lobbyInput =
document.getElementById("lobby-name-input");

const createLobbyBtn =
document.getElementById("create-lobby-btn");

const lobbyList =
document.getElementById("lobby-list");


/*******************************************************/
// DISPLAY LOBBIES
/*******************************************************/

function displayLobbies(firebaseData) {

    // clear old lobbies
    lobbyList.innerHTML = "";

    // if no lobbies exist
    if (!firebaseData) {

        lobbyList.innerHTML = `
        <p style="
            color:#b9ffea;
            font-family:Orbitron;
            text-align:center;
        ">
            No active lobbies yet...
        </p>
        `;

        return;
    }

    // loop through firebase lobbies
    Object.entries(firebaseData).forEach(([lobbyId, lobby]) => {

        // create lobby container
        const lobbyItem =
        document.createElement("div");

        lobbyItem.classList.add("player-item");

        // lobby HTML
        lobbyItem.innerHTML = `
            <span>${lobby.lobbyName}</span>

            <button class="join-btn">
                JOIN
            </button>
        `;

        // JOIN BUTTON
        const joinBtn =
        lobbyItem.querySelector(".join-btn");

        joinBtn.addEventListener("click", () => {

            alert(`Joining lobby: ${lobby.lobbyName}`);

            // later:
            // window.location.href = "gtn_game.html";

        });

        // add lobby to page
        lobbyList.appendChild(lobbyItem);

    });
}


/*******************************************************/
// CREATE LOBBY
/*******************************************************/

createLobbyBtn.addEventListener("click", () => {

    const lobbyName =
    lobbyInput.value.trim();

    // prevent empty lobby names
    if (lobbyName === "") {

        alert("Please enter a lobby name!");
        return;
    }

    // current logged in user
    const user = auth.currentUser;

    // check user logged in
    if (!user) {

        alert("You must be logged in!");
        return;
    }

    // reference to GTN/lobbies
    const lobbiesRef =
    ref(db, "GTN/lobbies");

    // create unique firebase ID
    const newLobbyRef =
    push(lobbiesRef);

    /*******************************************************/
    // WRITE RECORD TO FIREBASE
    /*******************************************************/

    set(newLobbyRef, {

        lobbyName: lobbyName,
        hostUID: user.uid,
        status: "waiting"

    });

    // clear the input
    lobbyInput.value = "";

});

/*******************************************************/
// LIVE FIREBASE LISTENER
/*******************************************************/

// reference to firebase lobbies
const lobbiesRef =
ref(db, "GTN/lobbies");

// update page whenever firebase changes
onValue(lobbiesRef, (snapshot) => {

    const data = snapshot.val();

    displayLobbies(data);

}); 