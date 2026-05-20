/*******************************************************/
// lobby.mjs
// Guess The Number game lobby
/*******************************************************/

import {
    fb_initialise,
    fb_writeLobby,
    fb_readLobbies,
    FB_GAMEDB
}
from "../fb/fb_io.mjs";

import {
    ref,
    update
}
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";


/*******************************************************/
// HTML ELEMENTS
/*******************************************************/
const lobbyInput =
    document.getElementById("lobby-name-input");

const createLobbyBtn =
    document.getElementById("create-lobby-btn");

const lobbyList =
    document.getElementById("lobby-list");


/*******************************************************/
// INITIALISE FIREBASE
/*******************************************************/
fb_initialise();


/*******************************************************/
// DISPLAY LOBBIES
/*******************************************************/
function displayLobbies(firebaseData) {

    console.log(
        "displayLobbies called with data:",
        firebaseData
    );

    // CLEAR OLD LOBBIES
    lobbyList.innerHTML = "";

    // IF NO LOBBIES EXIST
    if (!firebaseData) {

        lobbyList.innerHTML =
        `<p style="
            color:#b9ffea;
            font-family:Orbitron;
            text-align:center;
        ">
            no active lobbies yet...
        </p>`;

        return;
    }

    /*******************************************************/
    // LOOP THROUGH FIREBASE LOBBIES
    /*******************************************************/
    Object.keys(firebaseData).forEach((lobbyUID) => {

        const lobby =
            firebaseData[lobbyUID];

        // CREATE DIV
        const lobbyItem =
            document.createElement("div");

        lobbyItem.classList.add("player-item");

        // HTML
        lobbyItem.innerHTML = `
            <span>${lobby.lobbyName}</span>

            <button class="join-btn">
                JOIN
            </button>
        `;

        // GET JOIN BUTTON
        const joinBtn =
            lobbyItem.querySelector(".join-btn");

        /*******************************************************/
        // JOIN BUTTON
        /*******************************************************/
        joinBtn.addEventListener("click", () => {

            console.log(
                "Joining lobby:",
                lobby.lobbyName
            );

            const lobbyRef =
                ref(FB_GAMEDB,
                    'GTN/Lobbies/' + lobby.lobbyName
                );

            update(lobbyRef, {

                guestUID:
                    sessionStorage.getItem("uid"),

                guestName:
                    sessionStorage.getItem("displayName"),

                accepted:
                    "yes"

            });

            window.location.href = "waiting_room.html?lobby=" + lobby.lobbyName;

        });

        // ADD TO PAGE
        lobbyList.appendChild(lobbyItem);

    });

}


/*******************************************************/
// CREATE LOBBY
/*******************************************************/
createLobbyBtn.addEventListener("click", () => {

    const lobbyName =
        lobbyInput.value.trim();

    console.log(
        "CREATE LOBBY clicked:",
        lobbyName
    );

    // STOP ANY EMPTY NAMES
    if (lobbyName === "") {

        alert("Please enter a lobby name!");
        return;
    }

    /*******************************************************/
    // CREATE LOBBY OBJECT
    /*******************************************************/
    const lobbyRecord = {

        uid: sessionStorage.getItem("uid"),

        userName: sessionStorage.getItem("displayName"),

        lobbyName: lobbyName,

        accepted: "no"
    };

    console.log("Lobby record being written:", lobbyRecord);

    /*******************************************************/
    // WRITE TO FIREBASE
    /*******************************************************/
    fb_writeLobby(lobbyRecord);

    window.location.href = "waiting_room.html?lobby=" + lobbyName;

    // CLEAR INPUT
    lobbyInput.value = "";

});


/*******************************************************/
// READ LOBBIES FROM FIREBASE
/*******************************************************/
fb_readLobbies((firebaseData) => {

    displayLobbies(firebaseData);

});

