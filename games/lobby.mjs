/*******************************************************/
// lobby.mjs
// Guess The Number game
// A simple lobby where you wait till you get redirected to guess the number game! waiting area (for another player etc)
// written by Aditi Modi term 1 2026
/*******************************************************/

/*******************************************************/
// variables()
/*******************************************************/
 
// Lobby variables
let lobbyDiv = document.getElementById("lobbyDiv");
let writingDiv = document.getElementById("writingDiv");
let waitingMessage = document.getElementById("waitingMessage");
let LobbyMessage = document.getElementById("LobbyMessage");

/*******************************************************/
// functions()
/*******************************************************/

//function to display the lobby and waiting message
function displayLobby() {
    LobbyMessage.style.display = "block";
    waitingMessage.style.display = "block";
    lobbyDiv.style.display = "block";
}

function hideLobby() {
    LobbyMessage.style.display();
    waitingMessage.style.display = "none";








