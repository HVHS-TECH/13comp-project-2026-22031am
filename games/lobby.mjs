/*******************************************************/
// lobby.mjs
// Guess The Number game
// A simple lobby where you wait till you get redirected
// to guess the number game! waiting area (for another player etc)
// written by Aditi Modi term 1 2026
/*******************************************************/


/*******************************************************/
// variables()
/*******************************************************/

//HTML ELEMENTS
const lobbyInput = document.getElementById("lobby-name-input");
const createLobbyBtn = document.getElementById("create-lobby-btn");
const lobbyList = document.getElementById("lobby-list");

//Array to store lobbies
let lobbies = [];


/*******************************************************/
// DISPLAY LOBBIES
/*******************************************************/
function displayLobbies() {

    // clear old lobbies
    lobbyList.innerHTML = "";

    // if no lobbies exist
    if (lobbies.length === 0) {

        lobbyList.innerHTML =
        '<p style="color: #b9ffea; font-family: Orbitron; text-align: center;">no active lobbies yet...</p>';

        return;
    }

    // create each lobby
    lobbies.forEach((lobbyName, index) => {

        const lobbyItem =
        document.createElement("div");

        lobbyItem.classList.add("player-item");

        lobbyItem.innerHTML = `
            <span>${lobbyName}</span>

            <button class="join-btn">
                JOIN
            </button>
        `;

        // JOIN BUTTON
        const joinBtn =
        lobbyItem.querySelector(".join-btn");

        joinBtn.addEventListener("click", () => {

            alert(`Joining lobby: ${lobbyName}`);

            // later you can redirect to the actual game
            // window.location.href = "gtn_game.html";

        });

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

    // add to array
    lobbies.push(lobbyName);

    // clear input
    lobbyInput.value = "";

    // update display
    displayLobbies();

});


/*******************************************************/
// DISPLAY LOBBIES
/*******************************************************/
displayLobbies();


/*******************************************************/
// START PAGE
/*******************************************************/


/*******************************************************/
// functions()
/*******************************************************/

// function to display the lobby and waiting message
function displayLobby() {

    LobbyMessage.style.display = "block";
    waitingMessage.style.display = "block";
    lobbyDiv.style.display = "block";

}

function hideLobby() {

    LobbyMessage.style.display = "none";
    waitingMessage.style.display = "none";

}