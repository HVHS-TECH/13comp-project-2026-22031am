/*******************************************************/
// gtn_game.mjs
// Guess the number page
// Main entry for GTN_game.html
// A simple 2-player game where you play guess the number with another buddy
// written by Aditi Modi term 1 & 2 2026
/*******************************************************/


/*******************************************************/
// IMPORTS
/*******************************************************/
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    onValue,
    get
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

/*******************************************************/
// FIREBASE CONFIG
/*******************************************************/
const FB_GAMECONFIG = {
    apiKey: "AIzaSyDWhGSciprdeHTyBrXQYt_F-6tMMjCg-YM",
    authDomain: "comp-2026-aditi-modi.firebaseapp.com",
    databaseURL: "https://comp-2026-aditi-modi-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "comp-2026-aditi-modi",
    storageBucket: "comp-2026-aditi-modi.firebasestorage.app",
    messagingSenderId: "153559444524",
    appId: "1:153559444524:web:7144aeb2795255e4e1b589",
    measurementId: "G-0KELMX0418"
};

/*******************************************************/
// INIT
/*******************************************************/
const app = initializeApp(FB_GAMECONFIG);
const database = getDatabase(app);

/*******************************************************/
// VARIABLES
/*******************************************************/
const params = new URLSearchParams(window.location.search);
const roomName = params.get("room");

let secretNumber = null;
let currentTurn = null;
let hostName = null;
let guestName = null;
let gameEnded = false;

const myName = sessionStorage.getItem("displayName");

/*******************************************************/
// FIREBASE REFERENCES
/*******************************************************/
const secretNumberRef = ref(database, `GTN/Lobbies/${roomName}/gameData/secretNumber`);
const currentTurnRef = ref(database, `GTN/Lobbies/${roomName}/gameData/currentTurn`);
const winnerRef = ref(database, `GTN/Lobbies/${roomName}/gameData/winner`);
const lastResultRef = ref(database, `GTN/Lobbies/${roomName}/gameData/lastResult`);
const playerLobbyRef = ref(database, `GTN/Lobbies/${roomName}`);

/*******************************************************/
// CREATE SECRET NUMBER
/*******************************************************/
get(secretNumberRef).then((snapshot) => {
    if (!snapshot.exists()) {
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        set(secretNumberRef, randomNumber);
        console.log("Generated secret:", randomNumber);
    }
});

/*******************************************************/
// SET FIRST TURN (HOST ONLY)
/*******************************************************/
get(playerLobbyRef).then((snapshot) => {
    const lobby = snapshot.val();
    if (!lobby) return;

    if (lobby.userName === myName) {
        get(currentTurnRef).then((turnSnap) => {
            if (!turnSnap.exists()) {
                set(currentTurnRef, lobby.userName);
            }
        });
    }
});

/*******************************************************/
// READ SECRET NUMBER
/*******************************************************/
onValue(secretNumberRef, (snapshot) => {
    secretNumber = snapshot.val();
});

/*******************************************************/
// READ TURN
/*******************************************************/
onValue(currentTurnRef, (snapshot) => {
    currentTurn = snapshot.val();

    const turnBox = document.getElementById("turn-box");

    const guessInput = document.getElementById("guess-input");
    const guessInput = document.getElementById("guess-button");

    if (currentTurn) {

        turnBox.innerHTML = `${currentTurn}'s turn!`;

    // MY TURN
    if (currentTurn === myName) {

        guessInput.disabled = false;
        guessButton.disabled = false;

    }
    // NOT MY TURN 
    else {
        guessInput.disabled = true;
        guestButton.disabled = true;
    }

    } else {
        turnBox.innerHTML = "Waiting for game...";
    }

/*******************************************************/
// READ WINNER
/*******************************************************/
onValue(winnerRef, (snapshot) => {
    if (snapshot.exists()) {
        gameEnded = true;

        document.getElementById("result-box").innerHTML =
            snapshot.val() + " WINS THE GAME!!";
    }
});

/*******************************************************/
// SYNC LAST RESULT (BOTH SCREENS)
/*******************************************************/
onValue(lastResultRef, (snapshot) => {
    if (snapshot.exists()) {
        document.getElementById("result-box").innerHTML = snapshot.val();
    }
});

/*******************************************************/
// PLAYER NAMES (FIXED SAFELY)
/*******************************************************/
onValue(playerLobbyRef, (snapshot) => {
    const lobby = snapshot.val();
    if (!lobby) return;

    hostName = lobby.userName || "Host";
    guestName = lobby.guestName || null;

    document.getElementById("host-name").innerHTML = hostName;

    document.getElementById("guest-name").innerHTML =
        guestName ? guestName : "Waiting for guest...";
});

/*******************************************************/
// CHECK GUESS
/*******************************************************/
function checkGuess() {
    const guessInput = document.getElementById("guess-input");
    const resultBox = document.getElementById("result-box");

    // game ended check
    if (gameEnded) {
        resultBox.innerHTML = "Game already finished!";
        return;
    }

    // turn check
    if (currentTurn !== myName) {
        resultBox.innerHTML = 
        "<span style='color: red; font-weight: bold;' > Sorry! It's not your turn!. </span>";
        return;
    }

    // loading check
    if (secretNumber === null) {
        resultBox.innerHTML = "Game still loading...";
        return;
    }

    const guess = Number(guessInput.value);

    if (!guess || guess < 1 || guess > 100) {
        resultBox.innerHTML = "Enter number 1–100";
        return;
    }

    const guessID = Date.now();

    // save guess
    set(ref(database, `GTN/Lobbies/${roomName}/gameData/guesses/${guessID}`), {
        player: currentTurn,
        number: guess
    });

    let message = "";

    if (guess === secretNumber) {
        message = `${currentTurn} guessed ${guess} — CORRECT!`;

        set(winnerRef, currentTurn);
        set(lastResultRef, message);

        // clear the textbox after the guess
        guessInput.value = "";

        resultBox.innerHTML = message;
        return;
    }

    if (guess < secretNumber) {
        message = `${currentTurn} guessed ${guess} — too low!`;
    } else {
        message = `${currentTurn} guessed ${guess} — too high!`;
    }

    resultBox.innerHTML = message;
    set(lastResultRef, message);

    // switch turn
    const nextTurn = currentTurn === hostName ? guestName : hostName;
    set(currentTurnRef, nextTurn);
}

/*******************************************************/
// EXPORT
/*******************************************************/
window.checkGuess = checkGuess;