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
// INITIALIZE FIREBASE
/*******************************************************/
const app = initializeApp(FB_GAMECONFIG);

const database = getDatabase(app);


/*******************************************************/
// VARIABLES
/*******************************************************/
const params = new URLSearchParams(window.location.search);

const roomName = params.get("room");
    console.log("ROOM NAME:", roomName);

let secretNumber = null;
let currentTurn = null;
let hostName = null;
let guestName = null;
let gameEnded = false;

const myName = sessionStorage.getItem("displayName");
    console.log("MY NAME:", myName);


/*******************************************************/
// FIREBASE REFERENCES
/*******************************************************/

// firebase reference to the shared secret number
// used by both of the players during the game  

    const secretNumberRef = ref(
    database,
    `GTN/Lobbies/${roomName}/gameData/secretNumber`
);

    const currentTurnRef = ref(
    database,
    `GTN/Lobbies/${roomName}/gameData/currentTurn`
);

    const winnerRef = ref(
    database,
    `GTN/Lobbies/${roomName}/gameData/winner`
);

    const lastResultRef = ref(
    database,
    `GTN/Lobbies/${roomName}/gameData/lastResult`
);

    const playerLobbyRef = ref(
    database,
    `GTN/Lobbies/${roomName}`
);

    const guessInput = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");


/*******************************************************/
// CREATE SECRET NUMBER
/*******************************************************/
get(secretNumberRef).then((snapshot) => {

    // Only create secret number if one does not already exist
    // This prevents different players from generating different numbers

    if (!snapshot.exists()) {

        const randomNumber =
        Math.floor(Math.random() * 100) + 1;

        set(secretNumberRef, randomNumber);

        console.log("Generated secret number:", randomNumber);
    }
});




/*******************************************************/
// CREATE FIRST TURN (HOST ONLY)
/*******************************************************/
get(playerLobbyRef).then((snapshot) => {

    const lobby = snapshot.val();

    if (!lobby) {
        console.log("Lobby not found");
        return;
    }
    console.log("Lobby data:", lobby);

    hostName = lobby.userName;
    guestName = lobby.guestName;

    get(currentTurnRef).then((turnSnapshot) => {

        //ONLY CREATE TURN IF IT DOESN'T EXIST
            if (!turnSnapshot.exists()) {
        
        // HOST ALWAYS STARTS

        set(currentTurnRef, hostName);
        console.log("First turn set to:", hostName);
            }
        });
});


/*******************************************************/
// READ SHARED SECRET NUMBER
/*******************************************************/
onValue(secretNumberRef, (snapshot) => {

    secretNumber = snapshot.val();

    console.log("Secret number:", secretNumber);

});


/*******************************************************/
// READ CURRENT TURN
/*******************************************************/

    // Listen for turn changes and update both players screen
    // whenever the current turn changes in firebase
onValue(currentTurnRef, (snapshot) => {

    currentTurn = snapshot.val();

    const turnBox =
    document.getElementById("turn-box");

    if (currentTurn) {

        turnBox.innerHTML =
        `${currentTurn}'s turn!`;

        /*******************************************************/
        // MY TURN
        /*******************************************************/
        if (currentTurn === myName) {

            guessInput.disabled = false;
            guessButton.disabled = false;

        }

        /*******************************************************/
        // NOT MY TURN
        /*******************************************************/
        else {

            guessInput.disabled = true;
            guessButton.disabled = true;

        }

    }

    else {

        turnBox.innerHTML =
        "Loading turn...";

    }

});


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
// LIVE RESULT SYNC
/*******************************************************/
onValue(lastResultRef, (snapshot) => {

    if (snapshot.exists()) {

        document.getElementById("result-box").innerHTML =
        snapshot.val();

    }

});


/*******************************************************/
// PLAYER NAMES
/*******************************************************/
onValue(playerLobbyRef, (snapshot) => {

    const lobby = snapshot.val();

    if (!lobby) return;

    hostName = lobby.userName || "Host";

    guestName = lobby.guestName || null;

    document.getElementById("host-name").innerHTML =
    hostName;

    if (guestName) {

        document.getElementById("guest-name").innerHTML =
        guestName;

    }

    else {

        document.getElementById("guest-name").innerHTML =
        "Waiting for guest...";

    }

});

