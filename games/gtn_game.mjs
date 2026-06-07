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

let secretNumber;
let currentTurn;
let hostName;
let guestName;
let gameEnded = false;

const myName = sessionStorage.getItem("displayName");

/*******************************************************/
// SECRET NUMBER FIREBASE REFERENCE AND RANDOM GENERATOR
/*******************************************************/
const secretNumberRef = ref(
    database,
    `GTN/Lobbies/${roomName}/gameData/secretNumber`
);

const guessesRef = ref(
    database,
    `GTN/Lobbies/${roomName}/gameData/guesses`
);

const currentTurnRef = ref(
    database,
    `GTN/Lobbies/${roomName}/gameData/currentTurn`
);


/*******************************************************/
// CREATE SECRET NUMBER IF IT DOESN'T EXIST
/*******************************************************/
get(secretNumberRef).then((snapshot) => {

    // IF NO SECRET NUMBER EXISTS YET
    if (!snapshot.exists()) {

        // Generating random number between 1-100
        let randomNumber = Math.floor(Math.random() * 100) + 1;

        console.log("Generated secret number: " + randomNumber);

        // SAVE TO THE FIREBASE
        set(secretNumberRef, randomNumber);

    } else {

        console.log("Secret number already exists!");

    }

});


/*******************************************************/
// CREATING FIRST TURN (HOST ONLY)
/*******************************************************/

const lobbyRef =
ref(database, `GTN/Lobbies/${roomName}`);

get(lobbyRef).then((snapshot) => {

    const lobby = snapshot.val();

    if(!lobby) return;

    // ONLY HOST CAN CREATE FIRST TURN
    if(lobby.userName === myName) {

        get(currentTurnRef).then((turnSnapshot) => {

            // only create if doesn't exist
            if(!turnSnapshot.exists()) {

                set(currentTurnRef, lobby.userName);

                console.log("Host created first turn");

            }

        });

    }

});


/*******************************************************/
// READ SHARED SECRET NUMBER FROM THE FIREBASE
/*******************************************************/
onValue(secretNumberRef, (snapshot) => {

    secretNumber = snapshot.val();

    console.log("Shared secret number is: " + secretNumber);

});

/*******************************************************/
// READ CURRENT TURN FROM FIREBASE
/*******************************************************/
onValue(currentTurnRef, (snapshot) => {
    currentTurn = snapshot.val();

    console.log("Current turn is: " + currentTurn);

    document.getElementById("turn-box").innerHTML = currentTurn + "'s turn!";

});

/*******************************************************/
// READ THE WINNER
/*******************************************************/
const winnerRef = ref( database, `GTN/Lobbies/${roomName}/gameData/winner`);

onValue(winnerRef, (snapshot) => {
    if(snapshot.exists()) {
        
        gameEnded = true;

        document.getElementById("result-box").innerHTML = 
        snapshot.val() + " WINS THE GAME!! ";
    }
});

/*******************************************************/
// LIVE GAME MESSAGES (SYNC IN BOTH OF THE PLAYERS)
/*******************************************************/
const lastResultRef = ref(database,  `GTN/Lobbies/${roomName}/gameData/lastResult`);

    onValue(lastResultRef, (snapshot) => {
        if(snapshot.exists()) {

            document.getElementById("result-box").innerHTML = snapshot.val();
        }
    });



/*******************************************************/
// PLAYER NAMES
/*******************************************************/
    const playerLobbyRef = 
    ref(database, `GTN/Lobbies/${roomName}`);

    onValue(playerLobbyRef, (snapshot) => {

        const lobby = snapshot.val();

        if(!lobby) return;

        hostName = lobby.userName;
        guestName = lobby.guestName; 

        document.getElementById("host-name").innerHTML = 
        lobby.userName;

        if(lobby.guestName) {

            document.getElementById("guest-name").innerHTML = 
            lobby.guestName;

        } else {

            document.getElementById("guest-name").innerHTML = 
            "Waiting for guest to join...";
        }
    });

/*******************************************************/
// CHECK THE GUESS FUNCTION
/*******************************************************/
function checkGuess() {

    /*******************************************************/
    // GET HTML ELEMENTS
    /*******************************************************/
    const guessInput = document.getElementById("guess-input");

    const resultBox = document.getElementById("result-box");

        if(gameEnded) {
            resultBox.innerHTML = "Game already finished! Please start a new game to play again.";

            return;
        }

     /*******************************************************/
    // CHECK TURN
    /*******************************************************/
    if(currentTurn !== myName) {

        resultBox.innerHTML = "It's not your turn! Please wait for your buddy to take their turn.";

            return;
    }

    /*******************************************************/
    // STOP THE GAME IF SOMEONE ALREADY WON
    /*******************************************************/
    const winnerRef = ref(database,
    `GTN/Lobbies/${roomName}/gameData/winner`
);

    get(winnerRef).then((snapshot) => {
        if (snapshot.exists()) {

            resultBox.innerHTML = snapshot.val() + " already won the game! Please start a new game to play again.";

            return;
        }
        });

    /*******************************************************/
    // CHECK IF GAME LOADING
    /*******************************************************/
    if(secretNumber == null) {

        resultBox.innerHTML = "Game still loading...";

        return;
    }

    /*******************************************************/
    // GET PLAYER GUESS
    /*******************************************************/
    let guess = Number(guessInput.value);

    if(guessInput.value === "" ||
        guess < 1 ||
        guess > 100 
    ) {
        resultBox.innerHTML = "Please enter a valid number from 1-100";
        return;
    }


    const guessID = Date.now();

    /*******************************************************/
    // SAVE GUESS TO FIREBASE
    /*******************************************************/

    set(ref(database,  `GTN/Lobbies/${roomName}/gameData/guesses/${guessID}`
    ),
    {
        player: currentTurn,
        number: guess
    }
);

    console.log("Player guessed: " + guess);

    const winnerRef =  ref(database,
`GTN/Lobbies/${roomName}/gameData/winner`
);



    /*******************************************************/
    // CHECK GUESS
    /*******************************************************/

    let message = "";

    if (guess === secretNumber) {

        message = `${currentTurn} guessed ${guess} — CORRECT!`;

        resultBox.innerHTML = message;
        set(ref(database, `GTN/Lobbies/${roomName}/gameData/winner`
    ), currentTurn);

    return;
    }

    else if (guess < secretNumber) {
    
    message = `${currentTurn} guessed ${guess} — too low!`;
    }

    else {
         message = `${currentTurn} guessed ${guess} — too high! `;

}

    //show on the screen
    resultBox.innerHTML = message;

    //send to firebase so BOTH players can see it
    set(ref(database,  `GTN/Lobbies/${roomName}/gameData/lastResult`), message);
    

    /*******************************************************/
    // SWITCH TURNS
    /*******************************************************/
    let nextTurn;

    if(currentTurn === hostName) { 
        nextTurn = guestName; 

    } else {

        nextTurn = hostName; 
    
    }
    set(currentTurnRef, nextTurn);

    }

   
/*******************************************************/
// MAKE FUNCTION ACCESSIBLE FROM HTML
/*******************************************************/
window.checkGuess = checkGuess;