/*******************************************************/
// CHECK GUESS FUNCTION
/*******************************************************/
function checkGuess() {

    /*******************************************************/
    // HTML ELEMENTS
    /*******************************************************/
    const resultBox =
    document.getElementById("result-box");


    /*******************************************************/
    // CHECK IF GAME ENDED 
    /*******************************************************/
    if (gameEnded) {

        resultBox.innerHTML =
        "Game already finished!";

        return;

    }

    /*******************************************************/
    // TURN CHECK
    /*******************************************************/
    if (currentTurn !== myName) {

        resultBox.innerHTML =
        "<span style='color:red; font-weight:bold;'>Sorry! It's not your turn!</span>";

        return;

    }

    /*******************************************************/
    // GAME LOADING CHECK
    /*******************************************************/
    if (secretNumber === null) {

        resultBox.innerHTML =
        "Game still loading...";

        return;

    }


    /*******************************************************/
    // GET PLAYER GUESS
    /*******************************************************/
    let guess = Number(guessInput.value);

    /*******************************************************/
    // VALIDATION
    /*******************************************************/
    if (
        guessInput.value === "" ||
        guess < 1 ||
        guess > 100
    ) {

        resultBox.innerHTML =
        "Please enter a number from 1-100";

        return;

    }

    /*******************************************************/
    // SAVE THE GUESS TO THE FIREBASE
    /*******************************************************/

    // save every guess to firebase as the game activity and is stored so can be viewed
    const guessID = Date.now();

    set(
        ref(
            database,
            `GTN/Lobbies/${roomName}/gameData/guesses/${guessID}`
        ),
        {
            player: currentTurn,
            number: guess
        }
    );


    /*******************************************************/
    // CHECK GUESS
    /*******************************************************/
    let message = "";


    /*******************************************************/
    // CORRECT GUESS
    /*******************************************************/
    if (guess === secretNumber) {

        //console log comments for testing if it works 
        console.log("CORRECT GUESS!");
        console.log("Winner:", currentTurn);
        console.log("Host:", hostName);
        console.log("Guest:" + guestName);
        

        message =
        `${currentTurn} guessed ${guess} — CORRECT!`;

        set(winnerRef, currentTurn);
    
    /*******************************************************/
    // UPDATE LEADERBOARD EACH TIME
    /*******************************************************/

    //WINNER
    const winnerLeaderboardRef = ref(database, `GTN/Leaderboard/${currentTurn}`
    );

    // Determine which player lost the game
    // based on who correctly guessed the number
    const loserName = 
    currentTurn === hostName
    ? guestName
    : hostName;

    // LOSER
    const loserLeaderboardRef = ref(database, `GTN/Leaderboard/${loserName}`
    );


    /*******************************************************/
    // UPDATE WINNER STATS
    /*******************************************************/

    // Read the winner's current leaderboard data
    // and increase their win count by 1
    get(winnerLeaderboardRef).then((snapshot) => {

        let currentWins = 0;
        let currentLosses = 0;

        if (snapshot.exists()) {

            currentWins = snapshot.val().wins || 0;
            currentLosses = snapshot.val().losses || 0;
        }

        set(winnerLeaderboardRef, {
            wins: currentWins + 1,
            losses: currentLosses
        });
    });

    /*******************************************************/
    // UPDATE THE LOSER STATS
    /*******************************************************/

    // read the loser's current leaderboard data
    // and increase their loss count by 1
    get(loserLeaderboardRef).then((snapshot) => {

    let currentWins = 0;
    let currentLosses = 0;

    if (snapshot.exists()) {

        currentWins = snapshot.val().wins || 0;
        currentLosses = snapshot.val().losses || 0;
    }

    set(loserLeaderboardRef, {
        wins: currentWins,
        losses: currentLosses + 1
    });

});

/*******************************************************/
// UPDATE RESULT MESSAGE
/*******************************************************/
    set(lastResultRef, message);

    resultBox.innerHTML = message;

    // CLEAR INPUT BOX 
    guessInput.value = "";
    return;



        set(lastResultRef, message);

        resultBox.innerHTML = message;

        // CLEAR INPUT BOX
        guessInput.value = "";

        return;

    }


    /*******************************************************/
    // TOO LOW
    /*******************************************************/
    if (guess < secretNumber) {

        message =
        `${currentTurn} guessed ${guess} — too low!`;

    }


    /*******************************************************/
    // TOO HIGH
    /*******************************************************/
    else {

        message =
        `${currentTurn} guessed ${guess} — too high!`;

    }


    /*******************************************************/
    // SHOW RESULT
    /*******************************************************/
    resultBox.innerHTML = message;

    set(lastResultRef, message);


    /*******************************************************/
    // CLEAR INPUT BOX
    /*******************************************************/
    guessInput.value = ""; 


    /*******************************************************/
    // SWITCH TURN
    /*******************************************************/
    let nextTurn; // alternate turns between the host and guest player

    if (currentTurn === hostName) {

        nextTurn = guestName;

    } else {

        nextTurn = hostName;

    }

    console.log("Switching turn to:", nextTurn);

    set(currentTurnRef, nextTurn);

}

/*******************************************************/
// LEAVE GAME FUNCTION
/*******************************************************/
    function leaveGame() {

        const confirmLeave = confirm("Are you sure you want to leave the game?");

        if (!confirmLeave) return;
        window.location.href = "lobby.html";
    }


/*******************************************************/
// MAKE FUNCTION ACCESSIBLE FROM HTML
/*******************************************************/
window.checkGuess = checkGuess;
window.leaveGame = leaveGame;